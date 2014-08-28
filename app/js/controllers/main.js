'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
function MainCtrl($timeout, HummingbirdService, NkdsuService) {

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  // ViewModel
  var vm = this;
  vm.startSearch = false;

  var buttonText = [
    'Another round',
    'Again',
    'MottoMotto Moootttttooooo'
  ]

  vm.buttonText = 'Recommend me some songs';

  vm.submit = function (username) {
    var newButtonText = shuffleArray(buttonText)[0];
    vm.buttonText = newButtonText;

    vm.startSearch = true;

    var recommendedSongs = [];
    var userLibrary = HummingbirdService.get(username);

    userLibrary.then(function(data) {
      var recommendationPool = data;

      var shuffledPool = shuffleArray(recommendationPool);
      if (shuffledPool.length > 5)
      {
        shuffledPool = shuffledPool.slice(0, 5);
      };

      angular.forEach(shuffledPool, function(anime){
        var animeTitleA = anime.anime.title;
        var animeTitleB = anime.anime.alternate_title;

        var nkdsuSearchA = NkdsuService.get(animeTitleA);
        nkdsuSearchA.then(function(data) {
          if (data.length > 0)
          {
            var suggestedSongs = data;
            if (data.length > 3)
            {
              suggestedSongs = shuffleArray(data).slice(0,3);
            };
            angular.forEach(suggestedSongs, function(suggestedSong){
              recommendedSongs.push(suggestedSong);
            });
          };
        });

        if (animeTitleB !== null && animeTitleB.length > 0)
        {
          var nkdsuSearchB = NkdsuService.get(animeTitleB);
          nkdsuSearchB.then(function(data) {
            if (data.length > 0)
            {
              var suggestedSongs = data;
              if (data.length > 3)
              {
                suggestedSongs = shuffleArray(data).slice(0,3);
              };
              angular.forEach(suggestedSongs, function(suggestedSong){
                recommendedSongs.push(suggestedSong);
              });
            };
          });
        };

      });
      $timeout(function(){
        vm.startSearch = false;
        vm.recommendedSongs = recommendedSongs;
      }, 1500);
    });

  }

}

controllersModule.controller('MainCtrl', MainCtrl);