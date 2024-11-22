import { next } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find,rerender } from '@ember/test-helpers';
import { observeSequence, timesSince } from '../../../helpers';
import Message from 'ember-notify/message';
import { Theme } from 'ember-notify/components/ember-notify';

module('MessageComponent', hooks => {
  // eslint-disable-next-line ember/no-restricted-resolver-tests
  setupRenderingTest(hooks);

  test('renders the message component', async function(assert) {
    // creates the component instance
    let component = this.owner.lookup('component:ember-notify/message');
    assert.true(component._state === 'preRender');

    // renders the component on the page
    component.appendTo(this.element);
    await rerender();
    assert.true(component._state === 'inDOM');
  });

  test('renders the DOM element', async function(assert) {
    let message = Message.create({
      visible: true,
      text: 'Hello world',
      closeAfter: 500,
      removeAfter: 500
    });

    let component = this.owner.lookup('component:ember-notify/message');
    component.set('message', message);
    component.set('theme', Theme);
    component.set('class', 'ember-notify clearfix');
    component.appendTo(this.element);

    await rerender();

    let el = component.get('element');
    let span = find('span.message');

    assert.ok(el);
    assert.true(el.matches('.info'));
    assert.ok(span);
    assert.true(span.textContent === 'Hello world');
  });

  test('closes on its own', async function(assert) {
    let message = Message.create({
      visible: true,
      text: 'Hello world',
      closeAfter: 500
    });

    let component = this.owner.lookup('component:ember-notify/message');
    component.set('message', message);
    component.set('theme', Theme);
    component.set('class', 'ember-notify clearfix');
    component.appendTo(this.element);

    await rerender();

    let start = new Date();

    let el = component.get('element');
    el.classList.add('ember-notify');

    assert.true(message.visible, 'message is visible');
    assert.true(el.classList.contains('ember-notify-show'), 'message has show class');

    return observeSequence(message, 'visible', [false])
      .then(observed => next(() => {
        assert.false(message.visible, 'message no longer visible');
        assert.false(el.classList.contains('ember-notify-show'), 'message does not have show class');
        let times = timesSince(observed, start);
        assert.true(times[0] > 500);
      }));
  });

  test('does not close when hovered', async function(assert) {
    const done = assert.async();
    let isHovering = true;
    let message = Message.create({
      visible: true,
      text: 'Hello world',
      closeAfter: 500
    });

    let component = this.owner.lookup('component:ember-notify/message');
    component.set('message', message);
    component.set('theme', Theme);
    component.set('class', 'ember-notify clearfix');
    component.reopen({ isHovering: () => isHovering });
    component.appendTo(this.element);
    await rerender();

    let el = component.get('element');
    el.classList.add('ember-notify');

    assert.true(message.visible, 'message is visible');
    assert.true(el.classList.contains('ember-notify-show'), 'message has show class');

    setTimeout(() => {
      assert.true(message.visible, 'message remains visible');
      assert.true(el.classList.contains('ember-notify-show'), 'message continues to have show class');

      isHovering = false;

      setTimeout(() => {
        assert.false(message.visible, 'message no longer visible');
        assert.false(el.classList.contains('ember-notify-show'), 'message does not have show class');
        assert.true(el.classList.contains('ember-notify-hide'), 'message has hide class');
        done();
      }, 100);
    }, 490);
  });
});
