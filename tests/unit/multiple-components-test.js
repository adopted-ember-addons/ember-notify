import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, rerender } from '@ember/test-helpers';
import Notify from 'ember-notify';

module('multiple sources', (hooks) => {
  // eslint-disable-next-line ember/no-restricted-resolver-tests
  setupRenderingTest(hooks);

  test('source property allows multiple {{ember-notify}} components', async function (assert) {
    let primarySource = Notify.create(),
      secondarySource = Notify.create();

    let component = this.owner.lookup('component:ember-notify');
    component.reopen({ defaultClass: 'primary' });
    primarySource.setTarget(component);
    component.appendTo(this.element);

    let component2 = this.owner.lookup('component:ember-notify');
    component2.reopen({ defaultClass: 'secondary' });
    secondarySource.setTarget(component2);
    component2.appendTo(this.element);
    primarySource.info('Hello world');
    await rerender();

    assert.strictEqual(find('.primary').innerText, '× Hello world');
    assert.notOk(find('.secondary').innerText);
    secondarySource.info('Hello again');
    await rerender();
    assert.strictEqual(find('.secondary').innerText, '× Hello again');

    let propertyTest = EmberObject.extend({
      property: Notify.property(),
    }).create();
    assert.ok(
      propertyTest.property.show,
      'Notify.property provides a Notify instance',
    );
  });
});
