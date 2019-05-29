import { A } from '@ember/array';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from '../templates/components/ember-notify';
import Message from 'ember-notify/message';

export default Component.extend({
  layout,

  notify: service(),

  classNames: ['ember-notify-cn'],
  classNameBindings: ['classPrefix'],
  messageStyle: 'foundation',

  closeAfter: 2500,
  messages: null,

  source: computed.oneWay('notify'),

  classPrefix: computed(function() {
    return this.defaultClass || 'ember-notify-default';
  }),

  init() {
    this._super(...arguments);

    this.set('messages', A());
    this.source.setTarget(this);
    let theme;

    switch (this.messageStyle) {
      case 'foundation':
        theme = FoundationTheme;
        break;
      case 'uikit':
        theme = UIkitTheme;
        break;
      case 'foundation-5':
        theme = Foundation5Theme;
        break;
      case 'bootstrap':
        theme = BootstrapTheme;
        break;
      case 'refills':
        theme = RefillsTheme;
        break;
      case 'semantic-ui':
        theme = SemanticUiTheme;
        break;
      default:
        throw new Error(
          `Unknown messageStyle ${this.messageStyle}.
          Options are 'foundation', 'foundation-5', 'uikit', 'refills', 'bootstrap', and 'semantic-ui'.`
        );
    }

    this.set('theme', theme);
  },

  willDestroyElement() {
    this._super(...arguments);

    this.source.setTarget(null);
  },

  show(message) {
    if (this.isDestroyed) {
      return;
    }

    let id = message.id;
    if (id && this.messages.find(x => x.id === id)) {
      return;
    }

    if (!(message instanceof Message)) {
      message = Message.create(message);
    }

    this.messages.pushObject(message);

    return message;
  }
});

export const Theme = {
  classNamesFor(message) {
    return message.type;
  }
};

export const FoundationTheme = {
  classNamesFor(message) {
    let classNames = ['callout', message.type];
    if (message.type === 'error') {
      classNames.push('alert');
    }

    return classNames.join(' ');
  }
};

export const Foundation5Theme = {
  classNamesFor(message) {
    let classNames = ['alert-box', message.type];
    if (message.type === 'error') {
      classNames.push('alert');
    }

    return classNames.join(' ');
  }
};

export const BootstrapTheme = {
  classNamesFor(message) {
    let { type } = message;
    if (type === 'alert' || type === 'error') {
      type = 'danger';
    }

    let classNames = ['alert', `alert-${type}`];

    return classNames.join(' ');
  }
};

export const RefillsTheme = {
  classNamesFor(message) {
    let typeMapping = {
      success: 'success',
      alert: 'error',
      error: 'error',
      info: 'notice',
      warning: 'alert'
    };

    return `flash-${typeMapping[message.type]}`;
  }
};

export const SemanticUiTheme = {
  classNamesFor(message){
    let typeMapping = {
      success: 'success',
      alert: 'error',
      error: 'error',
      info: 'info',
      warning: 'warning'
    };

    return `ui message ${typeMapping[message.type]}`;
  }
};

export const UIkitTheme = {
  classNamesFor(message){
    let typeMapping = {
      success: 'success',
      alert: 'warning',
      error: 'danger',
      info: 'info',
      warning: 'warning'
    };

    return `uk-notify-message uk-notify-message-${typeMapping[message.type]}`;
  }
};
