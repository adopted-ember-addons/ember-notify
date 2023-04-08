import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import { find } from 'ember-native-dom-helpers';

let helper;

describe('Notify helper', function () {
  // eslint-disable-next-line ember/no-restricted-resolver-tests
  setupComponentTest('ember-notify', {
    setup() {
      helper = this.container.lookup('service:notify');
    },
    needs: ['service:notify', 'component:ember-notify/message'],
  });

  it('can be used to show messages', function () {
    let message = helper.info('Hello world');
    expect(message.visible).to.equal(undefined, 'message is not visible');

    let component = this.subject();
    this.render();

    let notify = find('.ember-notify', component.element);
    expect(notify).to.exist;
    expect(message.visible).to.equal(true, 'message is visible');
  });

  it("will queue pending messages if the component isn't rendered", function () {
    helper.info('Hello world');
    expect(find('.ember-notify')).to.not.exist;

    let component = this.subject();
    this.render();

    let notify = find('.ember-notify', component.element);
    expect(notify).to.exist;
  });

  it('handles calling set on a queued message', function () {
    let message = helper.info('Hello world');
    message.set('text', 'Frank Zappa');

    let component = this.subject();
    this.render();

    let notify = find('.ember-notify', component.element);
    expect(notify).to.exist;

    expect(find('.message', notify).textContent).to.equal(
      'Frank Zappa',
      'message is updated'
    );
  });
});
