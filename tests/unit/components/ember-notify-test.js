/* jshint expr:true */
import { htmlSafe } from '@ember/string';

import { next, run } from '@ember/runloop';
import { it, describe, before, after } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import { find, findAll } from 'ember-native-dom-helpers';
import $ from 'jquery';
import {
  observeSequence,
  timesSince
} from '../../helpers';
import Notify from 'ember-notify';

describe('EmberNotifyComponent', function() {
  setupComponentTest('ember-notify', {
    needs: ['service:notify', 'component:ember-notify/message']
  });

  before(() => Notify.testing = true);
  after(() => Notify.testing = false);

  it('renders', function() {
    // creates the component instance
    var component = this.subject();
    expect(component._state).to.equal('preRender');

    // renders the component on the page
    this.render();
    expect(component._state).to.equal('inDOM');
  });
  it('shows and hides messages with animations', function() {
    var component = this.subject();
    var start = new Date();
    var message = component.show({
      text: 'Hello world',
      closeAfter: 500,
      removeAfter: 500
    });
    this.render();

    var notify = find('.ember-notify');
    expect(notify).to.exist;
    expect(notify.matches('.info')).to.be.true;
    expect(find('.message', notify).textContent).to.equal('Hello world');

    return observeSequence(message, 'visible', [false, null])
      .then(observed => next(() => {
        expect(find('.ember-notify')).to.not.exist;
        var times = timesSince(observed, start);
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
    var component = this.subject();
    component.show({
      text: 'Hello world',
      type: level
    });
    this.render();

    var notify = find('.ember-notify');
    expect(notify).to.exist;
    expect(find('.message', notify).textContent).to.equal('Hello world');
    expect(notify.matches('.' + level)).to.be.true;
  }

  it('can render messages with SafeString', function() {
    var component = this.subject();
    component.show({
      text: new htmlSafe('Hello world'),
      type: 'info'
    });
    this.render();

    var notify = find('.ember-notify');
    expect(notify).to.exist;
    expect(find('.message', notify).textContent).to.equal('Hello world');
  });

  it('can be shown manually', function() {
    var component = this.subject();
    var message = component.show({
      text: 'Hello world',
      visible: false
    });
    this.render();

    var notify = find('.ember-notify');
    expect(notify).to.exist;
    expect(notify.matches('.ember-notify-hide')).to.equal(true, 'message is hidden');
    run(() => message.set('visible', true));
    expect(notify.matches('.ember-notify-show')).to.equal(true, 'message is shown');
  });

  it('can be hidden manually', function(done) {
    var start = new Date();
    var component = this.subject();
    var message = component.show({
      text: 'Hello world',
      closeAfter: 500,
      removeAfter: 100
    });
    this.render();

    var notify = find('.ember-notify');
    expect(notify).to.exist;
    run(() => message.set('visible', false) );
    observeSequence(message, 'visible', [null])
      .then(observed => next(() => {
        expect(find('.ember-notify')).to.not.exist;
        var times = timesSince(observed, start);
        expect(times[0]).to.be.greaterThan(100);
        done();
      }));
  });

  it('supports Bootstrap styling', function() {
    var component = this.subject({
      messageStyle: 'bootstrap'
    });
    component.show({
      text: 'Hello world'
    });
    component.show({
      text: 'Hello again',
      type: 'alert'
    });
    this.render();

    var notify = findAll('.ember-notify');
    expect(notify.length).to.equal(2);
    expect(notify[0].matches('.alert.alert-info')).to.be.true;
    expect(notify[1].matches('.alert.alert-danger')).to.be.true;
  });

  it('supports refills styling', function() {
    var component = this.subject({
      messageStyle: 'refills'
    });
    component.show({
      text: 'Hello world'
    });
    component.show({
      text: 'Hello again',
      type: 'alert'
    });
    this.render();

    var notify = findAll('.ember-notify');
    expect(notify.length).to.equal(2);
    expect(notify[0].matches('.flash-notice')).to.be.true;
    expect(notify[1].matches('.flash-error')).to.be.true;
  });

  it('supports semantic-ui styling', function() {
    var component = this.subject({
      messageStyle: 'semantic-ui'
    });
    component.show({
      text: 'Hello world'
    });
    component.show({
      text: 'Hello again',
      type: 'alert'
    });
    this.render();

    var notify = findAll('.ember-notify');
    expect(notify.length).to.equal(2);
    expect(notify[0].matches('.ui.message.info')).to.be.true;
    expect(notify[1].matches('.ui.message.error')).to.be.true;
  });

  it('supports being provided an element', function() {
    var component = this.subject({});
    component.show({
      element: document.createElement('input')
    });
    this.render();
    expect(find('.message input', component.get('element'))).to.exist;
  });
  if ($) {
    it('supports being provided a jquery element', function () {
      var component = this.subject({});
      component.show({
        element: $('<input>')    // eslint-disable-line ember/no-jquery
      });
      this.render();
      expect(find('.message input', component.get('element'))).to.exist;
    });
  }
  it(`defaults to using the 'ember-notify-default' CSS class`, function() {
    var component = this.subject({});
    component.show({});

    this.render();
    expect(component.get('element').className).to.contain('ember-notify-default');
  });
  it('supports customizing the base CSS class', function() {
    var component = this.subject({
      classPrefix: 'foo'
    });
    component.show({});

    this.render();
    expect(component.get('element').className).to.contain('foo');
    expect(component.get('element').className).to.not.contain('ember-notify-default');
  });
});
