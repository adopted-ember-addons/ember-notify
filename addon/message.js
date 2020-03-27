import EmberObject from '@ember/object';

const EMPTY_ARRAY = [];

export default EmberObject.extend({
  text: null,
  html: '',
  type: 'info',
  closeAfter: undefined,
  visible: undefined,
  classNames: EMPTY_ARRAY,

  // will be set to the component rendering this message
  container: undefined,

  close() {
    if (this.container) {
      this.container.selfClose();
    }
  }
});
