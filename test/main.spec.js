emq.globalize();

var App, Notify = EmberNotify.default;

// avoid slowing down the tests
Notify.View.reopenClass({
  closeAfter: 0,
  removeAfter: 0
});

module('ember-notify', {
  setup: function() {
    Ember.run(function() {
      App = Ember.Application.create({
        rootElement: '#ember-testing'
      });
      App.setupForTesting();
      App.injectTestHelpers();
    });
  },
  teardown: function() {
    App.reset();
  }
});

test('shows info messages', function() {
  var view;
  Ember.run(function() {
    view = Notify.info('Hello world', {
      closeAfter: 500,
      removeAfter: 500
    });
  });
  Ember.run(function() {
    var $el = find('.ember-notify');
    equal($el.length, 1, 'view is added');
    stop();
    setTimeout(function() {
      start();
      $el = find('.ember-notify');
      equal(view.get('visible'), true, 'view is still visible');
      equal($el.length, 1, 'view is still in the DOM');
    }, 400);
    stop();
    setTimeout(function() {
      start();
      equal(view.get('visible'), false, 'view is not visible');
      stop();
    }, 900);
    setTimeout(function() {
      start();
      ok(!view.$(), 'view is removed from the DOM');
    }, 1500);
  });
});

test('shows success messages', function() {
  var view;
  Ember.run(function() {
    view = Notify.success('Hello world');
  });
  Ember.run(function() {
    var $el = find('.ember-notify');
    equal($el.length, 1, 'view is added');
    ok($el.hasClass('success'), 'view has a success class');
    view.send('close');
  });
});
