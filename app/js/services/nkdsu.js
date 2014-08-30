'use strict';

var servicesModule = require('./_index.js');

/**
 * @ngInject
 */
function NkdsuService($q, $http) {

  var service = {};

  service.get = function(anime) {
    var deferred = $q.defer();

    // Let's get the songs that belong to a show
    $http
      .get('https://nkd.su/api/search/?q=' + anime)
      .success(function(data) {
        // We got a match
        var output = data.filter(function(x){
          // So let's remove matches that we can't vote for
          return x.eligible === true;
        });
        deferred.resolve(output);
      })
      .error(function(err, status) {
        // wadafuk
        deferred.reject(err, status);
      });

    return deferred.promise;
  };

  return service;

}

servicesModule.service('NkdsuService', NkdsuService);