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
```
## Environment variables

In order to run auth module and anything related you will need to create a .env file with following content:

```text
LOCAL_MACHINE = 'your local machine ip' || 'localhost'
BASE_URL      = 'your base url'         || 'localhost'
AUTH_SECRET   = 'your secret'           || 'false'
VP_CLIENT_ID  = 'your vk client id'     || 'false'
VK_SECRET     = 'your vk secret'        || 'false'
MONGO_DB      = 'your DB url'           || 'false'
```

## Commit syntax 

* :blue_book: Documentation
* :white_check_mark: Feature
* :hammer_and_wrench: Fix
* :corn: Miscellaneous
* :recycle: Refactor
* :art: Style