var makeModules = require('broccoli-dist-es6-module'),
    mergeTrees = require('broccoli-merge-trees'),
    templateCompiler = require('ember-cli-htmlbars'),
    exportTree = require('broccoli-export-tree');

var dist = makeModules('lib/', {
  global: 'EmberNotify',
  packageName: 'ember-notify',
  main: 'main',
  shim: {
    'ember': 'Ember'
  }
});
var assets = templateCompiler('assets/');
var tree = mergeTrees([dist, assets]);
//tree = exportTree(tree, {destDir: 'dist'});

module.exports = tree;
