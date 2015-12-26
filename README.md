# chainbuilder-request [![Build Status](https://travis-ci.org/andrewpmckenzie/chainbuilder-request.svg)](https://travis-ci.org/andrewpmckenzie/chainbuilder-request)

A [request](https://github.com/request/request) mixin for [chainbuilder](https://www.npmjs.com/package/chainbuilder). 

**Installation** `npm install chainbuilder chainbuilder-request --save`

**Usage**  
```javascript
var chainBuilder = require('chainbuilder');

var myChain = chainBuilder({
  methods: {/* ... your methods ... */},
  mixins: [
    require('chainbuilder-request')()
  ]
});
```

## Methods

#### request(options)
Returns the response object.

```javascript
  myChain()
    .request('http://jsonip.com/')
    .tap(function (err, response) {
      console.log(response.statusCode); /* > 200 */
      console.log(response.body); /* > '{"ip":"123.45.67.89","about":"/about","Pro!":"http://getjsonip.com"}' */
    });

  myChain()
    .request({
      url: 'http://jsonip.com/',
      json: true
    })
    .tap(function (err, response) {
      console.log(response.statusCode); /* > 200 */
      console.log(response.body); /* > {ip: '123.45.67.89', about: '/about', 'Pro!': 'http://getjsonip.com' } */
    });
```

**`@param {string|Object|Function|undefined} options`** options for the request. A string or object param is passed directly
  to request.js. A function is executed with the chain as context (e.g. it has access to `this.previousResult()`), and the
  returned value is passed to request.js. If no parameter is passed, the `previousResult()` is passed to request.js.

#### requestBody(options)
Same as `request(options)`, except returns the response body (or errors on a non-200 response).

```javascript
  myChain()
    .requestBody('http://jsonip.com/')
    .tap(function (err, response) {
      console.log(response); /* > '{"ip":"123.45.67.89","about":"/about","Pro!":"http://getjsonip.com"}' */
    });
```

#### requestJson(options)
Same as `requestBody(options)`, except returns the body parsed as JSON.

```javascript
  myChain()
    .requestJson('http://jsonip.com/')
    .tap(function (err, response) {
      console.log(response); /* > {ip: '123.45.67.89', about: '/about', 'Pro!': 'http://getjsonip.com' } */
    });
```
