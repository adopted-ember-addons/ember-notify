# ember-notify

Displays little notification messages down the bottom of your Ember.js app. They're animated, it's awesome!

Currently uses Zurb Foundation 5 for styling, but it's designed to have support for Bootstrap or custom styling at some point in the future. It does what I need right now, just create an Issue if you want to use it for anything.

The CSS animations are based on the CSS in [alertify.js](http://fabien-d.github.io/alertify.js/).

## Usage

`Ember.Notify` is an instance of the `Ember.Notify.Container` class, and will automatically append itself to the `document.body` the first time you display a notification.

```javascript
Notify = Ember.Notify;
Notify.alert("This is some info.");
Notify.success("That worked!"):
Notify.warning("Hmmn, that didn't work out.");
Notify.alert("This one's got rounded corners.", {
  radius: true
});
```

## Containers

You can create your own containers and control where they're inserted into the DOM like so:

```javascript
Notify = Ember.Notify;
var container = Notify.Container.create();
container.appendTo($('#some-element'));
container.alert("Yo dawg.");
```
