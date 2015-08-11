import Ember from 'ember';
import {
  describeComponent,
  it
} from 'ember-mocha';
import {
  messages
} from '../helpers';
import Notify from 'ember-notify';

var helper;
describeComponent('multiple-components', 'multiple sources', {
  needs: ['service:notify', 'component:ember-notify', 'component:ember-notify/message'],
  setup() {
    helper = this.container.lookup('service:notify');
  }
}, () => {
  beforeEach(() => Notify.testing = true);
  it('source property allows multiple {{ember-notify}} components', function(done) {
    var secondarySource = Notify.create();
    var component = this.subject({
      secondary: secondarySource
    });
    helper.info('Hello world');
    this.render();

    var $primary = component.$('.primary');
    var $secondary = component.$('.secondary');
    Ember.run.next(() => {
      expect(messages($primary).length).to.equal(1);
      expect(messages($secondary).length).to.equal(0);
      secondarySource.info('Hello again');
    });

    Ember.run.next(() => Ember.run.next(() => {
      expect(messages($secondary).length).to.equal(1);
      done();
    }));

    var propertyTest = Ember.Object.extend({
      property: Notify.property()
    }).create();
    expect(propertyTest.get('property')).to.respondTo('show',
      'Notify.property provides a Notify instance'
    );

  });
});

