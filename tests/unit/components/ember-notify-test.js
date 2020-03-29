import { htmlSafe } from '@ember/string';
import { next, run } from '@ember/runloop';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import { find, findAll } from 'ember-native-dom-helpers';
import { observeSequence, timesSince } from '../../helpers';

describe('EmberNotifyComponent', function() {
  // eslint-disable-next-line ember/no-restricted-resolver-tests
  setupComponentTest('ember-notify', {
    needs: ['service:notify', 'component:ember-notify/message']
  });

  it('renders', function() {
    // creates the component instance
    let component = this.subject();
    expect(component._state).to.equal('preRender');

    // renders the component on the page
    this.render();
    expect(component._state).to.equal('inDOM');
  });

  it ('only renders one message with unique id', function() {
    let component = this.subject();
    component.show({
      id: 'unique-id',
      text: 'First',
      type: 'success'
    });

    component.show({
      id: 'other-id',
      text: 'Second',
      type: 'success'
    });

    component.show({
      id: 'unique-id',
      text: 'Third',
      type: 'success'
    });

    this.render();

    let notify = find('.ember-notify');
    expect(notify).to.exist;
    expect(find('.message', notify).textContent).to.equal('First');
    expect(findAll('.message').length).to.equal(2);
  });

  it('shows and hides messages with animations', function() {
    let component = this.subject();
    let start = new Date();
    let message = component.show({
      text: 'Hello world',
      closeAfter: 500,
      removeAfter: 500
    });

    this.render();

    let notify = find('.ember-notify');
    expect(notify).to.exist;
    expect(notify.matches('.info')).to.be.true;
    expect(find('.message', notify).textContent).to.equal('Hello world');

    return observeSequence(message, 'visible', [false, null])
      .then(observed => next(() => {
        expect(find('.ember-notify')).to.not.exist;
        let times = timesSince(observed, start);
        expect(times[0]).to.be.greaterThan(500);
        expect(times[1]).to.be.greaterThan(1000);
      }));
  });

  it('shows success messages', function() {
    testLevelMethod.call(this, 'success');
  });

  it('shows warning messages', function() {
    testLevelMethod.call(this, 'warning');
  });

  it('shows alert messages', function() {
    testLevelMethod.call(this, 'alert');
  });

  it('shows error messages', function() {
    testLevelMethod.call(this, 'error');
  });

  function testLevelMethod(level) {
    this.subject().show({
      text: 'Hello world',
      type: level
    });

    this.render();

    let notify = find('.ember-notify');
    expect(notify).to.exist;
    expect(find('.message', notify).textContent).to.equal('Hello world');
    expect(notify.matches('.' + level)).to.be.true;
  }

  it('can render messages with SafeString', function() {
    this.subject().show({
      text: new htmlSafe('Hello world'),
      type: 'info'
    });

    this.render();

    let notify = find('.ember-notify');
    expect(notify).to.exist;
    expect(find('.message', notify).textContent).to.equal('Hello world');
  });

  it('can be shown manually', function() {
    let component = this.subject();
    let message = component.show({
      text: 'Hello world',
      visible: false
    });

    this.render();

    let notify = find('.ember-notify');
    expect(notify).to.exist;
    expect(notify.matches('.ember-notify-hide')).to.equal(true, 'message is hidden');
    run(() => message.set('visible', true));
    expect(notify.matches('.ember-notify-show')).to.equal(true, 'message is shown');
  });

  it('can be hidden manually', function(done) {
    let start = new Date();
    let component = this.subject();
    let message = component.show({
      text: 'Hello world'
    });

    this.render();

    let notify = find('.ember-notify');
    expect(notify).to.exist;
    run(() => message.close() );
    observeSequence(message, 'visible', [null])
      .then(observed => next(() => {
        expect(find('.ember-notify')).to.not.exist;
        let times = timesSince(observed, start);
        expect(times[0]).to.be.greaterThan(100);
        done();
      }));
  });

  it('supports Bootstrap styling', function() {
    let component = this.subject({ messageStyle: 'bootstrap' });
    component.show({ text: 'Hello world' });
    component.show({
      text: 'Hello again',
      type: 'alert'
    });

    this.render();

    let notify = findAll('.ember-notify');
    expect(notify.length).to.equal(2);
    expect(notify[0].matches('.alert.alert-info')).to.be.true;
    expect(notify[1].matches('.alert.alert-danger')).to.be.true;
  });

  it('supports refills styling', function() {
    let component = this.subject({ messageStyle: 'refills' });
    component.show({ text: 'Hello world' });
    component.show({
      text: 'Hello again',
      type: 'alert'
    });

    this.render();

    let notify = findAll('.ember-notify');
    expect(notify.length).to.equal(2);
    expect(notify[0].matches('.flash-notice')).to.be.true;
    expect(notify[1].matches('.flash-error')).to.be.true;
  });

  it('supports semantic-ui styling', function() {
    let component = this.subject({ messageStyle: 'semantic-ui' });
    component.show({ text: 'Hello world' });
    component.show({
      text: 'Hello again',
      type: 'alert'
    });

    this.render();

    let notify = findAll('.ember-notify');
    expect(notify.length).to.equal(2);
    expect(notify[0].matches('.ui.message.info')).to.be.true;
    expect(notify[1].matches('.ui.message.error')).to.be.true;
  });

  it('supports being provided an element', function() {
    let component = this.subject({ });
    component.show({ element: document.createElement('input') });

    this.render();
    expect(find('.message input', component.get('element'))).to.exist;
  });

  it(`defaults to using the 'ember-notify-default' CSS class`, function() {
    let component = this.subject({ });
    component.show({ });

    this.render();
    expect(component.element.className).to.contain('ember-notify-default');
  });

  it('supports customizing the base CSS class', function() {
    let component = this.subject({ defaultClass: 'foo' });

    component.show({});

    this.render();
    expect(component.element.className).to.contain('foo');
    expect(component.element.className).to.not.contain('ember-notify-default');
  });
});
