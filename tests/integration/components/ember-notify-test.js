/* jshint expr:true */
import Ember from 'ember';
import {
  describeComponent,
  it
} from 'ember-mocha';
import Notify from 'ember-notify';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'ember-notify',
  'EmberNotifyComponent | Integration',
  {
    integration: true
  },
  function() {
    before(() => Notify.testing = true);
    after(() => Notify.testing = false);

    it('renders block version', function() {
      this.render(hbs`
        {{#ember-notify messages=messages as |message close|}}
          <a {{action close}} class='close-from-block'>CLOSE</a>
          <span class='message-from-block'>{{message.text}}</span>
        {{/ember-notify}}
      `);

      const dummyMessage = Ember.Object.create({text: 'dummy text', visible: true, type: 'alert'});
      this.set('messages', [ dummyMessage ]);

      // ensure block is yielded
      expect(this.$().find('.message-from-block').text()).to.equal('dummy text');
      // close action is passed
      this.$().find('.close-from-block').click();
      expect(dummyMessage.get('visible')).to.be.false;
    });
  }
);
