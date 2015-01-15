import Ember from 'ember';

var MessagePromise = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

var Notify = Ember.Object.extend({

  info: aliasToShow('info'),
  success: aliasToShow('success'),
  warning: aliasToShow('warning'),
  alert: aliasToShow('alert'),
  error: aliasToShow('error'),

  init: function() {
    this.pending = [];
  },

  show: function(type, message, options) {
    if (typeof message === 'object') {
      options = message;
      message = null;
    }
    message = Ember.merge({
      message: message,
      type: type
    }, options);
    var target = this.get('target');
    var promise;
    if (target) {
      var view = target.show(message);
      promise = Ember.RSVP.resolve(view);
    }
    else {
      promise = new Ember.RSVP.Promise(function(resolve) {
        this.pending.push({
          message: message,
          resolve: resolve
        });
      }.bind(this));
    }
    return MessagePromise.create({
      message: message,
      promise: promise
    });
  },

  create: function(component) {
    return Notify.create({
      target: component
    });
  },

  target: function(key, val) {
    if (arguments.length === 2) {
      this.showPending(val);
    }
    return val;
  }.property(),

  showPending: function(target) {
    this.pending.map(function(pending) {
      pending.resolve(target.show(pending.message));
    });
    this.pending = [];
  }

}).reopenClass({
  // set to true to disable testing optimizations that are enabled when
  // Ember.testing is true
  testing: false
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
    if (arguments.length === 2) {
      Ember.assert("Only one {{ember-notify}} should be used without a source property. " +
        "If you want more than one then use {{ember-notify source=someProperty}}",
        !this._primary || this._primary.get('isDestroyed')
      );
      this.showPending(val);
    }
    return val;
  }.property()

}).create();

function aliasToShow(type) {
  return function(message, options) {
    return this.show(type, message, options);
  };
}
