import Ember from 'ember';
import layout from '../templates/components/ember-notify';
import Message from 'ember-notify/message';

export default Ember.Component.extend({
  layout: layout,

  notify: Ember.inject.service(),
  source: Ember.computed.oneWay('notify'),
  messages: null,
  closeAfter: 2500,

  classNames: ['ember-notify-cn'],
  messageStyle: 'foundation',

  init: function() {
    this._super();
    this.set('messages', Ember.A());
    this.set('source.target', this);

    var style = this.get('messageStyle'), theme;
    switch (style) {
      case 'foundation':
        theme = FoundationTheme.create();
        break;
      case 'bootstrap':
        theme = BootstrapTheme.create();
        break;
      case 'refills':
        theme = RefillsTheme.create();
        break;
      default:
        throw new Error(
          `Unknown messageStyle ${style}: options are 'foundation' and 'bootstrap'`
        );
    }
    this.set('theme', theme);
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

export var Theme = Ember.Object.extend({
  classNamesFor(message) {
    return message.get('type');
  }
});

export var FoundationTheme = Theme.extend({
  classNamesFor(message) {
    var type = message.get('type');
    var classNames = ['alert-box', type];
    if (type === 'error') classNames.push('alert');
    return classNames.join(' ');
  }
});

export var BootstrapTheme = Theme.extend({
  classNamesFor(message) {
    var type = message.get('type');
    var classNames = ['alert', type];
    if (type === 'alert' || type === 'error') classNames.push('danger');
    return classNames.join(' ');
  }
});

export var RefillsTheme = Theme.extend({
  typeCss: Ember.computed('type', function() {
    var type = this.get('message.type');
    var typeMapping = {
      success: 'success',
      alert: 'error',
      error: 'error',
      info: 'notice',
      warning: 'alert'
    };
    return 'flash-' + typeMapping[type];
  })
});
