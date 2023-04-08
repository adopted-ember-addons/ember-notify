import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  notify: service(),

  model() {
    return {
      text: 'Hello, world!',
      closeAfter: 2500,
      html: false,
    };
  },

  actions: {
    info: showLevel('info'),
    alert: showLevel('alert'),
    success: showLevel('success'),
    warning: showLevel('warning'),
  },
});

function showLevel(level) {
  return function (model) {
    let message = {
      closeAfter: Number(model.closeAfter),
    };

    message[model.html ? 'html' : 'text'] = model.text;
    this.notify.show(level, message);
  };
}
