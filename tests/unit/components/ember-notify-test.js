import { htmlSafe } from '@ember/template';
import { next, run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, findAll, render, rerender } from '@ember/test-helpers';
import { observeSequence, timesSince } from '../../helpers';
import { hbs } from 'ember-cli-htmlbars';

module('EmberNotifyComponent', (hooks) => {
  // eslint-disable-next-line ember/no-restricted-resolver-tests
  setupRenderingTest(hooks);

  test('renders', async function (assert) {
    // creates the component instance
    let component = this.owner.lookup('component:ember-notify');
    assert.strictEqual(component._state, 'preRender');

    component.appendTo(this.element);
    assert.strictEqual(component._state, 'inDOM');
  });

  test('only renders one message with unique id', async function (assert) {
    let component = this.owner.lookup('component:ember-notify');
    component.appendTo(this.element);
    component.show({
      id: 'unique-id',
      text: 'First',
      type: 'success',
    });

    component.show({
      id: 'other-id',
      text: 'Second',
      type: 'success',
    });

    component.show({
      id: 'unique-id',
      text: 'Third',
      type: 'success',
    });
    await rerender();

    let notify = find('.ember-notify');
    assert.ok(notify, 'notify rendered');
    assert.strictEqual(find('.message').textContent, 'First', 'Has First');
    assert.strictEqual(findAll('.message').length, 2, 'has 2 messages');
  });

  test('shows and hides messages with animations', async function (assert) {
    let component = this.owner.lookup('component:ember-notify');
    component.appendTo(this.element);
    let start = new Date();
    let message = component.show({
      text: 'Hello world',
      closeAfter: 500,
      removeAfter: 500,
    });

    await rerender();

    let notify = find('.ember-notify');
    assert.ok(notify);
    assert.true(notify.matches('.info'));
    assert.strictEqual(find('.message').textContent, 'Hello world');

    return await observeSequence(message, 'visible', [false, null]).then(
      (observed) =>
        next(async () => {
          await rerender();
          assert.notOk(find('.ember-notify'));
          let times = timesSince(observed, start);
          assert.true(times[0] > 500);
          assert.true(times[1] > 1000);
        }),
    );
  });

  test('shows success messages', async function (assert) {
    testLevelMethod.call(this, 'success', assert);
  });

  test('shows warning messages', async function (assert) {
    testLevelMethod.call(this, 'warning', assert);
  });

  test('shows alert messages', async function (assert) {
    testLevelMethod.call(this, 'alert', assert);
  });

  test('shows error messages', async function (assert) {
    testLevelMethod.call(this, 'error', assert);
  });

  async function testLevelMethod(level, assert) {
    let component = this.owner.lookup('component:ember-notify');
    component.appendTo(this.element);
    component.show({
      text: 'Hello world',
      type: level,
    });

    await rerender();

    let notify = find('.ember-notify');
    assert.ok(notify);
    assert.true(find('.message').innerText === 'Hello world');
    assert.true(notify.matches('.' + level));
  }

  test('can render messages with SafeString', async function (assert) {
    let component = this.owner.lookup('component:ember-notify');
    component.appendTo(this.element);
    component.show({
      text: new htmlSafe('Hello world'),
      type: 'info',
    });

    await rerender();

    let notify = find('.ember-notify');
    assert.ok(notify);
    assert.strictEqual(find('.message').textContent, 'Hello world');
  });

  test('can be shown manually', async function (assert) {
    let component = this.owner.lookup('component:ember-notify');
    component.appendTo(this.element);
    let message = component.show({
      text: 'Hello world',
      visible: false,
    });

    await rerender();

    let notify = find('.ember-notify');
    assert.ok(notify);
    assert.true(notify.matches('.ember-notify-hide'), 'message is hidden');
    run(() => message.set('visible', true));
    await rerender();
    assert.true(notify.matches('.ember-notify-show'), 'message is shown');
  });

  test('can be hidden manually', async function (assert) {
    const done = assert.async();
    let start = new Date();
    let component = this.owner.lookup('component:ember-notify');
    component.appendTo(this.element);
    let message = component.show({
      text: 'Hello world',
    });
    await rerender();

    let notify = find('.ember-notify');
    assert.ok(notify);
    run(() => message.close());
    observeSequence(message, 'visible', [null]).then((observed) =>
      next(async () => {
        await rerender();
        assert.strictEqual(find('.ember-notify'), null);
        let times = timesSince(observed, start);
        assert.true(times[0] > 100);
        done();
      }),
    );
  });

  test('supports Bootstrap styling', async function (assert) {
    await render(hbs`
      <EmberNotify @messageStyle="bootstrap" as |message close|>
        <a href="#" {{on 'click' close}} class='close-from-block'>CLOSE</a>
        <span class='message-from-block'>{{message.text}}</span>
      </EmberNotify>
    `);
    let notifyService = this.owner.lookup('service:notify');
    notifyService.info('Hello world');
    notifyService.error('Hello again');

    await rerender();

    let notify = findAll('.ember-notify');
    assert.strictEqual(notify.length, 2);
    assert.true(notify[0].matches('.alert.alert-info'));
    assert.true(notify[1].matches('.alert.alert-danger'));
  });

  test('supports refills styling', async function (assert) {
    await render(hbs`
      <EmberNotify @messageStyle="refills" as |message close|>
        <a href="#" {{on 'click' close}} class='close-from-block'>CLOSE</a>
        <span class='message-from-block'>{{message.text}}</span>
      </EmberNotify>
    `);
    let notifyService = this.owner.lookup('service:notify');
    notifyService.info('Hello world');
    notifyService.error('Hello again');

    await rerender();

    let notify = findAll('.ember-notify');
    assert.strictEqual(notify.length, 2);
    assert.true(notify[0].matches('.flash-notice'));
    assert.true(notify[1].matches('.flash-error'));
  });

  test('supports semantic-ui styling', async function (assert) {
    await render(hbs`
      <EmberNotify @messageStyle="semantic-ui" as |message close|>
        <a href="#" {{on 'click' close}} class='close-from-block'>CLOSE</a>
        <span class='message-from-block'>{{message.text}}</span>
      </EmberNotify>
    `);
    let notifyService = this.owner.lookup('service:notify');
    notifyService.info('Hello world');
    notifyService.error('Hello again');

    await rerender();

    let notify = findAll('.ember-notify');
    assert.strictEqual(notify.length, 2);
    assert.true(notify[0].matches('.ui.message.info'));
    assert.true(notify[1].matches('.ui.message.error'));
  });

  test('supports being provided an element', async function (assert) {
    let component = this.owner.lookup('component:ember-notify');
    component.show({ element: document.createElement('input') });
    component.appendTo(this.element);
    await rerender();
    assert.ok(find('.message input'));
  });

  test(`defaults to using the 'ember-notify-default' CSS class`, async function (assert) {
    let component = this.owner.lookup('component:ember-notify');
    component.show({});
    component.appendTo(this.element);
    await rerender();
    assert.ok(component.element.matches('.ember-notify-default'));
  });

  test('supports customizing the base CSS class', async function (assert) {
    let component = this.owner.lookup('component:ember-notify');
    component.defaultClass = 'foo';
    component.show({});
    component.appendTo(this.element);
    await rerender();
    assert.true(component.element.matches('.foo'));
    assert.false(component.element.matches('.ember-notify-default'));
  });
});
