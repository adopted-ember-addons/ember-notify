import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    notifyFromController: function() {
      Ember.run.next(() =>
        this.notify.success('It worked!'));
    }
  }
});
