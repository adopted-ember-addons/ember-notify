define("ember-notify",
  ["exports"],
  function(__exports__) {
    "use strict";
    var Container = Ember.ContainerView.extend({

      info: show(null),
      success: show('success'),
      warning: show('warning'),
      alert: show('alert'),
      error: show('error alert'),

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
    function show(type) {
      return function(message, options) {
        return this.show(type, message, options);
      };
    }

    var Notify = Container.createWithMixins({
      classNames: ['default-cn'],
      init: function() {
        this._super();
        var that = this;
        var observer = {
          arrayWillChange: function(that, start, removeCount, addCount) {
            that.append();
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
      template: Ember.Handlebars.compile('{{view.message}}<a {{action "close" target="view"}} class="close">&times;</a>'),
      type: null, // normal (default), success, alert, secondary
      hidden: Ember.computed.not('visible'),
      closeAfter: 2500,
      removeAfter: 250,
      close: function() {
        this.send('close');
      },
      didInsertElement: function() {
        Ember.run.next(this, function() {
          this.set('visible', true);
        });
        var closeAfter;
        if (closeAfter = this.get('closeAfter')) {
          Ember.run.later(this, function() {
            this.set('visible', false);
            var parent = this.get('parentView');
            Ember.run.later(this, function() {
              parent.removeObject(this);
            }, 1000);
          }, closeAfter);
        }
      },
      actions: {
        close: function() {
          this.set('visible', false);
          Ember.run.later(this, function() {
            this.get('parentView').removeObject(this);
          }, this.get('removeAfter'));
        }
      }
    });

    Notify.FoundationView = Notify.BaseView.extend({
      classNames: ['alert-box'],
      classNameBindings: ['radius::']
    });

    Notify.View = Notify.FoundationView;

    __exports__["default"] = Notify;
  });