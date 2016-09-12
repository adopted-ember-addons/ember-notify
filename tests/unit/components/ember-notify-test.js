/* jshint expr:true */
import Ember from 'ember';
import {
  describeComponent,
  it
} from 'ember-mocha';
import {
  messages,
  observeSequence,
  timesSince
} from '../../helpers';
import Notify from 'ember-notify';

describeComponent(
  'ember-notify',
  'EmberNotifyComponent',
  {
    needs: ['service:notify', 'component:ember-notify/message']
  },
  function() {
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

      var $el = component.$();
      var $message = messages($el);
      expect($el.length).to.equal(1, 'component is added');
      expect($message.length).to.equal(1, 'element is in DOM');
      expect($message.is('.info')).to.be.true;
      expect($message.find('.message').text()).to.equal('Hello world');

      return observeSequence(message, 'visible', [false])
        .then(observed => Ember.run.next(() => {
          expect(messages($el).length).to.equal(0, 'element is removed from DOM');
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

      var $el = component.$();
      var $message = messages($el);
      expect($el.length).to.equal(1, 'component is added');
      expect($message.length).to.equal(1, 'element is added');
      expect($message.find('.message').text()).to.equal('Hello world');
      expect($message.is('.' + level)).to.be.true;
    }

    it('can render messages with SafeString', function() {
      var component = this.subject();
      component.show({
        text: new Ember.String.htmlSafe('Hello world'),
        type: 'info'
      });
      this.render();

      var $el = component.$();
      var $message = messages($el);
      expect($el.length).to.equal(1, 'component is added');
      expect($message.length).to.equal(1, 'element is added');
      expect($message.find('.message').text()).to.equal('Hello world');
    });

    it('can be shown manually', function() {
      var component = this.subject();
      var message = component.show({
        text: 'Hello world',
        visible: false
      });
      this.render();

      var $el = component.$();
      var $message = messages($el);
      expect($message.length).to.equal(1, 'element is added');
      expect($message.is('.ember-notify-hide')).to.equal(true, 'message is hidden');
      Ember.run(() => message.set('visible', true));
      expect($message.is('.ember-notify-show')).to.equal(true, 'message is shown');
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

      var $el = component.$();
      expect(messages($el).length).to.equal(1, 'element is added');
      Ember.run(() => message.set('visible', false) );
      observeSequence(message, 'visible', [null])
        .then(observed => Ember.run.next(() => {
          expect(messages($el).length).to.equal(0, 'element is removed from DOM');
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

      var $el = component.$();
      var $message = messages($el);
      expect($message.eq(0).is('.alert.alert-info')).to.be.true;
      expect($message.eq(1).is('.alert.alert-danger')).to.be.true;
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

      var $el = component.$();
      var $message = messages($el);
      expect($message.eq(0).is('.flash-notice')).to.be.true;
      expect($message.eq(1).is('.flash-error')).to.be.true;
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

      var $el = component.$();
      var $message = messages($el);
      expect($message.eq(0).is('.ui.message.info')).to.be.true;
      expect($message.eq(1).is('.ui.message.error')).to.be.true;
    });

    it('supports being provided an element', function() {
      var component = this.subject({});
      component.show({
        element: $('<input>')
      });
      this.render();
      expect(component.$('.message input').length).to.equal(1);
    });
    it(`defaults to using the 'ember-notify-default' CSS class`, function() {
      var component = this.subject({});
      component.show({});

      this.render();
      expect(component.$().attr('class')).to.contain('ember-notify-default');
    });
    it('supports customizing the base CSS class', function() {
      var component = this.subject({
        classPrefix: 'foo'
      });
      component.show({});

      this.render();
      expect(component.$().attr('class')).to.contain('foo');
      expect(component.$().attr('class')).to.not.contain('ember-notify-default');
    });
  }
);
