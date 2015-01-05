# Changelog

## v3.0

v3.0 uses a component + helper architecture that removes several hacks in previous versions.
 
### BREAKING CHANGES

- ember-cli is now required for v3.0. Projects that don't use ember-cli will need to stay on the v2.0 branch
- You now need to add `{{ember-notify}}` to one of your templates, usually in `application.hbs`
- Bootstrap styling is now selected using the `messageStyle` property on the component: `{{ember-notify messageStyle='bootstrap'}}`
- If you're using `message.send('close')`, this will need to be changed to `message.set('visible', false)` 
