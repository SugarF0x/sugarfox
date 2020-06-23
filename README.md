# nuxt-port

> A complete rewrite of by other branch (webpack-remake) using Nuxt

## Build Setup

```bash
# install dependencies
$ npm install

# open serve with hot reload at .42 machine
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```
## Enviroment variables

In order to run auth module and anything related you will need to create a .env file with following content:

```text
BASE_URL     = 'your base url'
AUTH_SECRET  = 'your secret'
VP_CLIENT_ID = 'your vk client id'
VK_SECRET    = 'your vk secret'
```

-[ ] TODO: i should probably add checks to account for missing .env variables...