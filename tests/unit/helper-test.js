import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find,rerender } from '@ember/test-helpers';

module('Notify helper', hooks => {
  // eslint-disable-next-line ember/no-restricted-resolver-tests
  setupRenderingTest(hooks);

  test('can be used to show messages', async function(assert) {
    let helper = this.owner.lookup('service:notify');
    let message = helper.info('Hello world');
    await rerender();
    assert.notOk(message.visible, 'message is not visible');

    let component = this.owner.lookup('component:ember-notify');
    component.appendTo(this.element);
    await rerender();

    let notify = find('.ember-notify');
    assert.ok(notify);
    assert.true(message.visible, 'message is visible');
  });

  test('will queue pending messages if the component isn\'t rendered', async function(assert) {
    let helper = this.owner.lookup('service:notify');

    helper.info('Hello world');
    assert.notOk(find('.ember-notify'));

    let component = this.owner.lookup('component:ember-notify');
    component.appendTo(this.element);
    await rerender();

    let notify = find('.ember-notify');
    assert.ok(notify);
  });

  test('handles calling set on a queued message', async function(assert) {
    let helper = this.owner.lookup('service:notify');

    let message = helper.info('Hello world');
    message.set('text', 'Frank Zappa');

    let component = this.owner.lookup('component:ember-notify');
    component.appendTo(this.element);
    await rerender();

    let notify = find('.ember-notify');
    assert.ok(notify);

    assert.true(find('.message').textContent === 'Frank Zappa', 'message is updated');
  });
});
