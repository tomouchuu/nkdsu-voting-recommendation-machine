# Toridesu~

## Neko Desu Voting Recommendation System

### What?

Toridesu~ is a small site that gives you voting recommendations for Neko Desu (https://nkd.su). Toridesu~ uses your hummingbird or MAL library to check what you are watching or have seen before and then searches the song database for matches.

At the moment, the site might be prone to falling over, but hey Birds either fly or die.

Feel free to give me thoughts and improvements for it!

### Setting Up

1. Run `npm install` from the directory
2. You'll want to create an account on Mashape and register an app for the Hummingbird API V1 (https://www.mashape.com/hummingbird/hummingbird-apiv1)
3. Copy `_constants.js` in `app/js/` to `constants.js` and replace the `mashapeAuthKey` string with your auth key.
4. For MAL Support, you'll need to get a User-Agent from here: https://atomiconline.wufoo.com/forms/mal-api-usage-notification/ (Proper retarded but it's got to be done)
5. Once you eventually get a User-Agent, copy `proxy/_constants.php` to `proxy/constants.php` and change `MAL API User Agent` to your user-agent.
6. Run `gulp dev` (may require installing Gulp globally)
7. Navigate to `localhost:3000` to view the application

Now that `gulp dev` is running, the server is up as well. Any changes will be automatically processed by Gulp and the server will be updated.