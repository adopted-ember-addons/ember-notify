# ember-notify

[![Build Status](https://travis-ci.org/aexmachina/ember-notify.png)](https://travis-ci.org/aexmachina/ember-notify)

`ember-notify` displays wee little notification messages down the bottom of your Ember.js app. They're animated, it's awesome!

Currently uses Zurb Foundation 5 for styling, but it's designed to have support for Bootstrap or custom styling at some point in the future. It does what I need right now, just [create an Issue]() if you want to use it for anything.

The CSS animations are based on the CSS in [alertify.js](http://fabien-d.github.io/alertify.js/).

## Usage

`Ember.Notify` is an instance of the `Ember.Notify.Container` class, and will automatically append itself to the `rootElement` (of the first `Ember.Application` to initialize) the first time you display a notification. 

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

You can create your own containers and control where they're inserted into the DOM like so:

```javascript
var container = Notify.Container.create();
container.appendTo($('#some-element'));
container.alert("Yo dawg.");
```

## Installation

### Module Formats

You will find all the popular formats in `dist/`.

### Ember CLI

Add the following imports to your `Brocfile.js`:

```javascript
app.import('vendor/ember-notify/dist/named-amd/main.js', {
  'ember-notify': ['default']
});
app.import('vendor/ember-notify/dist/ember-notify.css');
```

### DIY

Use the global module. The `Notify` object can be found at `window.EmberNotify.default`.

```
<link rel="stylesheet" href="/ember-notify/dist/ember-notify.css">
<script src="/ember-notify/dist/globals/main.js"></script>
```

## Contributing

You can run the tests using `npm test` or in dev mode using `karma start`.

- Uncomment `http://localhost:4200/globals/main.js` in `karma.conf` to use with `broccoli serve` in development
- The `template.hbs` is compiled into `dist/template.js`, but if this is updated it'll need to be copied into `lib/template.js` (with `export default` before it). If you have a way to do this then please let me know :)
