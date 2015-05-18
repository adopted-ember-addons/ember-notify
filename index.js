/* jshint node: true */
'use strict';
var objectAssign = require('object-assign');

module.exports = {
  name: 'ember-notify',
  isDevelopingAddon: function() {
    return true;
  },
  included: function(app) {
    this._super.included(app);
    var options = objectAssign({
      importCss: true
    }, app.options.emberNotify);
    if (options.importCss) app.import('vendor/ember-notify.css');
  }
};
