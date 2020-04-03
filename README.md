# child-care

To run locally:

```
npm run app
```

To build for production:

```
npm run build:prod
```

To configure the app base path, a.k.a [webpack `publicPath`](https://webpack.js.org/configuration/output/#output-publicpath):

```
npm run app -- --env.basePath=foo
npm run build:prod -- --env.basePath=foo
```
