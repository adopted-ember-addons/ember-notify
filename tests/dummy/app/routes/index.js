import Ember from 'ember';

export default Ember.Route.extend({
  notify: Ember.inject.service(),
  model() {
    return {
      text: 'Hello, world!',
      closeAfter: 2500,
      html: false
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
    message[model.html ? 'html' : 'text'] = model.text;
    this.get('notify').show(level, message);
  };
}
