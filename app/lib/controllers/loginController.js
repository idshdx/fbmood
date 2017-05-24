'use strict';

app.controller('loginCtrl', function ($scope, Facebook) {

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
    });module
  };

  $scope.api = function () {
    Facebook.api('/me/photos?type=uploaded', function(response) {
      //$scope.user = response;
      if (response && !response.error) {
      /* handle the result */
      console.log(response);
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
