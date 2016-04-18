import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

export default function startApp(attrs) {
  var application;
  var assign = Ember.assign || Ember.merge;

  var attributes = assign({}, config.APP);
  attributes = assign(attributes, attrs); // use defaults, but you can override;

  Ember.run(function() {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
