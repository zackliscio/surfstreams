'use strict';

let app = angular.module('surfstreams', ['chart.js']);

app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'http://api.surfline.com/**',
    'self'
  ]);
});

app.controller('SurfController', ['$scope', '$http', function($scope, $http) {
  // For more streams, add their name/ID here.
  $scope.sites = [{
    id: 4762,
    name: 'Banyans, Big Island, HI'
  }, {
    id: 10824,
    name: 'Hapuna Bay, Big Island, HI'
  }, {
    id: 13830,
    name: 'Kahalu\'u, Big Island, HI'
  }, {
    id: 4763,
    name: 'Kawaihae, Big Island, HI'
  }, {
    id: 10825,
    name: 'Magics, Big Island, HI'
  }, {
    id: 10823,
    name: 'Pine Trees, Big Island, HI'
  }, {
    id: 4750,
    name: 'Pipeline, O\'ahu, HI'
  }, {
    id: 4193,
    name: 'Morro, Beach, SF'
  }, {
    id: 5065,
    name: 'Pismo Beach, SF'
  }, {
    id: 4127,
    name: 'Ocean Beach, SF'
  }];
}]);

app.controller('SiteController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
  console.debug('Instantiating SiteController');

  // API query params
  let days = 3;
  let resources = 'wind,surf,analysis,weather,tide,sort,watertemp';

  let isInitialized = false;

  $scope.analysis;
  $scope.tide;

  // Tide chart data
  $scope.tideData = [[]];
  $scope.tideLabels = [];

  // Surf chart data
  $scope.surfData = [[], []];
  $scope.surfSeries = ['Surf Min', 'Surf Max'];
  $scope.surfLabels = [];

  $scope.$on('ss.fetch', function() {

    if(isInitialized) {
      console.log('Already initialized');
      return;
    }

    console.dir('Fetching forecast for site ID: ' + $scope.site.id);
    let url = 'http://api.surfline.com/v1/forecasts/'+$scope.site.id+'?resources='+resources+'&days='+days+'&getAllSpots=false&units=e&interpolate=false&showOptimal=false';

    $http.jsonp(url).then(
      function(response) {
        console.dir('Got forecast');
        console.dir(response);

        let forecast = response.data;

        $scope.analysis = $sce.trustAsHtml(forecast.Analysis.short_term_forecast);

        $scope.tide = response.data.Tide;

        angular.forEach(response.data.Tide.dataPoints, function(value, key) {
          let t = moment(value.Localtime).format('ddd, hA');

          $scope.tideLabels.push(t);
          $scope.tideData[0].push(value.height);
        });

        // Surf data is in a nested array.
        // Each element of the root array contains a list of timestamps.
        angular.forEach(forecast.Surf.dateStamp, function(value, i) {
          angular.forEach(value, function(dateString, j) {
            let t = moment(dateString).format('ddd, hA');

            $scope.surfLabels.push(t);
            $scope.surfData[0].push(forecast.Surf.surf_min[i][j]);
            $scope.surfData[1].push(forecast.Surf.surf_max[i][j]);
          });
        });
      }, function(err) {
        console.dir('Error obtaining forecast');
        console.dir(err);
      });

    isInitialized = true;
  });
}]);

app.directive('ssPanel', ['$http', function($http) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/panel.html',
    link: function($scope, element, attrs) {
      let player;

      let playerId = '#player-' + $scope.site.id;

      element.on('hidden.bs.collapse', function(event) {
        console.log('Removing player ' + playerId);
        if(player) player.destroy();
      });

      element.on('shown.bs.collapse', function(event) {
        event.stopPropagation();
        console.dir('show.bs.collapse');

        let url = 'http://api.surfline.com/v1/cams/' + $scope.site.id;

        console.log(url);

        $http.jsonp(url).then(
          function(response) {
            console.log('Got response from Cam ID: ', $scope.site.id);
            console.dir(response);

            let stream = response.data.streamInfo.stream[0].file;

            console.log('Player ' + playerId + ' playing stream: ' + stream);

            player = new Clappr.Player({
              parentId: playerId,
              source: stream,
              autoPlay: true,
              width: '100%',
              height: '100%'
            });
          }, function(err) {
            console.dir('Error reading Surfline API');
            console.dir(err);
          });

        // Broadcast event downards to trigger controllers to fetch aditional data.
        $scope.$broadcast('ss.fetch');
      });
    }
  }
}]);
