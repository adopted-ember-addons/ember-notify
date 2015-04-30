import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    notifyFromComponent: function() {
      this.notify.success('It worked!');
    }
  }
});
