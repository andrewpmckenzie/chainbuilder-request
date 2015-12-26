var request = require('request');

module.exports = function (options) {

  var requestWrapper = function (methodOptions) {
    return function (options, done) {
      if (!done) {
        // If no arguments are provided, use the previous result
        done = options;
        options = this.previousResult();
      } else if (typeof options === 'function') {
        // If a function is provided as options, call it in the current context and
        // use the result (they're likely wanting to manipulate the previous result).
        options = options.call(this);
      }

      request(options, function (err, response, body) {
        var result;
        if (!methodOptions.returnType) {
          result = response;
        } else if (response.statusCode < 200 || response.statusCode >= 300 ) {
          return done(new Error('Received ' + response.statusCode + ' response: ' + response.body));
        } else if (methodOptions.returnType === 'string') {
          result = body;
        } else if (methodOptions.returnType === 'json') {
          try {
            result = JSON.parse(body);
          } catch (e) {
            return done(new Error('Could not parse JSON from body: ' + body));
          }
        }
        done(err, result);
      });
    }
  };

  return {
    request: requestWrapper({ returnType: null }),
    requestBody: requestWrapper({ returnType: 'string' }),
    requestJson: requestWrapper({ returnType: 'json' })
  };
};
