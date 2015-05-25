import Ember from 'ember';
import computed from 'ember-new-computed';

function aliasToShow(type) {
  return function(message, options) {
    return this.show(type, message, options);
  };
}

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
      var messageObj = target.show(message);
      promise = Ember.RSVP.resolve(messageObj);
    }
    else {
      promise = new Ember.RSVP.Promise(resolve => this.pending.push({
        message: message,
        resolve: resolve
      }));
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

  showPending: Ember.observer('target', function() {
    var target = this.get('target');
    if (target) {
      this.pending.map(function(pending) {
        var messageObj = target.show(pending.message);
        pending.resolve(messageObj);
      });
      this.pending = [];
    }
  })

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
  target: computed({
    get() {
      return this._target;
    },
    set(key, val) {
      Ember.assert("Only one {{ember-notify}} should be used without a source property. " +
        "If you want more than one then use {{ember-notify source=someProperty}}",
        !this._primary || this._primary.get('isDestroyed')
      );
      this._target = val;
      return this._target;
    }
  })

}).create();

var MessagePromise = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin, {
  set: function(key, val) {
    // if the message hasn't been displayed then set the value on the message hash
    if (!this.get('content')) {
      this.message[key] = val;
      return this;
    }
    else {
      return this._super(key, val);
    }
  }
});
