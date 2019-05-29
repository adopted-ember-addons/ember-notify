[<img align="right" alt="Build Status" src="https://travis-ci.org/adopted-ember-addons/ember-notify.svg">](https://travis-ci.org/adopted-ember-addons/ember-notify)

# ember-notify

`ember-notify` displays wee little notification messages down the bottom of your Ember.js app.

### Compatibility

`ember-notify` is compatible with the following presentation frameworks:

- Zurb Foundation 6 (default)
- Zurb Foundation 5: `{{ember-notify messageStyle='foundation-5'}}`
- Thoughtbot Refills: `{{ember-notify messageStyle='refills'}}`
- Twitter Bootstrap: `{{ember-notify messageStyle='bootstrap'}}`
- Semantic-UI: `{{ember-notify messageStyle='semantic-ui'}}`
- UIKit: `{{ember-notify messageStyle='uikit'}}`

The CSS animations are inspired by CSS from [alertify.js](http://fabien-d.github.io/alertify.js/). You can also customize the positioning and animations by overriding the default `ember-notify` CSS class. For usage, see the [animations example](#custom-animations).

## Usage

1. Add `{{ember-notify}}` to one of your templates, usually in `application.hbs`
2. Inject the `notify` service
3. Display messages using the `info`, `success`, `warning`, `alert` and `error` methods

### Examples

```js
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  notify: service(),

  actions: {
    sayHello() {
      this.notify.info('Hello there!');
    }
  }
});
```

By default the notifications close after 2.5 seconds, although you can control this in your template:

```handlebars
{{ember-notify closeAfter=4000}}
```

Using angle bracket invocation, available in Ember 3.4+

```handlebars
<EmberNotify @closeAfter={{4000}} />
```

Or you can control when each message is closed:

```js
let message = this.notify.alert('You can control how long it\'s displayed', {
  closeAfter: 10000 // or set to null to disable auto-hiding
});
```

...and you can hide messages programmatically:

```js
message.set('visible', false);
```

You can specify raw HTML:

```js
this.notify.info({ html: '<div class="my-div">Hooray!</div>' });
```

Rounded corners, if that's your thing:

```js
this.notify.alert('This one\'s got rounded corners.', {
  radius: true
});
```

Include custom `classNames` on your message:

```js
this.notify.alert('Custom CSS class', {
  classNames: ['my-class']
});
```

Include an identifier to avoid duplicate messages being displayed:

```js
this.notify.alert('Unique Message', { id: 'some-unique-identifier' });
```

### Multiple Containers

If you want to have separate notifications and control where they're inserted into the DOM you can have multiple `{{ember-notify}}` components, but only one of them can be accessed using the injected service.
The others you will need to provide a `source` property, so secondary containers should be used as follows:

```hbs
{{ember-notify source=someProperty}}
```

Using angle bracket invocation

```hbs
<EmberNotify @source={{someProperty}} />
```

```js
import Component from '@ember/component';
import Notify from 'ember-notify';

export default Component.extend({
  alternativeNotify: Notify.property(),

  actions: {
    clicked() {
      this.alternativeNotify.success('Hello from the controller');
    }
  }
});
```

### Custom message template
You can pass a block with template you want to use for each message (instead of using the default one). It may look like this:
```hbs
  {{#ember-notify as |message close|}}
    <a {{action close}} class="close">
      close from block
    </a>
    <span class="message-from-block">
      {{message.text}}
    </span>
  {{/ember-notify}}
```

Using angle bracket invocation

```hbs
  <EmberNotify as |message close|>
    <a {{action close}} class='close'>
      close from block
    </a>
    <span class='message-from-block'>
      {{message.text}}
    </span>
  </EmberNotify>
```

Two arguments are passed to the block: `message` object, and `close` action. Make sure
you are using *Closure Actions* syntax passing the action (e. g. `<a {{action close}}` or
`{{your-component close=(action close)}}`.

### Custom Animations

By default, the `ember-notify` message will appear in the bottom right corner of the screen. You may want to control the positioning or the animation. To do so, you need to pass a CSS class using the `defaultClass` option. This will render the top level `ember-notify` element with the class you pass in.

```hbs
<!-- gives class="ember-notify-cn custom-notify"> to top level element-->
{{ember-notify defaultClass="custom-notify"}}

```

Using angle bracket invocation

```hbs
<!-- gives class="ember-view ember-notify-cn custom-notify"> to top level element-->
<EmberNotify @classPrefix={{"custom-notify"}} />

```

Then you need to add custom styling for each of the elements within the `ember-notify` structure.
The following snippet summarizes rules needed for a custom look. For a complete example that you can drop into your project, see [examples/custom-position-animations.css](examples/custom-position-animations.css)

```css
/* Main container */
.custom-notify {
  position: fixed;
  top: 10px;
  right: 0;
  left: 0;
}

/* Message box */
.custom-notify .callout {
  position: relative;
  overflow: hidden;
}

/* Classes applied for animating in/out */
.custom-notify .ember-notify-show {}
.custom-notify .ember-notify-hide {}
```

### Turn off loading CSS

If you want to use the addon without loading the CSS themes (because you have your own CSS) add this to
your `ember-cli-build.js` file:

```
let app = new EmberApp({
  emberNotify: {
    importCss: false
  }
});
```

## Installation

This module is an ember-cli addon, so installation is easy as pie.

```sh
ember install ember-notify
```

### Upgrading from a previous version

See [the CHANGELOG](https://github.com/adopted-ember-addons/ember-notify/blob/master/CHANGELOG.md).
