import { A } from '@ember/array';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('EmberNotifyComponent | Integration', (hooks) => {
  setupRenderingTest(hooks);

  test('renders block version', async function (assert) {
    this.set('messages', []);

    await render(hbs`
      <EmberNotify @messages={{this.messages}} as |message close|>
        <a {{on 'click' close}} class='close-from-block'>CLOSE</a>
        <span class='message-from-block'>{{message.text}}</span>
      </EmberNotify>
    `);

    let dummyMessage = EmberObject.create({
      text: 'dummy text',
      visible: true,
      type: 'alert',
    });

    this.set('messages', A([dummyMessage]));

    // Ensure block is yielded
    assert.strictEqual(find('.message-from-block').textContent, 'dummy text');

    // Close action is passed
    await click('.close-from-block');
    assert.notOk(dummyMessage.visible);
  });
});
