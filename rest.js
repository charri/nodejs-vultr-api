const request = require('request-promise-native');

class Rest {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.endpoint = 'https://api.vultr.com/';
    }

    execute(path, apiKeyRequired, method, data) {
        data = data || {};

        if(!this.apiKey && apiKeyRequired) {
            throw new Error('API Key is required for this call');
        }
    
        if (!method) {
          method = 'GET';
        }
    
        var options = {
          'baseUrl' : this.endpoint,
          'url': path,
          'method': method,
          'json': true
        };

        if(apiKeyRequired) {
          options['headers'] = {
            'API-Key': this.apiKey
          };
        }
    
        switch (method.toUpperCase()) {
          case 'GET':
          case 'DELETE':
            options.qs = data;
            break;
          case 'POST':
          case 'PUT':
            options.body = data;
            break;
        }
    
        // delay
        return request(options);
      }
}

module.exports = Rest;