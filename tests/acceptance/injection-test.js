/* jshint expr:true */
import Ember from 'ember';
import startApp from '../helpers/start-app';
import Notify from 'ember-notify';

var App;

describe('Acceptance: Test', function() {
  beforeEach(function() {
    Notify.testing = false;
    App = startApp();
  });

  afterEach(function() {
    Ember.run(App, 'destroy');
  });

  it('is injected', function(done) {
    visit('/test');
    andThen(function() {
      find('.route').click();
      find('.controller').click();
      Ember.run.next(() => Ember.run.next(() => {
        expect($('.ember-notify').length).to.be.ok();
        done();
      }));
    });
  });
});
