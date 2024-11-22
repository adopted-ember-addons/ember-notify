import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  notify: service(),

  model() {
    return {
      text: 'Hello, world!',
      closeAfter: 2500,
      html: false
    };
  },
});


