import EmberObject from '@ember/object';
import { next } from '@ember/runloop';
import { it, describe, beforeEach } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import { find } from 'ember-native-dom-helpers';
import Notify from 'ember-notify';

let helper;

describe('multiple sources', () => {
  setupComponentTest('multiple-components', {
    needs: ['service:notify', 'component:ember-notify', 'component:ember-notify/message'],
    setup() {
      helper = this.container.lookup('service:notify');
    }
  });

  beforeEach(() => Notify.testing = true);

  it('source property allows multiple {{ember-notify}} components', function(done) {
    let secondarySource = Notify.create();
    let component = this.subject({ secondary: secondarySource });
    helper.info('Hello world');
    this.render();

    let primary = find('.primary', component.element);
    let secondary = find('.secondary', component.element);

    next(() => {
      expect(find('.ember-notify', primary)).to.exist;
      expect(find('.ember-notify', secondary)).to.not.exist;
      secondarySource.info('Hello again');
    });

    next(() => next(() => {
      expect(find('.ember-notify', secondary)).to.exist;
      done();
    }));

    let propertyTest = EmberObject.extend({
      property: Notify.property()
    }).create();

    expect(propertyTest.property).to.respondTo('show',
      'Notify.property provides a Notify instance'
    );
  });
});

