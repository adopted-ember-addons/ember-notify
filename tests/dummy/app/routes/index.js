import Ember from 'ember';

export default Ember.Route.extend({
  notify: Ember.inject.service(),
  model() {
    return {
      message: 'Hello, world!',
      closeAfter: 2500,
      raw: false
    };
  },
  actions: {
    info: showLevel('info'),
    alert: showLevel('alert'),
    success: showLevel('success'),
    warning: showLevel('warning')
  }
});

function showLevel(level) {
  return function(model) {
    var message = {
      closeAfter: Number(model.closeAfter)
    };
    message[model.raw ? 'raw' : 'message'] = model.message;
    this.get('notify').show(level, message);
  };
}
