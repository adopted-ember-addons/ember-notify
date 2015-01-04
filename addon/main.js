import Ember from 'ember';

export default Ember.Object.extend({

  info: aliasToShow('info'),
  success: aliasToShow('success'),
  warning: aliasToShow('warning'),
  alert: aliasToShow('alert'),
  error: aliasToShow('error'),

  show: function(type, message, options) {
    if (typeof message === 'object') {
      options = message;
      message = null;
    }
    return this.get('primary').show(Ember.merge({
      message: message,
      type: type
    }, options));
  },

  primary: function(key, val) {
    if (arguments.length === 1) {
      Ember.assert("Can't display notifications without a {{ember-notify}} in your " +
        "templates, usually in application.hbs",
        this._primary
      );
    }
    if (arguments.length === 2) {
      Ember.assert("Only one <ember-notify> should be primary=true. " +
        "If you want more than one then use <ember-notify primary=false messages=boundProperty>",
        !this._primary || this._primary.get('isDestroyed')
      );
      this._primary = val;
    }
    return this._primary;
  }.property()

}).create();

export var Message = Ember.Object.extend({
  message: null,
  raw: '',
  type: 'info',
  closeAfter: 2500,
  removeAfter: 250, // allow time for the close animation to finish

  visible: undefined // set to false to disable auto-showing
});

function aliasToShow(type) {
  return function(message, options) {
    return this.show(type, message, options);
  };
}
