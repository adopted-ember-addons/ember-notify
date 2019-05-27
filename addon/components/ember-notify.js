import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from '../templates/components/ember-notify';
import Message from 'ember-notify/message';

export default Component.extend({
  layout,

  notify: service(),
  source: oneWay('notify'),
  messages: null,
  closeAfter: 2500,

  classNames: ['ember-notify-cn'],
  classNameBindings: ['classPrefix'],
  messageStyle: 'foundation',

  classPrefix: computed(function() {
    return this.get('defaultClass') || 'ember-notify-default';
  }),

  init() {
    this._super(...arguments);

    this.set('messages', A());
    this.get('source').setTarget(this);

    let style = this.get('messageStyle');
    let theme;

    switch (style) {
      case 'foundation':
        theme = FoundationTheme.create();
        break;
      case 'uikit':
          theme = UIkitTheme.create();
          break;
      case 'foundation-5':
        theme = Foundation5Theme.create();
        break;
      case 'bootstrap':
        theme = BootstrapTheme.create();
        break;
      case 'refills':
        theme = RefillsTheme.create();
        break;
      case 'semantic-ui':
        theme = SemanticUiTheme.create();
        break;
      default:
        throw new Error(
          `Unknown messageStyle ${style}.
          Options are 'foundation', 'foundation-5', 'uikit', 'refills', 'bootstrap', and 'semantic-ui'.`
        );
    }

    this.set('theme', theme);
  },

  willDestroyElement() {
    this.get('source').setTarget(null);
  },

  show(message) {
    if (this.get('isDestroyed')) {
      return;
    }

    if (!(message instanceof Message)) {
      message = Message.create(message);
    }

    this.get('messages').pushObject(message);

    return message;
  }
});

export const Theme = EmberObject.extend({
  classNamesFor(message) {
    return message.get('type');
  }
});

export const FoundationTheme = Theme.extend({
  classNamesFor(message) {
    let type = message.get('type');
    let classNames = ['callout', type];
    if (type === 'error') {
      classNames.push('alert');
    }

    return classNames.join(' ');
  }
});

export const Foundation5Theme = Theme.extend({
  classNamesFor(message) {
    let type = message.get('type');
    let classNames = ['alert-box', type];
    if (type === 'error') {
      classNames.push('alert');
    }

    return classNames.join(' ');
  }
});

export const BootstrapTheme = Theme.extend({
  classNamesFor(message) {
    let type = message.get('type');
    if (type === 'alert' || type === 'error') {
      type = 'danger';
    }

    let classNames = ['alert', `alert-${type}`];

    return classNames.join(' ');
  }
});

export const RefillsTheme = Theme.extend({
  classNamesFor(message) {
    let type = message.get('type');
    let typeMapping = {
      success: 'success',
      alert: 'error',
      error: 'error',
      info: 'notice',
      warning: 'alert'
    };

    return `flash-${typeMapping[type]}`;
  }
});

export const SemanticUiTheme = Theme.extend({
  classNamesFor(message){
    let type = message.get('type');
    let typeMapping = {
      success: 'success',
      alert: 'error',
      error: 'error',
      info: 'info',
      warning: 'warning'
    };

    return `ui message ${typeMapping[type]}`;
  }
});

export const UIkitTheme = Theme.extend({
  classNamesFor(message){
    let type = message.get('type');
    let typeMapping = {
      success: 'success',
      alert: 'warning',
      error: 'danger',
      info: 'info',
      warning: 'warning'
    };

    return `uk-notify-message uk-notify-message-${typeMapping[type]}`;
  }
});
