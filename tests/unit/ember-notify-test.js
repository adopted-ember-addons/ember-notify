import {
  describeComponent,
  it
} from 'ember-mocha';
import {Message} from 'ember-notify/main';
import startApp from '../helpers/start-app';
import Notify from 'ember-notify/main';

// avoid slowing down the tests
Message.reopen({
  closeAfter: 0,
  removeAfter: 0
});

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
    expect($message.length).to.equal(1, 'element is added');
    expect($message.is('.info')).to.be.true;
    expect($message.find('.message').text()).to.equal('Hello world');

    setTimeout(function() {
      expect(messages($el).length).to.equal(1, 'element is still in DOM');
      expect(message.get('visible')).to.equal(true, 'message is still visible');
    }, 400);
    setTimeout(function() {
      expect(messages($el).length).to.equal(1, 'element is still in DOM');
      expect(message.get('visible')).to.equal(false, 'message is not visible');
    }, 900);
    setTimeout(function() {
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
    var message = component.show({
      message: 'Hello world',
      type: level
    });
    this.render();

    var $el = component.$();
    var $message = messages($el);
    expect($el.length).to.equal(1, 'component is added');
    expect($message.length).to.equal(1, 'element is added');
    expect($message.find('.message').text()).to.equal('Hello world');
    expect($message.is('.' + level)).to.be.true;
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
    expect($message.is('.ember-notify-hidden')).to.be.true;
    Ember.run(() => message.set('visible', true));
    expect($message.is('.ember-notify-hidden')).to.be.false;
  });
});

describeComponent('ember-notify', 'Notify helper', () => {
  it('can be used to show messages', function() {
    var component = this.subject();
    var message = Notify.info('Hello world');
    expect(message.get('visible')).to.equal(undefined, 'message is initially hidden');
    this.render();

    var $messages = messages(component.$());
    expect($messages.length).to.equal(1, 'element is shown');
    expect(message.get('visible')).to.equal(true, 'message is visible');
    Ember.run(() => message.set('visible', false));
    expect($messages.hasClass('ember-notify-hidden')).to.equal(true, 'messages can be hidden');

    Ember.run(() => Notify.success('Hello world'));
    $messages = messages(component.$());
    expect($messages.length).to.equal(2, '2 elements are shown');
    expect($messages.eq(1).hasClass('success')).to.equal(true);
  });
});

describeComponent('multiple-components', 'messages property', {
  needs: ['component:ember-notify', 'template:components/ember-notify']
}, () => {
  it('messages property allows multiple {{ember-notify}} components', function() {
    var secondaryMessages = [];
    var component = this.subject({
      messages: secondaryMessages
    });
    this.render();
    Ember.run(() => Notify.info('Hello world'));
    var $primary = component.$('.primary');
    var $secondary = component.$('.secondary');
    expect(messages($primary).length).to.equal(1);
    expect(messages($secondary).length).to.equal(0);

    Ember.run(() => secondaryMessages.pushObject(
      Message.create({text: 'Hello again'}))
    );
    expect(messages($secondary).length).to.equal(1);
  });
})
function messages($el) {
  return $el.find('.ember-notify');
}
