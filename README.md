[<img align='right' alt='Build Status' src='https://travis-ci.org/aexmachina/ember-notify.png'>](https://travis-ci.org/aexmachina/ember-notify)

# ember-notify

#### [Visit project page and demo](http://aexmachina.info/ember-notify)

`ember-notify` displays wee little notification messages down the bottom of your Ember.js app.

The CSS classes are compatible with Zurb Foundation 5, Thoughtbot's Refills, and Bootstrap. For Bootstrap use `{{ember-notify messageStyle='bootstrap'}}` and for Refills use `{{ember-notify messageStyle='refills'}}`.

The CSS animations are inspired by CSS from [alertify.js](http://fabien-d.github.io/alertify.js/).

## Usage

1. Add `{{ember-notify}}` to one of your templates, usually in `application.hbs`.
2. Use `this.notify` in routes or controllers to display messages: 

```js
this.notify.info('Hello there!');
this.notify.alert('This is an alert.');
this.notify.success('It worked.');
this.notify.warning('Hmmn, that didn\'t work out.');
```

If you're not in a route or a controller you can use the `Notify` helper: 

```js
import Notify from 'ember-notify';
Notify.info('Peace.');
```

By default the notifications close after 2.5 seconds, although you can control this in your template:

```handlebars
{{ember-notify closeAfter=4000}}
```

Or you can control when each message is closed:

```js
var message = Notify.alert('You can control how long it\'s displayed', {
  closeAfter: 10000 // or set to null to disable auto-hiding
});
message.set('visible', false); // and you can hide messages programatically.
```

You can specify raw HTML:

```js
Notify.info({html: '<div class="my-div">Hooray!</div>'});
```

Rounded corners, if that's your thing:

```js
Notify.alert('This one\'s got rounded corners.', {
  radius: true
});
```

### Multiple Containers

If you want to have separate notifications and control where they're inserted into the DOM you can 
have multiple `{{ember-notify}}` components, but only one of them can be accessed using the `Notify` helper. The others you will need to provide a `source` property.

Secondary containers should be used as follows:

```hbs
{{ember-notify source=someProperty}} 
```

```js
// in your controller
export default Ember.Controller.extend({
  someProperty: Notify.property(), // or this.set('someProperty', Notify.create())
  actions: {
    clicked: function() {
      this.get('someProperty').success('Hello from the controller');
    }
  }
});
```

## Installation

This module is an ember-cli addon, so all you need to do is:

```sh
npm install ember-notify --save-dev
```

### Upgrading from a previous version

See [the CHANGELOG](https://github.com/aexmachina/ember-notify/blob/master/CHANGELOG.md).

## Compatibility

Some users have reported issues with IE8, so this is currently not supported.
