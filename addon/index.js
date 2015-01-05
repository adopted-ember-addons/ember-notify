import Ember from 'ember';

var Notify = Ember.Object.extend({

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
    return this.get('target').show(Ember.merge({
      message: message,
      type: type
    }, options));
  },

  create: function(component) {
    return Notify.create({
      target: component
    });
  }

});

export default Notify.extend({
  property: function() {
    return Ember.computed(function() {
      return Notify.create();
    });
  },
  create: function() {
    return Notify.create();
  },
  target: function(key, val) {
    if (arguments.length === 1) {
      Ember.assert("Can't display notifications without an {{ember-notify}} in your " +
        "templates, usually in application.hbs",
        this._primary
      );
    }
    if (arguments.length === 2) {
      Ember.assert("Only one {{ember-notify}} should be used without a source property. " +
        "If you want more than one then use {{ember-notify source=someProperty}}",
        !this._primary || this._primary.get('isDestroyed')
      );
      this._primary = val;
    }
    return this._primary;
  }.property()

}).create();

function aliasToShow(type) {
  return function(message, options) {
    return this.show(type, message, options);
  };
}
