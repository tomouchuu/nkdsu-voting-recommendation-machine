'use strict';

var servicesModule = require('./_index.js');
var fs = require('fs');

/**
 * @ngInject
 */
function MALService(AppSettings, $q, $http) {

  var service = {};

  service.get = function(username) {
    var deferred = $q.defer();
      // Send a request to the MAL api to get the users library
      $http({
        method: 'POST',
        url: '/proxy/malproxy.php',
        data: {
          "u": username,
          "useragent": AppSettings.malAPIUserAgent,
        }
      })
      .success(function(data) {
        // It was successful, so lets filter the results
        var output = data.anime.filter(function(x){
          // We don't want shows that haven't aired or they haven't watched
          x.series_status !== '3';
          return x.my_status !== '6';
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

servicesModule.service('MALService', MALService);