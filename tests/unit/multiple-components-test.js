import EmberObject from '@ember/object';
import { next } from '@ember/runloop';
import { it, describe, beforeEach } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import { find } from 'ember-native-dom-helpers';
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

    var primary = find('.primary', component.get('element'));
    var secondary = find('.secondary', component.get('element'));
    next(() => {
      expect(find('.ember-notify', primary)).to.exist;
      expect(find('.ember-notify', secondary)).to.not.exist;
      secondarySource.info('Hello again');
    });

    next(() => next(() => {
      expect(find('.ember-notify', secondary)).to.exist;
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

