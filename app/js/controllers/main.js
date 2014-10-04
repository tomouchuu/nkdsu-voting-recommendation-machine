'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
function MainCtrl($rootScope, $scope, $timeout, AppSettings, HummingbirdService, MALService, NkdsuService) {

  // Shuffle Array function
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
  // Don't show the loading.gif
  vm.startSearch = false;

  // Set the voting tweet to ''
  $scope.voteTweet = '';

  // Set the voting urls to '';
  $scope.voteurls = '';
  // Set number of vote urls to 0
  var numberOfUrls = 0;

  // Get the initial remaining tweet length
  $scope.twitterLength = (AppSettings.twitterCap - AppSettings.twitterAccount.length - 1);
  var baseTwitterLength = (AppSettings.twitterCap - AppSettings.twitterAccount.length - 1);

  // When the twitter message changes...
  $scope.$watch('home.twitterMsg', function(newValue, oldValue) {
    // If the twitter message is defined and we have selected songs
    if (angular.isDefined(newValue) && $scope.voteurls !== '')
    {
      // Update the remaining tweet length
      $scope.twitterLength = (baseTwitterLength - (numberOfUrls * AppSettings.twitterLinkLength) - numberOfUrls - newValue.length);
      // Update the vote tweet url
      $scope.voteTweet = 'https://twitter.com/intent/tweet?text=@nkdsu ' + $scope.voteurls + vm.twitterMsg;
    }
    else
    {
      // Set the vote tweet & twitter message to ''
      vm.twitterMsg = '';
      $scope.voteTweet = '';
    }
  });

  // When a song is selected/deselected
  $scope.$watch('voteurls', function(newValue, oldValue) {
    // If we have a selected song(s) and a twitter message
    if (angular.isDefined(newValue) && vm.twitterMsg !== '')
    {
      // Set the vote tweet to include these urls and message
      $scope.voteTweet = 'https://twitter.com/intent/tweet?text=@nkdsu ' + $scope.voteurls + vm.twitterMsg;
    }
    // If we just have selected song(s)
    else if (newValue !== '')
    {
      // Set the vote tweet to include these urls
      $scope.voteTweet = 'https://twitter.com/intent/tweet?text=@nkdsu ' + $scope.voteurls;
    }
    else
    {
      // Else we have no selected song(s) so set the vote tweet to nothing
      $scope.voteTweet = '';
    }
  });

  // Array of possible search button texts
  var buttonText = [
    'Another round',
    'Again',
    'MottoMotto Moootttttooooo'
  ]

  // Initial search text
  vm.buttonText = 'Recommend me some songs';

  // Set the error attempt count to 0
  vm.errAttempt = 0;

  vm.submit = function (username) {
    // Get new text from the buttonText array for the search button
    var newButtonText = shuffleArray(buttonText)[0];
    vm.buttonText = newButtonText;

    // Show the loading gif
    vm.startSearch = true;

    // Init the songlist & userLibrary
    var recommendedSongs = [];
    var userLibrary = '';

    if (vm.service === 'HB')
    {
      userLibrary = HummingbirdService.get(username);
    }
    else if (vm.service === 'MAL')
    {
      userLibrary = MALService.get(username);
    }
    else
    {
      // Error
    }

    // If there was an error getting a users library
    userLibrary.catch(function(err, status){
      // Remove loading gif
      vm.startSearch = false;

      // Show the error message
      vm.userError = true;

      // Bump up the error attempt count
      vm.errAttempt++;
    });

    userLibrary.then(function(data) {
      // If they were successful, reset the error attempts
      vm.errAttempt = 0;

      // the recommendationPool is the users entire library(minus things Not Yet Aired or Plan To Watch)
      var recommendationPool = data;

      // Shuffle this and pick 5
      var shuffledPool = shuffleArray(recommendationPool);
      if (shuffledPool.length > 5)
      {
        shuffledPool = shuffledPool.slice(0, 5);
      };

      // For each show...
      angular.forEach(shuffledPool, function(anime){
        // Get the shows normal & alternate title
        var animeTitleA = '';
        var animeTitleB = '';
        if (vm.service === 'HB')
        {
          animeTitleA = anime.anime.title;
          animeTitleB = anime.anime.alternate_title;
        }
        else if (vm.service === 'MAL')
        {
          animeTitleA = anime.series_title;
        }
        else
        {
          // Error
        }

        // Search for the normal title in NekoDesu's song list
        var nkdsuSearchA = NkdsuService.get(animeTitleA);
        nkdsuSearchA.then(function(data) {
          // If we find a match
          if (data.length > 0)
          {
            // Get the list of songs
            var suggestedSongs = data;
            // If it's more than 3...
            if (data.length > 3)
            {
              // Shuffle and pick 3
              suggestedSongs = shuffleArray(data).slice(0,3);
            };
            // Foreach of the picked songs...
            angular.forEach(suggestedSongs, function(suggestedSong){
              // Push these to the recommended songlist
              recommendedSongs.push(suggestedSong);
            });
          };
        });

        // Sometimes there might not be an alternate title
        // If there is...
        if (animeTitleB !== null && animeTitleB.length > 0)
        {
          // Search for the alternate title in NekoDesu's song list
          var nkdsuSearchB = NkdsuService.get(animeTitleB);
          nkdsuSearchB.then(function(data) {
            // If we find a match
            if (data.length > 0)
            {
              // Get the list of songs
              var suggestedSongs = data;
              // If it's more than 3...
              if (data.length > 3)
              {
                // Shuffle and pick 3
                suggestedSongs = shuffleArray(data).slice(0,3);
              };
              // Foreach of the picked songs...
              angular.forEach(suggestedSongs, function(suggestedSong){
                // Push these to the recommended songlist
                recommendedSongs.push(suggestedSong);
              });
            };
          });
        };
      });

      // Give 1.5 seconds to load all of that
      $timeout(function(){
        // Remove the loading.gif
        vm.startSearch = false;
        // Show the recommended song list
        vm.recommendedSongs = recommendedSongs;
      }, 1500);

      // Give an extra 0.05 seconds to allow JQuery to be able to select the songs
      $timeout(function(){
        // When a song is clicked...
        $('.song').click(function() {
          // Get the voteurl
          var voteurl = $(this).attr('data-voteurl');

          // If it were already selected...
          if ($(this).hasClass('selected'))
          {
            // Remove the selected class
            $(this).removeClass('selected');
            // Remove it from the voteurls list
            $scope.voteurls = $scope.voteurls.replace(voteurl + ' ', '');
            // Remove 1 from the numberofurls count
            numberOfUrls--;
            // Get the new remaining tweet length
            $scope.twitterLength = (baseTwitterLength - (numberOfUrls * AppSettings.twitterLinkLength) - numberOfUrls - vm.twitterMsg.length);
          }
          // Else if it weren't selected
          else
          {
            // Add the selected class to it
            $(this).addClass('selected');
            // Add the url to the list of urls
            $scope.voteurls += voteurl + ' ';
            // Add 1 to the numberofurls count
            numberOfUrls++;
            // Get the new remaining tweet length
            $scope.twitterLength = (baseTwitterLength - (numberOfUrls * AppSettings.twitterLinkLength) - numberOfUrls - vm.twitterMsg.length);
          }
          // Reload the $scope or says there were changes, get to it
          $scope.$digest();
        });
      }, 1550);
    });
  }

  // No danceparty
  vm.danceparty = false;
  $rootScope.danceparty = false;

  // Watch for a danceparty
  $scope.$watch('home.danceparty', function(newValue, oldValue) {
    // If there is a danceparty...
    if (newValue === true)
    {
      // DANCE (〜￣▽￣)〜
      $rootScope.danceparty = true;
    }
    else
    {
      // Party's over, go home!
      $rootScope.danceparty = false;
    }
  });
}

controllersModule.controller('MainCtrl', MainCtrl);