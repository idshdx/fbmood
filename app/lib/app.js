
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
        var K_VERSION                   = "1.0";
        var K_SERVICE_URL               = "http://api.sightcorp.com/api/detect/";
        var K_FORM_IMG_FIELD_NAME       = "img";
        var K_FORM_URL_FIELD_NAME       = "url";
        var K_FORM_CLIENT_ID_FIELD_NAME = "4013bb109ec54fd1be6837883ca02833";
        var K_FORM_APP_KEY_FIELD_NAME   = "b0cb197baa6749ce9760182c3b96d054";
        var K_FORM_ATTRIBUTE_FIELD_NAME = "attribute";

        function emotionRequest(img, onSuccessCallback, onFailureCallback ) {
            console.log(img.length);
            var ajaxRequest = new XMLHttpRequest();

            ajaxRequest.open( "POST", K_SERVICE_URL, true);

            //ajaxRequest.setRequestHeader('app_id', '4013bb109ec54fd1be6837883ca02833');
            //ajaxRequest.setRequestHeader('app_key', 'edaa449f018245e18fe028c6c877b8b8');
            //ajaxRequest.setRequestHeader('url', 'http://www.uni-regensburg.de/Fakultaeten/phil_Fak_II/Psychologie/Psy_II/beautycheck/english/durchschnittsgesichter/m(01-32)_gr.jpg');
            //ajaxRequest.setRequestHeader('Content-Type', 'multipart/form-data');

            //ajaxRequest.setData()
            var formData = new FormData(); //API only accepts multipart/form-data content types
            var imgBlob = new Blob([ img ], { type: "image/jpeg" } );
            //var test = URL.createObjectURL(imgBlob);
            formData.append( 'img',       imgBlob);
            formData.append( 'client_id', K_FORM_CLIENT_ID_FIELD_NAME );
            formData.append( 'app_key', K_FORM_APP_KEY_FIELD_NAME );

            ajaxRequest.onreadystatechange = function () {
                if (this.readyState === 4) {
                    console.log('Status:', this.status);
                    console.log('Headers:', this.getAllResponseHeaders());
                    console.log('Body:', this.responseText);
                }
            };

            ajaxRequest.send(formData);


           /* ajaxRequest.onreadystatechange = ( function() {
                console.log( "FACE request completed. Response text : " + ajaxRequest.responseText );
                if( ajaxRequest.status == 200 ) {
                    jsonResponse = JSON.parse( ajaxRequest.responseText );
                    if( jsonResponse.error_code && onFailureCallback ) {
                        onFailureCallback( "F.A.C.E. request failed : " + jsonResponse.description );
                    } else if( onSuccessCallback ) {
                        // Successfull transaction
                        console.log( "FACE successfull request" );
                        onSuccessCallback( JSON.parse( ajaxRequest.responseText ) );
                    }
                } else {
                    console.log( "FACE request failed. HTTP Status = " + ajaxRequest.status );
                    if( onFailureCallback ) {
                        onFailureCallback( "FACE request failed. HTTP Status = " + ajaxRequest.status );
                    }
                }
            } );
            ajaxRequest.send();*/
            console.log( "FACE Sending request" );
        }
        var successCallback = function( data, textStatus, jqXHR ) {
            alert( JSON.stringify( data ) );
            //alert( "First person Age : " + data.persons[0].age.value );
        };

        var failCallback = function( jqXHR, textStatus, errorThrown ) {
            alert( "There has been an error!" );
        };

        function getFbPicturesUrl(fbResponse) {
            if(!fbResponse.length) {
                console.log('Facebook response must not be empty');
                return;
            } else {

            }
        }

        $scope.api = function () {
            Facebook.api('/me/photos?fields=source', function(response) {
                //$scope.user = response;
                if (response && !response.error) {
                    /* handle the result */
                    //console.log(response);
                    var pictures = response.data;  //response.data[0].source
                    console.log(pictures[0].source);

                    //emotionRequest('https://facebook.com/844e29d86c1841db54d33ef5');

                    $http({
                        method: 'GET',
                        url: pictures[0].source,
                        responseType: 'arraybuffer'
                        })
                        .then(function(response){
                            //var jpeg = btoa(response.data);
                            console.log(response.data.length);
                            emotionRequest(response.data);
                        },
                        function(err){
                            console.log(err);
                        });
                    //dataURItoBlob(pictures[0].source);



                } else {
                    console.log(response.error);
                }
                //console.log(response);
            }).then(function(){

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
