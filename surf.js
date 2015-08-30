'use strict';

var app = angular.module('surfstreams', []);

app.controller('SurfController', ['$scope', '$http', function($scope, $http) {
    // For more streams, add their name/ID here.
    $scope.sites = [{
        name: 'Banyans, HI',
        camId: 4762
    }, {
        name: 'Kawaihae, HI',
        camId: 4763
    }, {
        name: 'Morro, Beach, SF',
        camId: 4193
    }, {
        name: 'Pismo Beach, SF',
        camId: 5065
    }, {
        name: 'Ocean Beach, SF',
        camId: 4127
    }];
}]);

app.directive('ssPanel', ['$http', function($http) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/panel.html',
        link: function($scope, element, attrs) {

            var playerId = 'player-'+$scope.site.camId;

            element.on('hidden.bs.collapse', function(event) {
                console.log('Removing player '+playerId);
                jwplayer(playerId).remove();
            });

            element.on('shown.bs.collapse', function(event) {
                event.stopPropagation();
                console.dir('show.bs.collapse');

                var url = 'http://api.surfline.com/v1/cams/' + $scope.site.camId + '?callback=JSON_CALLBACK';

                console.log(url);

                $http.jsonp(url).then(
                    function(response) {
                        console.log('Got response from Cam ID: ', $scope.site.camId);
                        console.dir(response);

                        var stream = response.data.streamInfo.stream[0];

                        console.log('Showing player '+playerId);

                        jwplayer(playerId).setup({
                            primary: 'html5',
                            file: stream.file,
                            autostart: true
                        });

                    }, function(err) {
                        console.dir('Error reading Surfline API');
                        console.dir(err);
                    });
                /*
                $.ajax({
                    url: 'http://api.surfline.com/v1/cams/' + $scope.site.camId,
                    type: 'GET',
                    dataType: 'jsonp',
                    success : function(responseData){
                        console.log('Got response from Cam ID: ', $scope.site.camId)
                        console.dir(responseData)
                        var data = responseData.streamInfo.stream[0];

                        console.log('Showing player '+playerId);

                        jwplayer(playerId).setup({
                            primary: 'html5',
                            file: data.file,
                            autostart: true
                        });
                    }
                });
                */
            });
        }
    }
}]);
