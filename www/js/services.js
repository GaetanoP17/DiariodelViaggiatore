/**
 * Created by Gaetano on 16/08/2017.
 */

angular.module('starter.services', [])

   /*
    Questo servizio definisce tutte le query possibili sul dataset RDF
    @Author Gaetano Prisco
   */
  .service('ontology',['$http', '$ionicPopup', '$window',
    function ($http, $ionicPopup, $window) {

      var prefixQuery = "PREFIX spod: <http://www.datiopen.it/lod/>\n"
        + "PREFIX qb:   <http://purl.org/linked-data/cube#>\n"
        + "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n"
        + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n";

      var url_to_endpointQuery = 'http://' + getIp() + ':3030/Monumenti/query?query=';
      var urt_to_endpointUpdate = 'http://' + getIp() + ':3030/Monumenti/update?update=';
      var url_to_endpointGraph = '<http://' + getIp() + ':3030/Monumenti/data/Itinerario>\n';

      /*
        Recupera le coordinate, il nome e l'id di tutti i monumenti presenti nel dataset
        @Author Gaetano Prisco
     */
      this.giveMonumentsCoord = function (callback)
      {
        var monuments = "\n SELECT DISTINCT ?nome ?longitudine ?latitudine ?id\n"
          + "WHERE {"
          + "?riga spod:97afda96-7dcb-4143-9bcc-3e29f6f73e98-dimension-cnome ?nome;"
          + " spod:97afda96-7dcb-4143-9bcc-3e29f6f73e98-dimension-cidentificatore_in_openstreetmap ?id;"
          + " spod:97afda96-7dcb-4143-9bcc-3e29f6f73e98-dimension-clongitudine ?longitudine;"
          + " spod:97afda96-7dcb-4143-9bcc-3e29f6f73e98-dimension-clatitudine ?latitudine."
          + " FILTER(?nome != \"\")}";

        var queryUrl = url_to_endpointQuery + encodeURIComponent(prefixQuery + monuments) + "&format=json";
        var monumentsObj = new Array();
        $http.get(queryUrl)
          .success(function (data, status, headers, config) {
             data.results.bindings.forEach(function (record) {
              var obj =
                {
                  "id": record.id.value,
                  "nome": record.nome.value,
                  "latitudine": parseFloat(record.latitudine.value),
                  "longitudine": parseFloat(record.longitudine.value)
                };
              monumentsObj.push(obj);
            });
             console.log(monumentsObj);
            /*
              Esempio utilizzo--> Salviamo nella variabile markers le info sui monumenti
              var markers;
              ontology.giveMonumentsCoord( function (elenco){markers=elenco;});
             */
            callback(monumentsObj);
          })
          .error(function (status) {
            var alert = $ionicPopup.alert(
              {
                title: 'MARKER SEMANTICI',
                template: 'Riprovare più tardi!'
              });
            alert.then(function () {
              $window.location.reload();
            });
          });
      }
      /*
        Recupera il nome e l'id del monumento che presenta determinate coordinate
        @Author Gaetano Prisco
       */
      this.giveMonumentsStartEndName = function (latStart, longStart, latEnd, longEnd, callback)
      {
        var monumentsName = "\n SELECT DISTINCT ?nome ?id\n"
          + "WHERE {{"
          + "?riga spod:97afda96-7dcb-4143-9bcc-3e29f6f73e98-dimension-cnome ?nome;"
          + " spod:97afda96-7dcb-4143-9bcc-3e29f6f73e98-dimension-cidentificatore_in_openstreetmap ?id;"
          + " spod:97afda96-7dcb-4143-9bcc-3e29f6f73e98-dimension-clongitudine" + '"'+ longStart + '"'+";"
          + " spod:97afda96-7dcb-4143-9bcc-3e29f6f73e98-dimension-clatitudine " + '"'+ latStart + '"'+".}"
          + "UNION {"
          + "?riga spod:97afda96-7dcb-4143-9bcc-3e29f6f73e98-dimension-cnome ?nome;"
          + " spod:97afda96-7dcb-4143-9bcc-3e29f6f73e98-dimension-cidentificatore_in_openstreetmap ?id;"
          + " spod:97afda96-7dcb-4143-9bcc-3e29f6f73e98-dimension-clongitudine" + '"'+ longEnd + '"'+";"
          + " spod:97afda96-7dcb-4143-9bcc-3e29f6f73e98-dimension-clatitudine " + '"'+ latEnd + '"'+".}}"

        var queryUrl = url_to_endpointQuery + encodeURIComponent(prefixQuery + monumentsName) + "&format=json";
        var monumentsObj = new Array();
        $http.get(queryUrl)
          .success(function (data, status, headers, config) {
            data.results.bindings.forEach(function (record) {
              var obj =
                {
                  "id": record.id.value,
                  "nome": record.nome.value
                };
              monumentsObj.push(obj);
            });
            console.log(monumentsObj);
            callback(monumentsObj);
          })
          .error(function (status) {
            var alert = $ionicPopup.alert(
              {
                title: 'MARKER SEMANTICI',
                template: 'Riprovare più tardi!'
              });
            alert.then(function () {
              $window.location.reload();
            });
          });
      }

      this.giveMonumentsNameByCords = function (lat, long, callback)
      {
        var monumentsName = "\n SELECT DISTINCT ?nome ?id\n"
          + "WHERE {"
          + "?riga spod:97afda96-7dcb-4143-9bcc-3e29f6f73e98-dimension-cnome ?nome;"
          + " spod:97afda96-7dcb-4143-9bcc-3e29f6f73e98-dimension-cidentificatore_in_openstreetmap ?id;"
          + " spod:97afda96-7dcb-4143-9bcc-3e29f6f73e98-dimension-clongitudine" + '"'+ long + '"'+";"
          + " spod:97afda96-7dcb-4143-9bcc-3e29f6f73e98-dimension-clatitudine " + '"'+ lat + '"'+".}";

        var queryUrl = url_to_endpointQuery + encodeURIComponent(prefixQuery + monumentsName) + "&format=json";
        var monumentsObj = new Array();
        $http.get(queryUrl)
          .success(function (data, status, headers, config) {
            data.results.bindings.forEach(function (record) {
              var obj =
                {
                  "id": record.id.value,
                  "nome": record.nome.value
                };
              monumentsObj.push(obj);
            });
            console.log(monumentsObj);
            callback(monumentsObj);
          })
          .error(function (status) {
            var alert = $ionicPopup.alert(
              {
                title: 'MARKER SEMANTICI',
                template: 'Riprovare più tardi!'
              });
            alert.then(function () {
              $window.location.reload();
            });
          });
      }

      /*
       Permette di recuperare l'id dell'ultimo itinerario presente
       Utilizzo: ontology.giveIdPath(function (id){ontology.insertPath(id,part,arrivo,tappe)});
       @Author Gaetano Prisco
    */
      this.giveIdPath = function (callback)
      {
        console.log("sono giveIdPath");
          var id;
          var giveID="SELECT DISTINCT ?id \n"
                      + "FROM NAMED " + url_to_endpointGraph
                      + "WHERE\n" + "{\n"
                      + "GRAPH " + url_to_endpointGraph
                      + "{\n" +"?class spod:170310-dimension-id ?id\n"
                      + "}\n" + "}\n"
                      + "ORDER BY DESC(?id) LIMIT 1";

          var queryUrl = url_to_endpointQuery + encodeURIComponent(prefixQuery + giveID) + "&format=json";

        $http.get(queryUrl)
          .success(function (data, status, headers, config) {
            if(data.results.bindings.length == 0)
            {id=1;
              callback(id);}
            else
            {
              id=parseInt(data.results.bindings[0].id.value) + 1;
              //return id;
              callback(id);
            }

          })
          .error(function (status) {
            var alert = $ionicPopup.alert(
              {
                title: 'MARKER SEMANTICI',
                template: 'Riprovare più tardi!'
              });
            alert.then(function () {
              $window.location.reload();
            });
          });
      }
      /*
         Inserisce un nuovo itinerario nell'ontologia.
         Richiede in input:
         id= id del nuovo percorso (viene recuperato tramite this.giveIdPath)
         partenza= stringa contenente la latitudine e longitudine del punto di partenza es: "lat, long"
         arrivo= stringa contenente la latitudine e longitudine del punto di arrivo finale es: "lat, long"
         tappeIntermedie= stringa contenente la latitudine e longitudine delle tappe intermedie dell'itinerario es: "lat, long, lat1, long1, lat2, long3"
         @Author Gaetano Prisco
      */
      this.insertPath = function (id,partenza,arrivo,tappeIntermedie,numTappe)
      {
         var insertData = "INSERT DATA\n"
            + "{\n GRAPH"+ url_to_endpointGraph
            + "{\n"
            + "spod:170310-row-"+ id +" a qb:Observation;\n"
            + "qb:dataSet spod:dataset-170310;\n"
            + "spod:170310-dimension-numeroTappe " + '"' + numTappe + '"' +"; \n"
            + "spod:170310-dimension-numeroVolte "+ '"' +1+ '"' +"; \n"
            + "spod:170310-dimension-partenza " + '"'+partenza.toString()+'"' + ";\n"
            + "spod:170310-dimension-arrivo " + '"'+arrivo.toString()+'"' + ";\n"
            + "spod:170310-dimension-id " + '"' + id + '"' + ";\n"
            + "spod:170310-dimension-tappeIntermedie " +'"'+ tappeIntermedie +'"' + ";}}";

          var queryUrl = urt_to_endpointUpdate + encodeURIComponent(prefixQuery+insertData);
          console.log(prefixQuery+insertData);
          var req = {
            method: 'POST',
            url: queryUrl,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {test: 'test'}
          }
          $http(req)
            .success(function (data, status, headers, config) {
              console.log("Insert Success");
            })
            .error(function (status)
            {
              var alert = $ionicPopup.alert({
                title: 'MARKER SEMANTICI',
                template: 'Riprovare più tardi!'
              });
              alert.then(function () {
                $window.location.reload();
              });
            });
        }
      /*
          Recupera tutti i percorsi ordinandoli in ordine decrescente del numero di volte che vengono utilizzati
          @Author Gaetano Prisco
       */
      this.giveAllPath = function (callback)
      {
        console.log("sono giveAllPath");
        var path= "\n SELECT DISTINCT ?id ?partenza ?arrivo ?numTappe ?numVolte ?tappeIntermedie \n"
                  + "FROM NAMED " + url_to_endpointGraph
                  + "WHERE\n" + "{\n"
                  + "GRAPH " + url_to_endpointGraph +"\n"
                  + "{\n"
                  + "?a  spod:170310-dimension-arrivo    ?arrivo;\n"
                  +      "spod:170310-dimension-id        ?id;\n"
                  +      "spod:170310-dimension-numeroTappe ?numTappe;\n"
                  +      "spod:170310-dimension-numeroVolte ?numVolte;\n"
                  +      "spod:170310-dimension-partenza  ?partenza;\n"
                  +      "spod:170310-dimension-tappeIntermedie ?tappeIntermedie.\n"
                  +"}\n}"
                  +"ORDER BY DESC(?numVolte)";

        var queryUrl = url_to_endpointQuery + encodeURIComponent(prefixQuery + path) + "&format=json";
        console.log(prefixQuery + path);
        var paths=new Array();
        $http.get(queryUrl)
          .success(function (data, status, headers, config) {
            console.log(data.results.bindings);
            data.results.bindings.forEach(function (record) {
              var obj =
                {
                  "id": record.id.value,
                  "partenza": record.partenza.value,
                  "arrivo": record.arrivo.value,
                  "numVolte": record.numVolte.value,
                  "numTappe": record.numTappe.value,
                  "tappeIntermedie": record.tappeIntermedie.value
                };
              paths.push(obj);
            });
            console.log(paths);
            callback(paths);
          })
          .error(function (status) {
            var alert = $ionicPopup.alert(
              {
                title: 'MARKER SEMANTICI',
                template: 'Riprovare più tardi!'
              });
            alert.then(function () {
              $window.location.reload();
            });
          });
      }

      /*
          Recupera tutte le informazione relative ad un itinerario passando come parametro il suo id
          @Author Gaetano Prisco
       */
      this.givePathById = function (id, callback)
      {
        console.log("sono givePathById");
        var path= "\n SELECT DISTINCT ?id ?partenza ?arrivo ?numTappe ?numVolte ?tappeIntermedie \n"
          + "FROM NAMED " + url_to_endpointGraph
          + "WHERE\n" + "{\n"
          + "GRAPH " + url_to_endpointGraph +"\n"
          + "{\n"
          + "?a  spod:170310-dimension-arrivo    ?arrivo;\n"
          +      "spod:170310-dimension-id" +'"'+id+'"' +";\n"
          +      "spod:170310-dimension-numeroTappe ?numTappe;\n"
          +      "spod:170310-dimension-numeroVolte ?numVolte;\n"
          +      "spod:170310-dimension-partenza  ?partenza;\n"
          +      "spod:170310-dimension-tappeIntermedie ?tappeIntermedie.\n"
          +"}\n} LIMIT 1" ;

        var queryUrl = url_to_endpointQuery + encodeURIComponent(prefixQuery + path) + "&format=json";
        var route=new Array();
        $http.get(queryUrl)
          .success(function (data, status, headers, config) {
            data.results.bindings.forEach(function (record) {
              var obj =
                {
                  "id": id.toString(),
                  "partenza": record.partenza.value,
                  "arrivo": record.arrivo.value,
                  "numVolte": record.numVolte.value,
                  "numTappe": record.numTappe.value,
                  "tappeIntermedie": record.tappeIntermedie.value
                };
              route.push(obj);
            });
            console.log(route);
            callback(route);
          })
          .error(function (status) {
            var alert = $ionicPopup.alert(
              {
                title: 'MARKER SEMANTICI',
                template: 'Riprovare più tardi!'
              });
            alert.then(function () {
              $window.location.reload();
            });
          });
      }

      /*
          Incrementa il numero di volte che l'itinerario è utilizzato
          @Author Gaetano Prisco
       */
      this.increasePathUse= function (id)
      {
        var numVolte;
        var giveNumVolte="\nSELECT DISTINCT ?numVolte \n"
                    + "FROM NAMED " + url_to_endpointGraph
                    + "WHERE\n" + "{\n"
                    + "GRAPH " + url_to_endpointGraph
                    + "{\n" +"?it spod:170310-dimension-id "+ '"' +id+ '"' +";\n"
                    + " spod:170310-dimension-numeroVolte ?numVolte."
                    + "}\n" + "}\n";

        var queryUrl = url_to_endpointQuery + encodeURIComponent(prefixQuery + giveNumVolte) + "&format=json";
        console.log(prefixQuery + giveNumVolte);
        $http.get(queryUrl)
          .success(function (data, status, headers, config) {
            console.log(data.results.bindings);
            data.results.bindings.forEach(function (record) {
              var obj =
                {
                  "numVolte": record.numVolte.value
                };
              numVolte=(parseInt(obj.numVolte) +1).toString();
              var increseQuery = "\n WITH " +  url_to_endpointGraph
                                +"\n DELETE {?it spod:170310-dimension-numeroVolte ?numVolte}\n"
                                +"\n INSERT {?it spod:170310-dimension-numeroVolte " + '"' +numVolte + '"' + " }\n"
                                +"WHERE\n"
                                +"{\n"
                                +  "?it spod:170310-dimension-id " + '"' +id+ '"' +";\n"
                                +  "    spod:170310-dimension-numeroVolte ?numVolte.\n"
                                +  " \n"
                                +"}";
              var queryUrl = urt_to_endpointUpdate + encodeURIComponent(prefixQuery+increseQuery);
              var req = {
                          method: 'POST',
                          url: queryUrl,
                          headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                          },
                          data: {test: 'test'}
                        }
              $http(req)
                .success(function (data, status, headers, config) {
                  console.log("Increase Success");
                })
                .error(function (status)
                {
                  var alert = $ionicPopup.alert({
                    title: 'MARKER SEMANTICI',
                    template: 'Riprovare più tardi!'
                  });
                  alert.then(function () {
                    $window.location.reload();
                  });
                });

              return obj;
            });
          })
          .error(function (status) {
            var alert = $ionicPopup.alert(
              {
                title: 'MARKER SEMANTICI',
                template: 'Riprovare più tardi!'
              });
            alert.then(function () {
              $window.location.reload();
            });
          });
      }
      /*
        Controlla se un itinerario è già presente. Restituisce true in caso positivo false altrimenti
        @Author Gaetano Prisco
       */
      this.checkPath = function(elenco, numTappe, partenza, arrivo, tappeIntermedie)
      {
        console.log("sono checkpath");
        var check=false;
        var id;
        elenco.forEach(function (record)
        {
            if(!check)
            {
              if(([record.numTappe.localeCompare(numTappe.toString())] == 0) && ([record.partenza.localeCompare(partenza.toString())] == 0) && ([record.arrivo.localeCompare(arrivo.toString())] == 0))
              {
                var coords1= tappeIntermedie.split(", ");
                var coords2= record.tappeIntermedie.split(", ");

                for(i=0; i<coords1.length; i++)
                {
                  if([coords1[i].localeCompare(coords2[i])] != 0)
                  {
                    check=false;
                    break;
                  }
                  else
                  {
                    check=true;
                    id=record.id;
                  }
                }
              }
              else check = false;
            }
        })
        console.log(check);
        console.log(id);
        if(check)
        {
          return id;
        }
        else return 0;
      }
      /*
        Recupera la latitudine e la longitudine dei monumenti che costituiscono le tappe intermedie dell'Itinerariio.
        Restituisce un array che contiene in ordine la latitudine e la longitudine
        @Author Gaetano Prisco
       */
      this.giveCoord = function(lista)
      {
        var array= new Array();
        array=lista.split(", ");
        return array;
      }
      this.getNumTappe = function(lista)
      {
        var array= new Array();
        array=lista.split(", ");
        return (array.length/2) + 2;
      }
      function getIp()
      {
        //return "192.168.1.222";
        //return "localhost";
        return "172.19.34.127";
      }
    }])


  /*
        Recupera l'attuale posizione, latitudine e longitudine,  del disposivo
        @Author Gaetano Prisco Davide Romano
     */
.factory('givePosition', function ()
{
  return function (callback)
  {
    var coordinate = [];
    var apiGeolocationSuccess = function (position)
    {
      console.log("sono in apiGeolocationSuccess");

      //location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log(JSON.stringify(location));
      console.log("mie:" + position.coords.latitude + " "+ position.coords.longitude);
      console.log("API geolocation success!\n\nlat = " + position.coords.latitude + "\nlng = " + position.coords.longitude);
      coordinate.push(position.coords.latitude);
      coordinate.push(position.coords.longitude);
      //coordinate.push(location);
      callback(coordinate);
    };

    var tryAPIGeolocation = function () {
      jQuery.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAFl2aAUEC738qzPAixfWbqMzhahtA89Uk", function (success)
      {
        console.log("sono in tryApiGeolocation");
        apiGeolocationSuccess({coords: {latitude: success.location.lat, longitude: success.location.lng}});
      })
        .fail(function (err) {
          alert("API Geolocation error! \n\n" + err);
        });
    };

    var browserGeolocationSuccess = function (position) {

      console.log("Browser geolocation success!\n\nlat = " + position.coords.latitude + "\nlng = " + position.coords.longitude);
      coordinate.push(position.coords.latitude);
      coordinate.push(position.coords.longitude);
      //location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      //coordinate.push(location);
      callback(coordinate);
    };

    var browserGeolocationFail = function (error) {
      switch (error.code) {
        case error.TIMEOUT:
          tryAPIGeolocation();
          //alert("Browser geolocation error !\n\nTimeout.");
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

})

