'use strict';

var servicesModule = require('./_index.js');

/**
 * @ngInject
 */
function NkdsuService($q, $http) {

  var service = {};

  service.get = function(username) {
    var deferred = $q.defer();

    $http
      .get('https://nkd.su/api/search/?q=' + username)
      .success(function(data) {
        var output = data.filter(function(x){
          // return x.status === 'on-hold';
          // return x.status !== 'plan-to-watch';
        });
        deferred.resolve(data);
      })
      .error(function(err, status) {
          deferred.reject(err, status);
      });

    return deferred.promise;
  };

  return service;

}

servicesModule.service('NkdsuService', NkdsuService);