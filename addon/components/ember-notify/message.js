import { run, later, next } from '@ember/runloop';
import EmberObject, { computed, observer } from '@ember/object';
import Component from '@ember/component';
import layout from '../../templates/components/ember-notify/message';
import Notify from 'ember-notify';

const DEFAULT_MESSAGE = {};

export default Component.extend({
  layout,
  message: DEFAULT_MESSAGE,
  closeAfter: null,
  run: null,

  classNameBindings: [
    'message.visible:ember-notify-show:ember-notify-hide', 'radius::', 'themeClassNames',
    'message.classNames'
  ],

  attributeBindings: ['data-alert'],
  'data-alert': '',

  init() {
    this._super(...arguments);

    // Indicate that the message is now being displayed
    if (this.message.visible === undefined) {
      // Should really be in didInsertElement but Glimmer doesn't allow this
      this.set('message.visible', true);
    }

    this.run = Runner.create({ disabled: !Notify.testing });
  },

  didInsertElement() {
    this._super(...arguments);

    let { closeAfter, element } = this.message;
    if (element) {
      if (Array.isArray(element)) {
        // eslint-disable-line ember/no-jquery
        this.$('.message').append(element);
      } else {
        this.element
          .querySelector('.message')
          .appendChild(element);
      }
    }

    if (closeAfter === undefined) {
      closeAfter = this.closeAfter;
    }

    if (closeAfter) {
      this.run.later(() => {
        if (this.isDestroyed) {
          return;
        }

        this.send('closeIntent');
      }, closeAfter);
    }
  },

  themeClassNames: computed('theme', 'message.type', function() {
    return this.theme ? this.theme.classNamesFor(this.message) : '';
  }),

  visibleObserver: observer('message.visible', function() {
    if (!this.message.visible) {
      this.send('closeIntent');
    }
  }),

  isHovering() {
    return this.element.matches
      ? this.element.matches(':hover')
      : this.element.msMatchesSelector(':hover');
  },

  actions: {
    // Alias to close action so we can poll whether hover state is active
    closeIntent() {
      if (this.isDestroyed) {
        return;
      }

      if (this.isHovering()) {
        return this.run.later(() => this.send('closeIntent'), 100);
      }

      // When :hover no longer applies, close as normal
      this.send('close');
    },

    close() {
      if (this.message.closed) {
        return;
      }

      this.set('message.closed', true);
      this.set('message.visible', false);

      let removeAfter = this.message.removeAfter || this.constructor.removeAfter;
      if (removeAfter) {
        this.run.later(this, remove, removeAfter);
      } else {
        remove();
      }

      function remove() {
        if (this.isDestroyed || !this.parentView || !this.parentView.messages) {
          return;
        }

        this.parentView.messages.removeObject(this.message);
        this.set('message.visible', null);
      }
    }
  }
}).reopenClass({
  removeAfter: 250 // Allow time for the close animation to finish
});

// Getting the run loop to do what we want is difficult, hence the Runner...
const Runner = EmberObject.extend({
  init() {
    this._super(...arguments);

    if (this.disabled) {
      this.next = this.later = (ctx, fn) => next(ctx, fn);
    } else {
      // This is horrible but this avoids delays from the run loop
      this.next = (ctx, fn) => {
        let args = arguments;
        setTimeout(() => run(() => fn.apply(ctx, args)), 0);
      };

      this.later = function() {
        later.apply(run, arguments);
      };
    }
  }
});
