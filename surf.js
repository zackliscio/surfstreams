'use strict';

var app = angular.module('surfstreams', []);

app.controller('SurfController', ['$scope', '$http', function($scope, $http) {
    // For more streams, add their name/ID here.
    $scope.sites = [{
        id: 4762,
        name: 'Banyans, HI'
    }, {
        id: 4763,
        name: 'Kawaihae, HI'
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

app.directive('ssPanel', ['$http', function($http) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/panel.html',
        link: function($scope, element, attrs) {
            $scope.analysis = 'WOOT';

            var playerId = 'player-' + $scope.site.id;

            element.on('hidden.bs.collapse', function(event) {
                console.log('Removing player ' + playerId);
                jwplayer(playerId).remove();
            });

            element.on('shown.bs.collapse', function(event) {
                event.stopPropagation();
                console.dir('show.bs.collapse');

                var url = 'http://api.surfline.com/v1/cams/' + $scope.site.id + '?callback=JSON_CALLBACK';

                console.log(url);

                $http.jsonp(url).then(
                    function(response) {
                        console.log('Got response from Cam ID: ', $scope.site.id);
                        console.dir(response);

                        var stream = response.data.streamInfo.stream[0];

                        console.log('Showing player '+playerId);

                        jwplayer(playerId).setup({
                            primary: 'html5',
                            file: stream.file,
                            autostart: true,
                            width: '100%',
                            aspectratio: '16:9'
                        });
                    }, function(err) {
                        console.dir('Error reading Surfline API');
                        console.dir(err);
                    });
            });
        }
    }
}]);
