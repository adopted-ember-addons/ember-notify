import Ember from 'ember';
import layout from '../../templates/components/ember-notify/message';
import Notify from 'ember-notify';

export default Ember.Component.extend({
  layout: layout,
  message: {},
  closeAfter: null,

  classNameBindings: [
    'message.visible:ember-notify-show:ember-notify-hide', 'radius::', 'themeClassNames',
    'message.classNames'
  ],
  attributeBindings: ['data-alert'],
  'data-alert': '',

  run: null,

  init: function() {
    this._super();
    // indicate that the message is now being displayed
    if (this.get('message.visible') === undefined) {
      // should really be in didInsertElement but Glimmer doesn't allow this
      this.set('message.visible', true);
    }
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
    var closeAfter = this.get('message.closeAfter');
    if (closeAfter === undefined) closeAfter = this.get('closeAfter');
    if (closeAfter) {
      this.run.later(() => this.send('closeIntent'), closeAfter);
    }
  },
  themeClassNames: Ember.computed('theme', 'message.type', function() {
    var theme = this.get('theme');
    return theme ? theme.classNamesFor(this.get('message')) : '';
  }),
  visibleObserver: Ember.observer('message.visible', function() {
    if (!this.get('message.visible')) {
      this.send('closeIntent');
    }
  }),
  isHovering: function() {
    return this.$().is(':hover');
  },

  actions: {
    // alias to close action so we can poll whether hover state is active
    closeIntent: function() {
      if (this.get('isDestroyed')) return;
      if (this.isHovering()) {
        return this.run.later(() => this.send('closeIntent'), 100);
      }
      // when :hover no longer applies, close as normal
      this.send('close');
    },
    close: function() {
      if (this.get('message.closed')) return;
      this.set('message.closed', true);
      this.set('message.visible', false);
      var removeAfter = this.get('message.removeAfter') || this.constructor.removeAfter;
      if (removeAfter) {
        this.run.later(this, remove, removeAfter);
      }
      else {
        remove();
      }
      function remove() {
        var parentView = this.get('parentView');
        if (this.get('isDestroyed') || !parentView || !parentView.get('messages')) return;
        parentView.get('messages').removeObject(this.get('message'));
        this.set('message.visible', null);
      }
    }
  }
}).reopenClass({
  removeAfter: 250 // allow time for the close animation to finish
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
