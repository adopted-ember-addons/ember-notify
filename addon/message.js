import Ember from 'ember';

export default Ember.Object.extend({
  text: null,
  html: '',
  type: 'info',
  closeAfter: undefined,
  visible: undefined,
  classNames: []
});
