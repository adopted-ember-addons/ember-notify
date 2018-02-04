import EmberObject from '@ember/object';

export default EmberObject.extend({
  text: null,
  html: '',
  type: 'info',
  closeAfter: undefined,
  visible: undefined,
  classNames: []
});
