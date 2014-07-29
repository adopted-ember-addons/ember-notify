import Notify from 'ember-notify';

export default Ember.Component.extend({
  /**
    An instance of ContainerView must be provided
   */
  notify: null,
  childViews: [],
  layoutName: 'ember-notify',
  init: function() {
    this.get('childViews').pushObject(this.get('notifyView'));
    this._super();
  },
  notifyView: function() {
    var notify = this.get('notify');
    Ember.assert("You must provide a notify property that is an instance of NotifyContainer to {{ember-notify}}", Notify.Container.detectInstance(notify));
    return notify;
  }.property('notify')
});
