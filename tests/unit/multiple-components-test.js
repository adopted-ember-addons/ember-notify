import Ember from 'ember';
import {
  describeComponent,
  it
} from 'ember-mocha';
import {
  messages
} from '../helpers';
import Notify from 'ember-notify';

describeComponent('multiple-components', 'multiple sources', {
  needs: ['component:ember-notify', 'template:components/ember-notify']
}, () => {
  beforeEach(() => Notify.testing = true);
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

