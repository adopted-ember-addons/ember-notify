import Ember from 'ember';

export function messages($el) {
  return $el.find('.ember-notify');
}

export function observeSequence(obj, prop, seq) {
  var observed = [];
  var observer;
  return new Ember.RSVP.Promise(
    function(resolve, reject) {
      obj.addObserver(prop, observer = function() {
        var expected = seq[observed.length];
        var val = obj.get(prop);
        observed.push({
          value: val,
          time: new Date()
        });
        if (expected !== val) {
          reject(new Error('Expected ' + seq + ' and got ' + Ember.A(observed).mapBy('value')));
        }
        if (observed.length === seq.length) resolve(observed);
      });
    })
    .finally(() => obj.removeObserver(prop, observer));
}

export function timesSince(observed, start) {
  return Ember.A(observed).mapBy('time').map(function(date) {
    return date.getTime() - start.getTime();
  });
}
