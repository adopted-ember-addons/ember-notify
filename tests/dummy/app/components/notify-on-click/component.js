import Component from '@ember/component';

export default Component.extend({
  actions: {
    notifyFromComponent: function() {
      this.notify.success('It worked!');
    }
  }
});
