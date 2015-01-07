import Notify from 'ember-notify';

export default {
  name: 'ember-notify',
  initialize: function(container, app) {
    container.optionsForType('notify', {instantiate: false, singleton: true});
    app.register('notify:main', Notify);
    app.inject('route', 'notify', 'notify:main');
    app.inject('controller', 'notify', 'notify:main');
  }
};
