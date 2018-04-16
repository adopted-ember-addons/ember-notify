import EmberObject from '@ember/object';
import { next } from '@ember/runloop';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import {
  messages
} from '../helpers';
import Notify from 'ember-notify';

var helper;
describe('multiple sources', () => {
  setupComponentTest('multiple-components', {
    needs: ['service:notify', 'component:ember-notify', 'component:ember-notify/message'],
    setup() {
      helper = this.container.lookup('service:notify');
    }
  });

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
    next(() => {
      expect(messages($primary).length).to.equal(1);
      expect(messages($secondary).length).to.equal(0);
      secondarySource.info('Hello again');
    });

    next(() => next(() => {
      expect(messages($secondary).length).to.equal(1);
      done();
    }));

    var propertyTest = EmberObject.extend({
      property: Notify.property()
    }).create();
    expect(propertyTest.get('property')).to.respondTo('show',
      'Notify.property provides a Notify instance'
    );

  });
});

