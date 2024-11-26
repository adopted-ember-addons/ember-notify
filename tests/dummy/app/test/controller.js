import Controller from '@ember/controller';
import { action } from '@ember/object';

export default Controller.extend({
  notifyFromController: action(function () {
    this.notify.success('It worked!');
  }),

  notifyFromRoute: action(function () {
    this.send('notifyFromRoute');
  }),
});
