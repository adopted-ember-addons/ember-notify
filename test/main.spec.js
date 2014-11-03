emq.globalize();

var App, Notify = EmberNotify.default;

// avoid slowing down the tests
Notify.View.reopen({
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
    Ember.testing = false;
    view = Notify.info('Hello world', {
      closeAfter: 500,
      removeAfter: 500
    });
  });
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

test('shows success messages', function() {
  testLevelMethod.call(this, 'success');
});

test('shows warning messages', function() {
  testLevelMethod.call(this, 'warning');
});

test('shows alert messages', function() {
  testLevelMethod.call(this, 'alert');
});

test('shows error messages', function() {
  testLevelMethod.call(this, 'error');
});

function testLevelMethod(level) {
  var view, message = 'Hello world';
  Ember.run(function() {
    view = Notify[level].call(Notify, message);
  });
  Ember.run(function() {
    var $el = find('.ember-notify');
    equal($el.length, 1, 'view is added');
    ok($el.hasClass(level), 'view has a ' + level + ' class');
    equal($el.find('.message').text(), message);
    view.send('close');
  });
}

test('supports multiple containers', function() {
  var parent, view;
  Ember.run(function() {
    var container = Notify.Container.create({});
    parent = Ember.ContainerView.create({
      childViews: [container]
    });
    parent.appendTo(App.rootElement);
    view = container.info('Hello from another container');
  });
  Ember.run(function() {
    var $el = find('.ember-notify');
    equal($el.length, 1, 'view is added');
    ok($.contains(parent.get('element'), $el.get(0)), 'message is inside the container');
    view.send('close');
  });
});

test('supports raw HTML', function() {
  Ember.run(function() {
    view = Notify.show('info', {raw: '<div class="my-div">Hello</div>'});
  });
  Ember.run(function() {
    var $el = find('.ember-notify');
    equal($el.length, 1, 'view is added');
    ok($el.hasClass('info'), 'view has an info class');
    ok($el.find('.my-div').length, 'view contains the raw HTML');
    view.send('close');
  });
});
