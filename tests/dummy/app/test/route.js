import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    notifyFromRoute: function() {
      this.notify.success('It worked!');
    }
  }
});
