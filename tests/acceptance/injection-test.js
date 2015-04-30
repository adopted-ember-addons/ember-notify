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

  it('is injected into routes', function(done) {
    visit('/test');
    andThen(function() {
      click('.route');
      Ember.run.next(() => {
        expect($('.ember-notify').length).to.be.ok();
        done();
      });
    });
  });

  it('is injected into controllers', function(done) {
    visit('/test');
    andThen(function() {
      click('.controller');
      Ember.run.next(() => {
        expect($('.ember-notify').length).to.be.ok();
        done();
      });
    });
  });

  it('is injected into components', function(done) {
    visit('/test');
    andThen(function() {
      click('.component');
      Ember.run.next(() => {
        expect($('.ember-notify').length).to.be.ok();
        done();
      });
    });
  });
});
