'use strict';

var servicesModule = require('./_index.js');
var fs = require('fs');

/**
 * @ngInject
 */
function HummingbirdService(AppSettings, $q, $http) {

  var service = {};

  service.get = function(username) {
    var deferred = $q.defer();

    // Send a request to hummingbird's mashape api to get the users library
    $http
      .get('https://hbrd-v1.p.mashape.com/users/' + username + '/library', {headers : {
        "X-Mashape-Authorization": AppSettings.mashapeAuthKey
      }})
      .success(function(data) {
        // It was successful, so lets filter the results
        var output = data.filter(function(x){
          // We don't want shows that haven't aired or they haven't watched
          x.anime.status !== 'Not Yet Aired';
          return x.status !== 'plan-to-watch';
        });
        deferred.resolve(output);
      })
      .error(function(err, status) {
        // There was an error wadafuk
        deferred.reject(err, status);
      });

    return deferred.promise;
  };

  return service;

}

servicesModule.service('HummingbirdService', HummingbirdService);