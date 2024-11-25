import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default Route.extend({
  notifyFromRoute: action(function () {
    this.notify.success('It worked!');
  }),
});
