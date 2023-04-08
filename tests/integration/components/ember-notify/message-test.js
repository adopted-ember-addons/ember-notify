import EmberObject from '@ember/object';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import { find, click } from 'ember-native-dom-helpers';
import hbs from 'htmlbars-inline-precompile';

describe('EmberNotifyMessageComponent | Integration', function () {
  setupComponentTest('ember-notify/message', {
    integration: true,
  });

  it('renders block version', function () {
    let dummyMessage = EmberObject.create({
      text: 'dummy text',
      visible: true,
    });

    this.set('message', dummyMessage);

    // Template block usage:
    this.render(hbs`
      {{#ember-notify/message message=message as |message close|}}
        <a {{action close}} class='close-from-block'>CLOSE</a>
        <span class='message-from-block'>{{message.text}}</span>
      {{/ember-notify/message}}
    `);

    // Eensure block is yielded
    expect(find('.message-from-block').textContent).to.equal('dummy text');

    // Close action is passed
    click('.close-from-block');
    expect(dummyMessage.visible).to.be.false;
  });

  it('includes classNames', function () {
    this.set('message', {
      text: 'dummy text',
      visible: true,
      classNames: ['my-class'],
    });

    this.render(hbs`
      {{ember-notify/message message=message}}
    `);

    expect(find('.my-class .message').textContent).to.equal('dummy text');
  });
});
