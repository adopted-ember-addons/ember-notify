[<img align='right' alt='Build Status' src='https://travis-ci.org/aexmachina/ember-notify.png'>](https://travis-ci.org/aexmachina/ember-notify)

# ember-notify

#### [Visit project page and demo](http://aexmachina.info/ember-notify)

`ember-notify` displays wee little notification messages down the bottom of your Ember.js app.

The CSS classes are compatible with Zurb Foundation 5, Thoughtbot's Refills, and Bootstrap. For Bootstrap use `{{ember-notify messageStyle='bootstrap'}}` and for Refills use `{{ember-notify messageStyle='refills'}}`.

The CSS animations are inspired by CSS from [alertify.js](http://fabien-d.github.io/alertify.js/).

## Usage

1. Add `{{ember-notify}}` to one of your templates, usually in `application.hbs`
2. Inject the `notify` service
3. Display messages using the `info`, `success`, `warning`, `alert` and `error` methods
 
### Examples

```js
import {
  Component,
  inject
} from 'ember';
export default Component.extend({
  notify: inject.service('notify'),
  actions: {
    sayHello() {
      this.get('notify').info('Hello there!');
    }
  }
});
```

By default the notifications close after 2.5 seconds, although you can control this in your template:

```handlebars
{{ember-notify closeAfter=4000}}
```

Or you can control when each message is closed:

```js
var notify = this.get('notify');
var message = notify.alert('You can control how long it\'s displayed', {
  closeAfter: 10000 // or set to null to disable auto-hiding
});
```

...and you can hide messages programatically:

```js
message.set('visible', false);
```

You can specify raw HTML:

```js
notify.info({html: '<div class="my-div">Hooray!</div>'});
```

Rounded corners, if that's your thing:

```js
notify.alert('This one\'s got rounded corners.', {
  radius: true
});
```

### Multiple Containers

If you want to have separate notifications and control where they're inserted into the DOM you can 
have multiple `{{ember-notify}}` components, but only one of them can be accessed using the injected service.
The others you will need to provide a `source` property, so secondary containers should be used as follows:

```hbs
{{ember-notify source=someProperty}} 
```

```js
export default Ember.Component.extend({
  someProperty: Notify.property(), // or this.set('someProperty', Notify.create())
  actions: {
    clicked: function() {
      this.get('someProperty').success('Hello from the controller');
    }
  }
});
```

## Installation

This module is an ember-cli addon, so installation is easy as pie.

```sh
npm install ember-notify --save-dev
```

### Upgrading from a previous version

See [the CHANGELOG](https://github.com/aexmachina/ember-notify/blob/master/CHANGELOG.md).

## Compatibility

Some users have reported issues with IE8, so this is currently not supported.
