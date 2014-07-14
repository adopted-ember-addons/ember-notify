/* jshint node: true */
var path = require('path');
var pickFiles = require('broccoli-static-compiler');

var EmberAddon = function() {
  var tree = 'node_modules/ember-notify/dist';
  tree = unwatchedTree(tree);
  this.tree = pickFiles(tree, {
    srcDir: '.',
    destDir: 'ember-notify'
  });
};

EmberAddon.prototype.treeFor = function treeFor(type) {
  if (type == 'vendor') {
    return this.tree;
  }
  else if (type == 'styles') {
    return this.tree;
  }
};

EmberAddon.prototype.included = function included(app) {
  this.app = app;
  this.app.import('vendor/ember-notify/named-amd/main.js', {
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
