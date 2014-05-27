var makeModules = require('broccoli-dist-es6-module'),
    mergeTrees = require('broccoli-merge-trees'),
    templateCompiler = require('broccoli-ember-hbs-template-compiler');

var dist = makeModules('lib/', {
  global: 'EmberNotify',
  packageName: 'ember-notify',
  main: 'main',
  shim: {
    'ember': 'Ember'
  }
});
var assets = templateCompiler('assets/');

module.exports = mergeTrees([dist, assets]);
