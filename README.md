# Fox Lair

My personal web page where I fiddle around learning web dev

## Build Setup

```bash
# install dependencies
$ npm install

# open serve with hot reload on localhost
# or on local machine IP if one is present in .env
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate

# generate jsdoc documentation at ~/docs
$ npm run doc
```
## Environment variables

`.env.defauls` contains all the environment variables required
with _default values_ set, where `false` disables said functionality.
In order to enable said function, one is to create a new `.env`
file with required variables of appropriate value

Not all variables have to be present in `.env` - missing ones
will be set to _default value_ automatically

## Commit syntax 

* :blue_book: Documentation
* :white_check_mark: Feature
* :hammer_and_wrench: Fix
* :corn: Miscellaneous
* :recycle: Refactor
* :art: Style
* :milky_way: Release

## Documentation

`$ npm run doc` will generate all available documentation in `~/docs` folder,
as is stated in **Build Setup**. By default, the documentation side bar navigation
will display documented namespaces in their tree order, yet only display the
end path of said namespaces _(e.g. `test` instead of `my.class.test`)_. To enable
full path display, set `templates.default.useLongnameInNav` to `true` in `jsdoc.json`
configuration file located in root directory