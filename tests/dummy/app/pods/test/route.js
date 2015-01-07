import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    notifyFromRoute: function() {
      Ember.run.next(() =>
        this.notify.success('It worked!'));
    }
  }
});
