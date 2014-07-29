# ember-notify

[![Build Status](https://travis-ci.org/aexmachina/ember-notify.png)](https://travis-ci.org/aexmachina/ember-notify)

`ember-notify` displays wee little notification messages down the bottom of your Ember.js app. They're animated!

By default assumes Zurb Foundation 5 for styling, or you can use Bootstrap styling by calling `Notify.useBootstrap()`.

The CSS animations are inspired by CSS from [alertify.js](http://fabien-d.github.io/alertify.js/).

## Usage

```
import Notify from 'ember-notify';

Notify.info("Hello there!");
Notify.alert("This is an alert.");
Notify.success("It worked."):
Notify.warning("Hmmn, that didn't work out.");
```

By default the notifications close after 2.5 seconds, or you can control when they're closed.

```
var notify = Notify.alert("You can control how long it's displayed.", {
  closeAfter: 10000 // or set to null to disable auto-hiding
});
notify.send('close'); // and you can trigger close from your code
```

You can specify raw HTML:

```
Notify.info({raw: '<div class="my-div">Hooray!</div>'});
```

Rounded corners, if that's your thing.

```
Notify.alert("This one's got rounded corners.", {
  radius: true
});
```

### Containers

`Notify` is an instance of the `Notify.Container` class, and will automatically append itself to the `rootElement` (of the first `Ember.Application` to initialize) the first time you display a notification. 

If you want to control where they're inserted into the DOM then there's two options. 

1. If you're interting the element outside of the root element of your Ember app:

  ```
  var container = Notify.Container.create();
  container.appendTo($('#some-element'));
  container.alert("Yo dawg.");
  ```
1. Otherwise you'll need to use a component. Create an instance of `Notify.Container` in your controller:

  ```
  import Notify from 'ember-notify';
  export default Ember.Controller.extend({
    notify: Notify.Container.create(),
    actions: {
      clicked: function() {
        this.notify.info('Hello from the controller');
      }
    }
  });
  ```

  Pass this to the component in your template:
  
  ```
  <button {{action "clicked"}}>Click me!</button>
  {{ember-notify notify=notify}}
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
