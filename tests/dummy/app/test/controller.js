import Controller from '@ember/controller';
import { action } from '@ember/object';

export default Controller.extend({
  notifyFromController: action(function () {
    this.notify.success('It worked!');
  }),
});
