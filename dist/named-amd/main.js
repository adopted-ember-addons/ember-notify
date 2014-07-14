define("ember-notify",
  ["./template","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var template = __dependency1__["default"] || __dependency1__;

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
    __exports__["default"] = Notify;

    Notify.Container = Container;
    Notify.BaseView = Ember.View.extend({
      classNames: ['ember-notify'],
      classNameBindings: ['typeCss', 'visible:ember-notify-show', 'hidden:ember-notify-hidden'],
      attributeBindings: ['data-alert'],
      'data-alert': '',
      defaultTemplate: template,
      type: null, // normal (default), success, alert, secondary
      hidden: Ember.computed.not('visible'),
      closeAfter: 2500,
      removeAfter: 250, // allow time for the close animation to finish
      typeCss: Em.computed.alias('type'),
      close: function() {
        this.send('close');
      },
      didInsertElement: function() {
        Ember.run.next(this, function() {
          this.set('visible', true);
        });
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
    Notify.BootstrapView = Notify.BaseView.extend({
      classNames: ['alert'],
      typeCss: function() {
        return 'alert-%@'.fmt(this.get('type'));
      }.property('type')
    });

    Notify.setViewClass = function(view) {
      Notify.View = view;
    };
    Notify.setViewClass(Notify.FoundationView);
    Notify.useBootstrap = function() {
      this.setViewClass(Notify.BootstrapView);
    };

    Ember.Application.initializer({
      name: 'ember-notify',
      initialize: function(container, App) {
        // set the rootElement of the Notify container to the first Ember Application
        // instance that initializes
        if (Notify.get('rootElement')) return;
        Notify.set('rootElement', App.rootElement);
      }
    });
  });
define("ember-notify/template",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression;


      stack1 = helpers._triageMustache.call(depth0, "view.message", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("<a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "close", {hash:{
        'target': ("view")
      },hashTypes:{'target': "STRING"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" class=\"close\">&times;</a>\n");
      return buffer;
      
    });
  });