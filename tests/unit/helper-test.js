import { it, describe, before, after } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import { find } from 'ember-native-dom-helpers';
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

    var notify = find('.ember-notify', component.get('element'));
    expect(notify).to.exist;
    expect(message.get('visible')).to.equal(true, 'message is visible');
  });

  it('will queue pending messages if the component isn\'t rendered', function() {
    helper.info('Hello world');
    expect(find('.ember-notify')).to.not.exist;

    var component = this.subject();
    this.render();

    var notify = find('.ember-notify', component.get('element'));
    expect(notify).to.exist;
  });

  it('handles calling set on a queued message', function() {
    var message = helper.info('Hello world');
    message.set('text', 'Frank Zappa');

    var component = this.subject();
    this.render();

    var notify = find('.ember-notify', component.get('element'));
    expect(notify).to.exist;

    expect(find('.message', notify).textContent)
      .to.equal('Frank Zappa', 'message is updated');
  });
});
