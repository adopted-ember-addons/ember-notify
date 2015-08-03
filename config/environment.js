/* jshint node:true */

module.exports = function(environment) {
  return {
    'ember-devtools': {
      global: true,
      enabled: environment === 'development'
    }
  };
};
