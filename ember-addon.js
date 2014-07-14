/* jshint node: true */
var path = require('path');
var pickFiles = require('broccoli-static-compiler');

var EmberAddon = function() {};

EmberAddon.prototype.treeFor = function treeFor(type) {
  if (type == 'vendor') {
    var code = unwatchedTree('node_modules/ember-notify/dist/named-amd');
    return pickFiles(code, {
      srcDir: '.',
      destDir: 'ember-notify'
    });
  }
  else if (type == 'styles') {
    var assets = unwatchedTree('node_modules/ember-notify/assets');
    return pickFiles(assets, {
      srcDir: '.',
      destDir: 'ember-notify'
    });
  }
};

EmberAddon.prototype.included = function included(app) {
  this.app = app;
  this.app.import('vendor/ember-notify/main.js', {
    exports: {
      'ember-notify': ['default']
    }
  });
  this.app.import('ember-notify/ember-notify.css');
};

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

module.exports = EmberAddon;
