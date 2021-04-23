import RSVP from 'rsvp';

export function observeSequence(obj, prop, seq) {
  let observed = [];
  let observer;

  return new RSVP.Promise((resolve, reject) => {
    // eslint-disable-next-line ember/no-observers
    obj.addObserver(prop, observer = function() {
      let expected = seq[observed.length];
      let val = obj.get(prop);

      observed.push({
        value: val,
        time: new Date()
      });

      if (expected !== val) {
        reject(new Error(`Expected ${seq} and got ${observed.map(x => x.value)}`));
      }

      if (observed.length === seq.length) {
        resolve(observed);
      }
    });
  })
  .finally(() => obj.removeObserver(prop, observer));
}

export function timesSince(observed, start) {
  return observed
    .map(x => x.time)
    .map(x => x.getTime() - start.getTime());
}
