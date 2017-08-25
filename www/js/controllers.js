angular.module('starter.controllers', ['ngMap'])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };
  })

  .controller('PlaylistsCtrl', function($scope) {
    $scope.playlists = [
      { title: 'Reggae', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 }
    ];
  })

  .controller('PlaylistCtrl', function($scope, $stateParams) {
  })

  .controller('MapCtrl', function($scope, $stateParams, $cordovaGeolocation, $http)
  {



    var lat;
    var long;
    var alt;

    $scope.markers= [];
    $scope.userposition=[];
    $scope.lati=0;
    var lunghezza=0;


    $scope.posizione=function() {
      var apiGeolocationSuccess = function (position) {

        $scope.lati = parseFloat(position.coords.latitude);
        $scope.long = parseFloat(position.coords.longitude);

        $scope.userposition.push({
          lati: position.coords.latitude,
          longi: position.coords.longitude
        })


        console.log($scope.userposition)

        onSuccess(position)
        console.log("API geolocation success!\n\nlat = " + position.coords.latitude + "\nlng = " + position.coords.longitude);

      };

      var tryAPIGeolocation = function () {
        jQuery.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAFl2aAUEC738qzPAixfWbqMzhahtA89Uk", function (success) {
          apiGeolocationSuccess({coords: {latitude: success.location.lat, longitude: success.location.lng}});
        })
          .fail(function (err) {
            alert("API Geolocation error! \n\n" + err);
          });
      };

      var browserGeolocationSuccess = function (position) {

        console.log("Browser geolocation success!\n\nlat = " + position.coords.latitude + "\nlng = " + position.coords.longitude);
      };

      var browserGeolocationFail = function (error) {
        switch (error.code) {
          case error.TIMEOUT:
            alert("Browser geolocation error !\n\nTimeout.");
            break;
          case error.PERMISSION_DENIED:
            if (error.message.indexOf("Only secure origins are allowed") == 0) {
              tryAPIGeolocation();
            }
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Browser geolocation error !\n\nPosition unavailable.");
            break;
        }
      };

      var tryGeolocation = function () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            browserGeolocationSuccess,
            browserGeolocationFail,
            {maximumAge: 50000, timeout: 20000, enableHighAccuracy: true});
        }
      };
      tryGeolocation();

    }



    function onSuccess(position)
    {


      $scope.lat  = position.coords.latitude;
      $scope.long = position.coords.longitude;
      alt  = position.coords.altitude;

      angular.extend($scope,
        {



        });




    };




    $scope.init=function(){
      //$http.get('file:///android_asset/www/Monumenti.json')
      $http.get('Monumenti.json')
        .then(function(res){
          $scope.todos = res.data;

          for (var i = 0; i < $scope.todos.length; i++) {

            $scope.markers.push( {

              lat: parseFloat($scope.todos[i].clatitudine.replace(",", ".")),
              lng: parseFloat($scope.todos[i].clongitudine.replace(",", ".")),
              comune: $scope.todos[i].ccomune,
              provincia:$scope.todos[i].cprovincia,
              regione: $scope.todos[i].cregione,
              nome: $scope.todos[i].cnome,
              tipo:$scope.todos[i].ctipo,
              anno_inserimento:$scope.todos[i].canno_inserimento,
              data_e_ora_inserimento:$scope.todos[i].cdata_e_ora_inserimento,
              identificatore_in_openstreetmap:$scope.todos[i].cidentificatore_in_openstreetmap,

            });

          }
          function objLength(obj){
            var i=0;
            for (var x in obj){
              if(obj.hasOwnProperty(x)){
                i++;
              }
            }
            return i;
          }
          lunghezza=objLength($scope.markers)


     $scope.posizione()

        })

    }


    /*$scope.getPosition = function()
    {*/
    function onError(err)
    {
      console.log('code: '    + err.code    + '\n' + 'message: ' + err.message + '\n');
    }

    //}
  });


