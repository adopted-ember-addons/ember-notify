import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  notifyFromComponent: action(function () {
    this.notify.success('It worked!');
  }),
});
