var makeModules = require('broccoli-dist-es6-module'),
    pickFiles = require('broccoli-static-compiler'),
    mergeTrees = require('broccoli-merge-trees');

var dist = makeModules('lib/', {
  global: 'EmberNotify',
  packageName: 'ember-notify',
  main: 'main',
  shim: {
    'ember': 'Ember'
  }
});

var css = pickFiles('assets/', {
  srcDir: '/',
  files: ['ember-notify.css'],
  destDir: '/'
});

module.exports = mergeTrees([dist, css])
