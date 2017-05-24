
angular.module('app', ['facebook'])

  .config(function(FacebookProvider) {
    FacebookProvider.init('750677705057918');
  })

  .controller('loginCtrl', function ($scope, Facebook, $http) {

    $scope.loginStatus = 'disconnected';
    $scope.facebookIsReady = false;
    $scope.user = null;

    $scope.login = function () {
      Facebook.login(function(response) {
        $scope.loginStatus = response.status;
        console.log(response.authResponse.accessToken);
      }, {scope: 'user_photos'});
    };

    $scope.removeAuth = function () {
      Facebook.api({
        method: 'Auth.revokeAuthorization'
      }, function(response) {
        Facebook.getLoginStatus(function(response) {
          $scope.loginStatus = response.status;
        });
      });
    };

    $scope.api = function () {
      Facebook.api('/me/photos?fields=source', function(response) {
        //$scope.user = response;
        if (response && !response.error) {
        /* handle the result */
        //console.log(response);
        var pictures = response.data;  //response.data[0].source
        console.log(pictures[0].source);

        $http.post('https://api.kairos.com/v2/media?source=' + response.data[0].source, {
            headers: {
              'app_id': 'a8e72acf',
              'app_key': 'b1aae070b192af17bee2c735119fb7a2' //844e29d86c1841db54d33ef5
            }
        }).then(
          function(response) {
            console.log(response);
          }, function(err) {
            console.log(err);
          }
        );

      } else {
        console.log(response.error);
      }
        //console.log(response);
      });
    };

    $scope.$watch(function() {
        return Facebook.isReady();
      }, function(newVal) {
        if (newVal) {
          $scope.facebookIsReady = true;
        }
      }
    );
  });
