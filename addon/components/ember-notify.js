import Ember from 'ember';
import Notify from 'ember-notify';
import Message from 'ember-notify/message';

export default Ember.Component.extend({
  source: null,
  messages: null,
  closeAfter: 2500,

  classNames: ['ember-notify-cn'],
  messageStyle: 'foundation',

  init: function() {
    this._super();
    this.set('messages', Ember.A());

    if (Ember.isNone(this.get('source'))) this.set('source', Notify);

    var style = this.get('messageStyle'), klass;
    if (style) {
      if ('foundation' === style) klass = FoundationView;
      else if ('bootstrap' === style) klass = BootstrapView;
      else throw new Error(
        `Unknown messageStyle ${style}: options are 'foundation' and 'bootstrap'`
      );
    }
    this.set('messageClass', klass || this.constructor.defaultViewClass);
  },
  didInsertElement: function() {
    this.set('source.target', this);
  },
  willDestroyElement: function() {
    this.set('source.target', null);
  },
  show: function(message) {
    if (this.get('isDestroyed')) return;
    if (!(message instanceof Message)) {
      message = Message.create(message);
    }
    this.get('messages').pushObject(message);
    return message;
  }
});

export var MessageView = Ember.View.extend({
  message: null,
  closeAfter: null,

  classNames: ['ember-notify'],
  classNameBindings: ['typeCss', 'message.visible:ember-notify-show:ember-notify-hidden'],
  attributeBindings: ['data-alert'],
  'data-alert': '',

  run: null,

  init: function() {
    this._super();
    this.run = Runner.create({
      // disable all the scheduling in tests
      disabled: Ember.testing && !Notify.testing
    });
  },
  didInsertElement: function() {
    var element = this.get('message.element');
    if (element) {
      this.$('.message').append(element);
    }
    if (Ember.isNone(this.get('message.visible'))) {
      // the element is added to the DOM in its hidden state, so that
      // adding the 'ember-notify-show' class triggers the CSS transition
      this.run.next(this, function() {
        if (this.get('isDestroyed')) return;
        this.set('message.visible', true);
      });
    }
    var closeAfter = this.get('message.closeAfter');
    if (closeAfter === undefined) closeAfter = this.get('closeAfter');
    if (closeAfter) {
      this.run.later(this, function() {
        if (this.get('isDestroyed')) return;
        this.send('close');
      }, closeAfter);
    }
  },
  typeCss: Ember.computed('message.type', function() {
    var cssClass = this.get('message.type');
    if (cssClass === 'error') cssClass = 'alert error';
    return cssClass;
  }),
  visibleObserver: Ember.observer('message.visible', function() {
    if (!this.get('message.visible')) {
      this.send('close');
    }
  }),

  actions: {
    close: function() {
      var that = this;
      var removeAfter = this.get('message.removeAfter') || this.constructor.removeAfter;
      if (this.get('message.visible')) {
        this.set('message.visible', false);
      }
      if (removeAfter) {
        this.run.later(this, remove, removeAfter);
      }
      else {
        remove();
      }
      function remove() {
        if (this.get('isDestroyed')) return;
        var parentView = that.get('parentView');
        if (parentView) {
          parentView.get('messages').removeObject(that.get('message'));
          that.set('message.visible', null);
        }
      }
    }
  }
}).reopenClass({
  removeAfter: 250 // allow time for the close animation to finish
});

export var FoundationView = MessageView.extend({
  classNames: ['alert-box'],
  classNameBindings: ['radius::']
});

export var BootstrapView = MessageView.extend({
  classNames: ['alert'],
  typeCss: Ember.computed('type', function() {
    var type = this.get('message.type');
    if (type === 'alert' || type === 'error') type = 'danger';
    return 'alert-' + type;
  })
});

// getting the run loop to do what we want is difficult, hence the Runner...
var Runner = Ember.Object.extend({
  init: function() {
    if (!this.disabled) {
      // this is horrible but this avoids delays from the run loop
      this.next = function(ctx, fn) {
        var args = arguments;
        setTimeout(function() {
          Ember.run(function() {
            fn.apply(ctx, args);
          });
        }, 0);
      };
      this.later = function() {
        Ember.run.later.apply(Ember.run, arguments);
      };
    }
    else {
      this.next = this.later = function zalkoBegone(ctx, fn) {
        Ember.run.next(ctx, fn);
      };
    }
  }
});

