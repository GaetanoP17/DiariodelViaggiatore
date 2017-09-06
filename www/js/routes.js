/**
 * Created by Gaetano on 15/08/2017.
 */

angular.module('starter.routes', [])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.itinerari', {
        url: '/itinerari',
        views: {
          'menuContent': {
            templateUrl: 'templates/itinerari.html',
          }
        }
      })

      .state('app.map', {
        url: '/map',
        views: {
          'menuContent': {
            templateUrl: 'templates/map.html',
            controller: 'MapCtrl'
          }
        }
      });
      /*.state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: 'PathCtrl'
          }
        }
      })

      .state('app.itinerari', {
        url: '/itinerari',
        views: {
          'menuContent': {
            templateUrl: 'templates/itinerari.html',
          }
        }
      })

      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/map.html',
          }
        }
      })
      /*.state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })

      .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlist.html',
            controller: 'PlaylistCtrl'
          }
        }
      })
    */
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/map');
  });
