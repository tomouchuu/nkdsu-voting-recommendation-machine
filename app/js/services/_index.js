'use strict';

var angular = require('angular');

module.exports = angular.module('app.services', []);

// Define the list of services here
require('./hummingbird.js');
require('./mal.js');
require('./nkdsu.js');