# ember-notify

[![Build Status](https://travis-ci.org/aexmachina/ember-notify.png)](https://travis-ci.org/aexmachina/ember-notify)

`ember-notify` displays wee little notification messages down the bottom of your Ember.js app. They're animated, it's awesome!

By default assumes Zurb Foundation 5 for styling, but you can use Bootstrap styling by calling `Notify.useBootstrap()`.

The CSS animations are based on the CSS in [alertify.js](http://fabien-d.github.io/alertify.js/).

## Usage

```javascript
import Notify from 'ember-notify';

Notify.alert("This is some info.");
Notify.success("That worked!"):
Notify.warning("Hmmn, that didn't work out.");
Notify.alert("This one's got rounded corners.", {
  radius: true
});
```

### Containers

`Notify` is an instance of the `Notify.Container` class, and will automatically append itself to the `rootElement` (of the first `Ember.Application` to initialize) the first time you display a notification. 

You can create your own containers and control where they're inserted into the DOM like so:

```javascript
var container = Notify.Container.create();
container.appendTo($('#some-element'));
container.alert("Yo dawg.");
```

## Installation

### Ember CLI

This module is an `ember-addon`, so all you need to do is:

```
npm install ember-notify --save-dev
```

Then you can `import Notify from 'ember-notify';` as above.

### Module Formats

You will find all the popular formats in `dist/`. If you're using the `dist/global/main.js` module, the `Notify` object can be found at `window.EmberNotify.default`.

Don't forget to import the CSS from `ember-notify/dist/ember-notify.css`.

## Contributing

You can run the tests using `npm test` or in dev mode using `karma start`.

- Uncomment `http://localhost:4200/globals/main.js` in `karma.conf` to use with `broccoli serve` in development
- The `template.hbs` is compiled into `dist/template.js`, but if this is updated it'll need to be copied into `lib/template.js` (with `export default` before it). If you have a way to do this then please let me know :)
