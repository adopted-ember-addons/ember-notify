"use strict";
var template = require("./template")["default"] || require("./template");

var Container = Ember.ContainerView.extend({

  info: aliasToShow(null),
  success: aliasToShow('success'),
  warning: aliasToShow('warning'),
  alert: aliasToShow('alert'),
  error: aliasToShow('error alert'),

  classNames: ['ember-notify-cn'],
  show: function(type, message, options) {
    var view = Notify.View.create({
      message: message,
      type: type
    });
    if (options) {
      view.setProperties(options);
    }
    return this.pushObject(view);
  }
});

function aliasToShow(type) {
  return function(message, options) {
    return this.show(type, message, options);
  };
}

var Notify = Container.createWithMixins({
  rootElement: null,
  classNames: ['default-cn'],
  init: function() {
    this._super();
    var that = this;
    var observer = {
      arrayWillChange: function(that, start, removeCount, addCount) {
        that.appendTo(that.get('rootElement') || document.body);
        that.removeArrayObserver(observer);
      }
    };
    this.addArrayObserver(observer);
  }
});

Notify.Container = Container;
Notify.BaseView = Ember.View.extend({
  classNames: ['ember-notify'],
  classNameBindings: ['type', 'visible:ember-notify-show', 'hidden:ember-notify-hidden'],
  attributeBindings: ['data-alert'],
  'data-alert': '',
  defaultTemplate: template,
  type: null, // normal (default), success, alert, secondary
  hidden: Ember.computed.not('visible'),
  closeAfter: 2500,
  removeAfter: 250,
  close: function() {
    this.send('close');
  },
  didInsertElement: function() {
    this.set('visible', true);
    var closeAfter;
    if (!Ember.testing && (closeAfter = this.get('closeAfter'))) {
      Ember.run.later(this, function() {
        this.set('visible', false);
        this.send('close');
      }, closeAfter);
    }
  },
  actions: {
    close: function() {
      var that = this, removeAfter;
      this.set('visible', false);
      if (!Ember.testing) {
        if (removeAfter = this.get('removeAfter')) {
          Ember.run.later(this, close, removeAfter);
        }
      }
      else {
        close();
      }
      function close() {
        var parentView = that.get('parentView');
        if (parentView) parentView.removeObject(that);
      }
    }
  }
});

Notify.FoundationView = Notify.BaseView.extend({
  classNames: ['alert-box'],
  classNameBindings: ['radius::']
});

Notify.View = Notify.FoundationView;

Ember.Application.initializer({
  name: 'ember-notify',
  initialize: function(container, App) {
    // set the rootElement of the Notify container to the first Ember Application
    // instance that initializes
    if (Notify.get('rootElement')) return;
    Notify.set('rootElement', App.rootElement);
  }
});

exports["default"] = Notify;