import Ember from 'ember';

export default Ember.Object.extend({
  message: null,
  raw: '',
  type: 'info',
  closeAfter: 2500,
  visible: undefined
});
