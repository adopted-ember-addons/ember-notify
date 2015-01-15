import Ember from 'ember';
import {
  describeComponent,
  it
} from 'ember-mocha';
import Notify from 'ember-notify';

beforeEach(() => Notify.testing = true);

describeComponent('ember-notify', 'ember-notify', () => {
  it('shows and hides messages with animations', function(done) {
    var component = this.subject();
    var message = component.show({
      message: 'Hello world',
      closeAfter: 500,
      removeAfter: 500
    });
    this.render();

    var $el = component.$();
    var $message = messages($el);
    expect($el.length).to.equal(1, 'component is added');
    expect($message.length).to.equal(1, 'element is in DOM');
    expect(message.get('visible')).to.equal(undefined, 'but not visible');
    expect($message.is('.info')).to.be.true();
    expect($message.find('.message').text()).to.equal('Hello world');

    Ember.run.later(function() {
      expect(message.get('visible')).to.equal(true, 'message is visible');
    }, 400);
    Ember.run.later(function() {
      expect(messages($el).length).to.equal(1, 'element is still in DOM');
      expect(message.get('visible')).to.equal(false, 'message is not visible');
    }, 900);
    Ember.run.later(function() {
      expect(messages($el).length).to.equal(0, 'element is removed from DOM');
      done();
    }, 1500);
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
      message: 'Hello world',
      type: level
    });
    this.render();

    var $el = component.$();
    var $message = messages($el);
    expect($el.length).to.equal(1, 'component is added');
    expect($message.length).to.equal(1, 'element is added');
    expect($message.find('.message').text()).to.equal('Hello world');
    expect($message.is('.' + level)).to.be.true();
  }

  it('can be shown manually', function() {
    var component = this.subject();
    var message = component.show({
      message: 'Hello world',
      visible: false
    });
    this.render();

    var $el = component.$();
    var $message = messages($el);
    expect($message.length).to.equal(1, 'element is added');
    expect($message.is('.ember-notify-hidden')).to.equal(true, 'message is hidden');
    Ember.run(() => message.set('visible', true));
    expect($message.is('.ember-notify-show')).to.equal(true, 'message is shown');
  });

  it('can be hidden manually', function(done) {
    var component = this.subject();
    var message = component.show({
      message: 'Hello world',
      removeAfter: 100
    });
    this.render();

    var $el = component.$();
    var $message = messages($el);
    expect($message.length).to.equal(1, 'element is added');
    Ember.run.next(() => Ember.run.next(() => {
      expect($message.is('.ember-notify-show')).to.equal(true, 'message is shown');
      Ember.run(() => message.set('visible', false));
      Ember.run.next(() =>
        expect($message.is('.ember-notify-hidden')).to.equal(true, 'message is hidden')
      );
      Ember.run.later(() => {
        expect(messages($el).length).to.equal(0, 'element is removed');
        done();
      }, 200);
    }));
  });

  it('supports Bootstrap styling', function() {
    var component = this.subject({
      messageStyle: 'bootstrap'
    });
    component.show({
      message: 'Hello world'
    });
    component.show({
      message: 'Hello again',
      type: 'alert'
    });
    this.render();

    var $el = component.$();
    var $message = messages($el);
    expect($message.eq(0).is('.alert.alert-info')).to.be.true();
    expect($message.eq(1).is('.alert.alert-danger')).to.be.true();
  });
});

describeComponent('ember-notify', 'Notify helper', () => {
  it('can be used to show messages', function(done) {
    var component = this.subject();
    var message = Notify.info('Hello world');
    expect(message.get('visible')).to.equal(undefined, 'message is initially hidden');
    this.render();

    var $messages = messages(component.$());
    expect($messages.length).to.equal(1, 'element is shown');
    Ember.run.next(() => {
      expect(message.get('visible')).to.equal(true, 'message is visible');
      Ember.run(() => message.set('visible', false));
      expect($messages.hasClass('ember-notify-hidden')).to.equal(true, 'messages can be hidden');

      Ember.run(() => Notify.success('Hello world'));
      $messages = messages(component.$());
      expect($messages.length).to.equal(2, '2 elements are shown');
      expect($messages.eq(1).hasClass('success')).to.equal(true);

      done();
    });
  });

  it('will queue pending messages if the compontent isn\'t rendered', function(done) {
    var component = this.subject();
    var message = Notify.info('Hello world');
    expect($('.ember-notify').length).to.equal(0, 'component is not yet shown');
    expect(message.then).to.be.a('function', 'the returned message is a PromiseProxy');
    this.render();

    Ember.run.next(() => {
      var $messages = messages(component.$());
      expect($messages.length).to.equal(1, '1 element is shown');
      message.set('visible', false);
      expect($messages.hasClass('ember-notify-hidden')).to.equal(true, 'messages can be hidden');
      done();
    });
  });
});

describeComponent('multiple-components', 'multiple sources', {
  needs: ['component:ember-notify', 'template:components/ember-notify']
}, () => {
  it('source property allows multiple {{ember-notify}} components', function() {
    var secondarySource = Notify.create();
    var component = this.subject({
      notify: secondarySource
    });
    this.render();
    Ember.run(() => Notify.info('Hello world'));
    var $primary = component.$('.primary');
    var $secondary = component.$('.secondary');
    expect(messages($primary).length).to.equal(1);
    expect(messages($secondary).length).to.equal(0);

    Ember.run(() => secondarySource.info('Hello again'));
    expect(messages($secondary).length).to.equal(1);

    var propertyTest = Ember.Object.extend({
      property: Notify.property()
    }).create();
    expect(propertyTest.get('property')).to.respondTo('show',
      'Notify.property provides a Notify instance'
    );
  });
});

function messages($el) {
  return $el.find('.ember-notify');
}
