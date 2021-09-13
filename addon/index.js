import { computed } from '@ember/object';
import { isHTMLSafe } from '@ember/template';
import { assign } from '@ember/polyfills';
import Service from '@ember/service';
import Message from './message';

function aliasToShow(type) {
  return function(message, options) {
    return this.show(type, message, options);
  };
}

let Notify = Service.extend({
  info: aliasToShow('info'),
  success: aliasToShow('success'),
  warning: aliasToShow('warning'),
  alert: aliasToShow('alert'),
  error: aliasToShow('error'),

  init() {
    this._super(...arguments);
    this.pending = [];
  },

  show(type, text, options) {
    // If the text passed is `SafeString`, convert it
    if (isHTMLSafe(text)) {
      text = text.toString();
    }

    if (typeof text === 'object') {
      options = text;
      text = null;
    }

    let message = Message.create(assign({
      text: text,
      type: type
    }, options));

    if (this.target) {
      this.target.show(message);
    } else {
      this.pending.push(message);
    }

    return message;
  },

  setTarget(target) {
    this.set('target', target);

    if (target) {
      this.pending.map(message => target.show(message));
      this.pending = [];
    }
  }
});

export default Notify.reopenClass({
  property() {
    return computed(function() {
      return Notify.create();
    });
  }
});
