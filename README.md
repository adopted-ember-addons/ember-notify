# ember-notify

[![Build Status](https://travis-ci.org/aexmachina/ember-notify.png)](https://travis-ci.org/aexmachina/ember-notify)

`ember-notify` displays wee little notification messages down the bottom of your Ember.js app.

The CSS classes are compatible with Zurb Foundation 5, or you can use Bootstrap styling using `{{ember-notify messageStyle='bootstrap'}}`.

The CSS animations are inspired by CSS from [alertify.js](http://fabien-d.github.io/alertify.js/).

## Usage

1. Add `{{ember-notify}}` to one of your templates, usually in `application.hbs`.
2. Use the `Notify` helper to display messages: 

```js
import Notify from 'ember-notify';

Notify.info('Hello there!');
Notify.alert('This is an alert.');
Notify.success('It worked.'):
Notify.warning('Hmmn, that didn\'t work out.');
```

By default the notifications close after 2.5 seconds, or you can control when they're closed:

```js
var message = Notify.alert('You can control how long it\'s displayed', {
  closeAfter: 10000 // or set to null to disable auto-hiding
});
message.set('visible', false); // and you can hide messages programmatically.
```

The Notify methods (`info`, `success`, `warning`, `alert` and `error`) all return an instance of `Message`, rather than the `View` instance. You can use this object to change the `message` property, or to programatically hide the message by setting `visible` to `false`.

You can specify raw HTML:

```js
Notify.info({raw: '<div class="my-div">Hooray!</div>'});
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

See [the CHANGELOG](CHANGELOG.md).
