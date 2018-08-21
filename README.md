Chrome extension to facilitate using/managing permalinks for internal docs.

## Basic Usage (Getting Permalinks)

On any page, click the extension button. (After you have setup the API key), it will create a permalink and copy that permalink to the clipboard. Use this instead of directly copying URLs for documentation links.

### Managing Permalinks

If a link changes, you can use the "Update Existing..." to enter the old and new URL. Once done, the corresponding permalink(s) will be updated so your docs links don't break.

## Contribution Guidelines

Probably obvious, but we'd only accept PRs from CentralReach employees, given this is an internal app.

1. `npm i`
2. `npm run watch` - for dev. this will keep the dist folder up to date as you work on it.
3. In Chrome, you enable dev mode in the Extensions page, then "Load Unpacked" and pick the `dist` directory on your maching.

### Deploying

TODO: Publish to Chrome store...
