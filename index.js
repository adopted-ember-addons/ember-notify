/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-notify',
  included: function(app) {
    this._super.included.apply(this, arguments);
    var options = Object.assign({
      importCss: true
    }, app.options.emberNotify);
    if (options.importCss) {
      app.import('vendor/ember-notify.css');
    }
  }
};
