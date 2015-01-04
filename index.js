/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-notify',
  included: function(app) {
    this._super.included(app);
    app.import(app.bowerDirectory + '/ember-notify/vendor/ember-notify.css');
  }
};
