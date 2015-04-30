import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    notifyFromController: function() {
      this.notify.success('It worked!');
    }
  }
});
