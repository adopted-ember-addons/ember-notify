import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, rerender } from '@ember/test-helpers';
import Notify from 'ember-notify';

module('multiple sources', hooks => {
  // eslint-disable-next-line ember/no-restricted-resolver-tests
  setupRenderingTest(hooks);

  test('source property allows multiple {{ember-notify}} components', async function(assert) {
    let helper = this.owner.lookup('service:notify');

    let component = this.owner.lookup('component:ember-notify');
    component.reopen({defaultClass:'primary'})
    component.appendTo(this.element);

    let component2 = this.owner.lookup('component:ember-notify');
    let secondarySource = Notify.create();
    component2.reopen({secondary: secondarySource});
    component2.appendTo(this.element);
    helper.info('Hello world');
    await rerender();

    assert.ok(find('.primary'));
    assert.notOk(find('.secondary'));
    secondarySource.info('Hello again');
    await rerender();
    assert.ok(find('.secondary'));

    let propertyTest = EmberObject.extend({
      property: Notify.property()
    }).create();

    assert.ok(propertyTest.show,
      'Notify.property provides a Notify instance'
    );
  });
});

