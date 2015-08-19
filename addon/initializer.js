export function initialize(container, application) {
  application.inject('route', 'notify', 'service:notify');
  application.inject('controller', 'notify', 'service:notify');
}

export default {
  name: 'inject-notify-service',
  initialize: initialize
};
