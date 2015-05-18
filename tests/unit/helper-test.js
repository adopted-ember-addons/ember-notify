import Ember from 'ember';
import {
  describeComponent,
  it
} from 'ember-mocha';
import {
  messages,
  observeSequence
} from '../helpers';
import Notify from 'ember-notify';

describeComponent('ember-notify', 'Notify helper', () => {
  beforeEach(() => Notify.testing = true);
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

  it('will queue pending messages if the component isn\'t rendered', function() {
    var component = this.subject();
    var message = Notify.info('Hello world');
    expect($('.ember-notify').length).to.equal(0, 'component is not yet shown');
    expect(message.then).to.be.a('function', 'the returned message is a PromiseProxy');
    this.render();

    return observeSequence(message, 'visible', [true])
      .then(Ember.run.next(() =>
        expect(messages(component.$()).length).to.equal(1, '1 element is shown')
      ));
  });

  it('handles calling set on a queued message', function() {
    var component = this.subject();
    var message = Notify.info('Hello world');
    message.set('message', 'Frank Zappa');
    this.render();

    return observeSequence(message, 'visible', [true])
      .then(() =>
        expect(messages(component.$()).find('.message').text()).to.equal('Frank Zappa', 'message is updated')
    );
  });
});

