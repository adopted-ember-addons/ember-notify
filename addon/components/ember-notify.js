import Ember from 'ember';
import Notify from 'ember-notify/main';
import {Message} from 'ember-notify/main';

export default Ember.Component.extend({
  primary: true,
  messages: null, // this should be a Stream, maybe in Ember 2

  classNames: ['ember-notify-cn'],
  messageStyle: 'foundation',

  init: function() {
    this._super();
    if (!this.get('messages')) this.set('messages', []);

    if (this.get('primary')) Notify.set('primary', this);
    var style = this.get('messageStyle'), klass;
    if (style) {
      if ('foundation' === style) klass = FoundationView;
      else if ('bootstrap' === style) klass = BootstrapView;
      else throw new Error(
        "Unknown messageStyle %s: options are 'foundation' and 'bootstrap'".fmt(style)
      );
    }
    this.set('messageClass', klass || this.constructor.defaultViewClass);
  },
  show: function(message) {
    if (!(message instanceof Message)) {
      message = Message.create(message);
    }
    this.messages.pushObject(message);
    return message;
  }
});

export var BaseView = Ember.View.extend({
  message: null,

  classNames: ['ember-notify'],
  classNameBindings: ['typeCss', 'message.visible:ember-notify-show:ember-notify-hidden'],
  attributeBindings: ['data-alert'],
  'data-alert': '',

  didInsertElement: function() {
    if (Ember.isNone(this.get('message.visible'))) {
      // the element is added to the DOM in its hidden state, so that
      // adding the 'ember-notify-show' class triggers the CSS transition
      Ember.run.schedule('afterRender', this, function() {
        this.set('message.visible', true);
      });
    }
    var closeAfter = this.get('message.closeAfter');
    if (closeAfter) {
      Ember.run.later(this, function() {
        if (this.get('isDestroyed')) return;
        this.set('message.visible', false);
        this.send('close');
      }, closeAfter);
    }
  },
  typeCss: function() {
    var cssClass = this.get('message.type');
    if (cssClass === 'error') cssClass = 'alert error';
    return cssClass;
  }.property('message.type'),
  close: function() {
    this.send('close');
  },
  actions: {
    close: function() {
      var that = this, removeAfter;
      this.set('message.visible', false);
      if (removeAfter = this.get('message.removeAfter')) {
        Ember.run.later(this, remove, removeAfter);
      }
      else {
        remove();
      }
      function remove() {
        var parentView = that.get('parentView');
        if (parentView) parentView.get('messages').removeObject(that.get('message'));
      }
    }
  }
});

export var FoundationView = BaseView.extend({
  classNames: ['alert-box'],
  classNameBindings: ['radius::']
});

export var BootstrapView = BaseView.extend({
  classNames: ['alert'],
  typeCss: function() {
    var type = this.get('type');
    if (type === 'alert' || type === 'error') type = 'danger';
    return 'alert-%@'.fmt(type);
  }.property('type')
});
