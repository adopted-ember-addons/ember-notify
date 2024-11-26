import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('EmberNotifyMessageComponent | Integration', (hooks) => {
  setupRenderingTest(hooks);

  test('renders block version', async function (assert) {
    let dummyMessage = EmberObject.create({
      text: 'dummy text',
      visible: true,
    });

    this.set('message', dummyMessage);

    // Template block usage:
    await render(hbs`
      <EmberNotify::message @message={{this.message}} as |message close|>
        <a href='#' {{on 'click' close}} class='close-from-block'>CLOSE</a>
        <span class='message-from-block'>{{message.text}}</span>
      </EmberNotify::message>
    `);

    // Eensure block is yielded
    assert.strictEqual(find('.message-from-block').textContent, 'dummy text');

    // Close action is passed
    await click('.close-from-block');
    assert.notOk(dummyMessage.visible);
  });

  test('includes classNames', async function (assert) {
    this.set('message', {
      text: 'dummy text',
      visible: true,
      classNames: ['my-class'],
    });

    await render(hbs`
      <EmberNotify::message @message={{this.message}} />
    `);

    assert.strictEqual(find('.my-class .message').textContent, 'dummy text');
  });
});
