angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout)
{

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

.controller('PlaylistsCtrl', function($scope, ontology) {
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
  .controller('MapCtrl', function(ontology, givePosition, $scope, $stateParams, $cordovaGeolocation, $http, NgMap, $ionicLoading, $ionicPopup)
//.controller('MapCtrl', function(ontology, givePosition, NgMap, $scope, $cordovaGeolocation, $http, $ionicPopup, $window)
{
  $scope.markers= [];
  $scope.userposition=[];
  $scope.lati=0;
  var lunghezza=0;
  $scope.wayPoints = [];
  $scope.MarkerIcon = ('img/marker.png');
  $scope.lat;
  $scope.long;
  $scope.end = [];

  $ionicLoading.show({
    content: 'Please Wait',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
  $scope.init = function () {
    givePosition(function (coordinate)
    {
      console.log(coordinate);
      $scope.lat=coordinate[0];
      $scope.long=coordinate[1];
      $scope.location=coordinate[2];
    })
  }


  ontology.giveMonumentsCoord(function (elenco)
  {
    $scope.markers = elenco;
    $ionicLoading.hide();
  });

  NgMap.getMap().then(function(map)
  {
    $scope.map = map;
  });

  $scope.showInfoWindow = function (event, p)
  {
      $scope.infowindow = new google.maps.InfoWindow();
      var center = new google.maps.LatLng(p[0],p[1]);

      var nome="";

      $scope.markers.forEach(function(record)
      {
        if(record.latitudine === p[0] && record.longitudine === p[1])
        {
          nome=record.nome;
          console.log(record.longitudine);
          console.log(p[0]);
          console.log(p[1]);
        }
      })
      /*for(i=0;i<$scope.markers.length;i++){
        if($scope.markers[i].lat===p[0] && $scope.markers[i].lng===p[1]){

          nome=$scope.markers[i].nome
        }
      }*/
      $scope.infowindow.setContent(
        '<h6>' + nome+ '</h6>');

      $scope.infowindow.setPosition(center);
      $scope.infowindow.open($scope.map);
  };

    $scope.closeInfoWindow = function (){

    $scope.infowindow.close();

  }

  $scope.showCity = function(event, city) {
    console.log(city);
    $scope.selectedCity = city;
    $scope.map.showInfoWindow('myInfoWindow', this);
  };

  $scope.getpos = function(event,lat)
  {
    $scope.mostra=true;
    $scope.la=lat;
    $scope.desti;

    $scope.end.push(
      {
        location: {lat: $scope.la[0], lng: $scope.la[1]}, stopover: true
      }
    )
    console.log("è lungo "+$scope.wayPoints.length);

    if($scope.end.length==1){
      $scope.desti=$scope.end[$scope.end.length-1].location;
    }
    else if($scope.end.length>1)
    {
      angular.copy($scope.end,$scope.wayPoints );
      $scope.wayPoints.splice($scope.end.length-1,1);
      $scope.desti=$scope.end[$scope.end.length-1].location;
      console.log($scope.end);
      console.log($scope.wayPoints);
      /*window.setTimeout(function(){$scope.$apply();
      },1);*/
    }
  }
  $scope.cancella = function()
  {
    $scope.end=[];
    $scope.wayPoints=[];
    $scope.mostra=false;
  }
  var percorso;
  //var stringa="";

  $scope.save=function()
  {
    var flag=true;
    var stringa="";
    var y = $scope.end.length;
    if($scope.end.length <= 2)
    {
        stringa="NN, NN";
        flag=false;
        console.log("SONO SONO SONO SONO SONO: "+stringa);
    }
    else {

      for (var i = 1; i < y - 1; i++) {
        if (y != 2) {
          if (i == y - 2) {
            stringa = stringa + $scope.end[i].location.lat + ", " + $scope.end[i].location.lng;
          }
          else
            stringa = stringa + $scope.end[i].location.lat + ", " + $scope.end[i].location.lng + ", ";
        }
        else break;
      }
    }
    console.log("2 SONO SONO SONO SONO SONO: "+stringa);
      percorso=
        {
          "partenza": $scope.end[0].location.lat+", "+$scope.end[0].location.lng,
          "arrivo": $scope.end[y-1].location.lat+", "+$scope.end[y-1].location.lng,
          "tappeIntermedie": stringa
        }
      /*
        devo recuperare il numero di tappe var numTappe=ontology.getNumTappe(percorso.tappeIntermedie);
        recupera tutta i percorsi
        controlla se esiste il percorso checkPath(elenco,numTappe,percorso.partenza,percorso.arrivo,percorso.tappeIntermedie
        recupera il prossimo id disponibile
        inserisci il nuovo itinerario
        @Author Gaetano Prisco
      */
      var numTappe;
      if(flag){
        numTappe=ontology.getNumTappe(percorso.tappeIntermedie);
      }
      else numTappe=2;
      var id;
      ontology.giveAllPath(function (elenco)
      {
        id=ontology.checkPath(elenco,numTappe,percorso.partenza,percorso.arrivo,percorso.tappeIntermedie);
        console.log(id);
        //se non c'è uno stesso itinerario
        if(id == 0)
        {
          ontology.giveIdPath(function (id)
          {
            ontology.insertPath(id,percorso.partenza,percorso.arrivo,percorso.tappeIntermedie,numTappe);
            var alertPopup = $ionicPopup.alert({
              title: 'Diario del Viaggiatore',
              template: 'Congratulazioni Hai Inserito Un Nuovo Itinerario'
            });

            alertPopup.then(function(res) {
              console.log("inserimento avvenuto con successo");
            });
          })
        }
        else
        {
          var alertPopup = $ionicPopup.alert({
            title: 'Diario del Viaggiatore',
            template: 'Itinerario Già Presente Nel Diario'
          });

          alertPopup.then(function(res) {
            console.log("inserimento avvenuto con successo");
            ontology.increasePathUse(id);
          });

        }
      })
      console.log(percorso);
    }

})
  /*
    Controller che lavora sulla gestione degli Itinerari
    @Author Gaetano Prisco
   */
  .controller('itinerariCtrl', function(ontology, NgMap, $scope, $ionicPopup, $stateParams, $q, $timeout)
  {
    $scope.paths;
    $scope.monumenti= new Array();

    $scope.inizializza = function () {
      ontology.giveAllPath(function (elenco) {
        console.log("valore di ritorno di give all path: " + elenco);
        $scope.paths = elenco;
        recuperaInfo(elenco);
      })}

    function recuperaInfo(elenco)
    {

       elenco.forEach(function (item) {
         var id = item.id;
         var partenza = ontology.giveCoord(item.partenza);
         var arrivo = ontology.giveCoord(item.arrivo);
         ontology.giveMonumentsStartEndName(partenza[0], partenza[1], arrivo[0], arrivo[1], function (mon)
         {
           for(i=0; i< mon.length; i++)
           {
             var obj =
                 {
                   "partenza": mon[i].nome,
                   "arrivo" : mon[++i].nome,
                   "id" : id
                 }
           }

           $scope.monumenti.push(obj);
         })
       })
      console.log($scope.monumenti);
    }

    $scope.cambia= function(id)
    {
      $scope.mostra=true;
      $scope.IdPath=id;
       ontology.givePathById(id, function (route)
       {
            $scope.start=route[0].partenza;
            $scope.end=route[0].arrivo;
            $scope.middle=getTappe(route[0].tappeIntermedie);
            $scope.infoTappe=route[0].tappeIntermedie;
            $scope.numeroVolte=route[0].numVolte;
       });
    }

    $scope.recuperaInfoItinerario = function () {

      var num = ontology.getNumTappe($scope.infoTappe);
      var elencoTappe = ontology.giveCoord($scope.infoTappe);
      var start= ontology.giveCoord($scope.start);
      var end= ontology.giveCoord($scope.end);
      var elencoTappeCompleto=start.concat(elencoTappe).concat(end);

      var tappe;

      $scope.tappe=new Array();

      ontology.giveMonumentsCoord(function (elenco)
      {
        $scope.lista= new Array();
        $scope.label="";
        var i;
        var j;
        var k=0;
        var alfabeto = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "W", "X", "Y", "Z"];
        console.log(elencoTappeCompleto.length);console.log(elenco.length);

        for(i=0;i<elencoTappeCompleto.length;i++)
        {
          var lat=elencoTappeCompleto[i];
          var long=elencoTappeCompleto[++i];
          for(j=0; j<elenco.length; j++)
          {
            if(((lat.localeCompare(elenco[j].latitudine) == 0) && (long.localeCompare(elenco[j].longitudine)) == 0))
            {
              var obj= {
                "lettera": alfabeto[k],
                "nome" : elenco[j].nome
              }
              $scope.lista.push(obj);
              $scope.label=$scope.label +"<b> " + alfabeto[k] + ":</b> " + elenco[j].nome +"<br>";
              k++;
              break;
            }
          }
        }
        console.log($scope.label);
        visualizzaPopup();
      })

      function visualizzaPopup() {
        console.log("sono dentro il popup");
        var confirmPopup = $ionicPopup.confirm({
          title: 'Info Itinerari',
          subTitle: 'Utilizzerai questo itinerario?',
          template: $scope.label+"Utilizzato <b>"+$scope.numeroVolte+" </b>volte</ion-label>",
          cancelText: "No",
          okText: "SI"
        });

        confirmPopup.then(function (res) {
          if (res)
          {
            ontology.increasePathUse($scope.IdPath);

          } else {
            console.log('Not sure!');
          }
        })
      }
    }

    /*function prendiNome(lat,long) {
      ontology.giveMonumentsNameByCords(lat,long,function (elemento){$scope.tappe.push(elemento[0].nome);})
    }*/

    function getTappe(tappeIntermedie)
    {
      $scope.wayPoints = [];
      var tappe = ontology.giveCoord(tappeIntermedie);
      console.log(tappe);
      console.log("Ecco la lunghezza: " + tappe.length);
      console.log(tappe[0],tappe[1]);
      if(tappe[0]== "NN")
      {
        return $scope.wayPoints;
      }
      else
      {
        for (i = 0; i < tappe.length; i++)
        {

          $scope.wayPoints.push(
            {
              location: {lat: parseFloat(tappe[i]), lng: parseFloat(tappe[++i])}, stopover: true
            }
          );
        }
      }
      return $scope.wayPoints;
    }
  })

