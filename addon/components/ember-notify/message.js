import { isArray } from '@ember/array';
import { run } from '@ember/runloop';
import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../../templates/components/ember-notify/message';

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
  },

  didInsertElement() {
    this._super(...arguments);

    let { closeAfter = this.closeAfter, element } = this.message;
    if (element) {
      if (isArray(element)) {
        // eslint-disable-line ember/no-jquery
        this.$('.message').append(element);
      } else {
        this.element
          .querySelector('.message')
          .appendChild(element);
      }
    }

    if (closeAfter) {
      run.later(() => this.selfClose(), closeAfter);
    }
  },

  themeClassNames: computed('theme', 'message.type', function() {
    return this.theme ? this.theme.classNamesFor(this.message) : '';
  }),

  actions: {
    close() {
      if (this.message.closed) {
        return;
      }

      this.set('message.closed', true);
      this.set('message.visible', false);

      let removeAfter = this.message.removeAfter || this.constructor.removeAfter;
      if (removeAfter) {
        run.later(this, remove, removeAfter);
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
  },

  isHovering() {
    return this.element.matches
      ? this.element.matches(':hover')
      : this.element.msMatchesSelector(':hover');
  },

  selfClose() {
    if (this.isDestroyed) {
      return;
    }

    if (this.isHovering()) {
      return run.later(() => this.selfClose(), 100);
    }

    // When :hover no longer applies, close as normal
    this.send('close');
  }
}).reopenClass({
  removeAfter: 250 // Allow time for the close animation to finish
});
