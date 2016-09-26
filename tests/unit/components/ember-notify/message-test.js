/* jshint expr:true */
import Ember from 'ember';
import {
  describeComponent,
  it
} from 'ember-mocha';
import {
  observeSequence,
  timesSince
} from '../../../helpers';
import Notify from 'ember-notify';
import Message from 'ember-notify/message';
import {
  Theme
} from 'ember-notify/components/ember-notify';

describeComponent(
  'ember-notify/message',
  'MessageComponent',
  {
    needs: ['service:notify']
  },
  function() {
    before(() => Notify.testing = true);
    after(() => Notify.testing = false);

    it('renders the message component', function() {
      // creates the component instance
      var component = this.subject();
      expect(component._state).to.equal('preRender');

      // renders the component on the page
      this.render();
      expect(component._state).to.equal('inDOM');
    });
    
    it('renders the DOM element', function() {
      var theme = Theme.create();
      var message = Message.create({
        visible    : true,
        text       : 'Hello world',
        closeAfter : 500,
        removeAfter: 500
      });
      var component = this.subject({
        message: message,
        theme: theme,
        class: 'ember-notify clearfix'
       });

      this.render();

      var $el = component.$();
      var $span = $el.find('span.message');

      expect($el.length).to.equal(1, 'element is in DOM');
      expect($el.is('.info')).to.be.true;
      expect($span.length).to.equal(1, 'element has a span.message');
      expect($span.text()).to.equal('Hello world');
    });

    it('closes on its own', function() {
      var theme = Theme.create();
      var message = Message.create({
        visible   : true,
        text      : 'Hello world',
        closeAfter: 500
      });
      var component = this.subject({
        message: message,
        theme: theme,
        class: 'ember-notify clearfix'
       });

      this.render();

      var start = new Date();
      var $el = component.$();
      $el.addClass('ember-notify');

      expect(message.visible).to.equal(true, 'message is visible');
      expect($el.hasClass('ember-notify-show')).to.equal(true, 'message has show class');

      return observeSequence(message, 'visible', [false])
        .then(observed => Ember.run.next(() => {
          expect(message.visible).to.equal(false, 'message no longer visible');
          expect($el.hasClass('ember-notify-show')).to.equal(false, 'message does not have show class');
          var times = timesSince(observed, start);
          expect(times[0]).to.be.greaterThan(500);
        }));
    });

    it('does not close when hovered', function(done) {
      var isHovering = true;
      var theme = Theme.create();
      var message = Message.create({
        visible   : true,
        text      : 'Hello world',
        closeAfter: 500
      });
      var component = this.subject({
        message: message,
        theme  : theme,
        class  : 'ember-notify clearfix'
       }).reopen({
         isHovering: () => isHovering
       });

      this.render();
      
      var $el = component.$();
      $el.addClass('ember-notify');

      expect(message.visible).to.equal(true, 'message is visible');
      expect($el.hasClass('ember-notify-show')).to.equal(true, 'message has show class');

      setTimeout(() => {
        expect(message.visible).to.equal(true, 'message remains visible');
        expect($el.hasClass('ember-notify-show')).to.equal(true, 'message continues to have show class');

        isHovering = false;

        setTimeout(() => {
          expect(message.visible).to.equal(false, 'message no longer visible');
          expect($el.hasClass('ember-notify-show')).to.equal(false, 'message does not have show class');
          expect($el.hasClass('ember-notify-hide')).to.equal(true, 'message has hide class');
          done();
        }, 100);
      }, 500);
    });
  }
);
