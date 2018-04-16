import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    notifyFromController: function() {
      this.notify.success('It worked!');
    }
  }
});
