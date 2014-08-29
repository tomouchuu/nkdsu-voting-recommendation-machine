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

    $http
      .get('https://hbrd-v1.p.mashape.com/users/' + username + '/library', {headers : {
        "X-Mashape-Authorization": AppSettings.mashapeAuthKey
      }})
      .success(function(data) {
        var output = data.filter(function(x){
          x.anime.status !== 'Not Yet Aired';
          return x.status !== 'plan-to-watch';
        });
        deferred.resolve(output);
      })
      .error(function(err, status) {
          deferred.reject(err, status);
      });

    return deferred.promise;
  };

  return service;

}

servicesModule.service('HummingbirdService', HummingbirdService);