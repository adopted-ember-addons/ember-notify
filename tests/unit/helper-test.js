import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import $ from 'jquery';
import {
  messages
} from '../helpers';
import Notify from 'ember-notify';

var helper;
describe('Notify helper', function() {
  setupComponentTest('ember-notify', {
    setup() {
      helper = this.container.lookup('service:notify');
    },
    needs: ['service:notify', 'component:ember-notify/message']
  });

  before(() => Notify.testing = true);
  after(() => Notify.testing = false);

  it('can be used to show messages', function() {
    var message = helper.info('Hello world');
    expect(message.get('visible')).to.equal(undefined, 'message is not visible');

    var component = this.subject();
    this.render();

    var $messages = messages(component.$());
    expect($messages.length).to.equal(1, 'element is shown');
    expect(message.get('visible')).to.equal(true, 'message is visible');
  });

  it('will queue pending messages if the component isn\'t rendered', function() {
    helper.info('Hello world');
    expect($('.ember-notify').length).to.equal(0, 'component is not yet shown');

    var component = this.subject();
    this.render();

    expect(messages(component.$()).length).to.equal(1, '1 element is shown');
  });

  it('handles calling set on a queued message', function() {
    var message = helper.info('Hello world');
    message.set('text', 'Frank Zappa');

    var component = this.subject();
    this.render();

    expect(messages(component.$()).find('.message').text())
      .to.equal('Frank Zappa', 'message is updated');
  });
});
