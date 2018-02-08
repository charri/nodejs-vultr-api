# nodejs-vultr-api
ES6 based library for the Vultr API generated from the online docs.

## Installation 

```
npm install vultr-api-es6
```

## Usage
```
// Import the Vultr API wrapper module
let VultrAPI = require( 'vultr-api-es6' );
 
// Create an instance with your Vultr API key
let vultr = new VultrAPI( 'apikey' /* optional */ );
 
main = async () => {
  let response = await vultr.account.info();
  console.log(response);
};

main();
```
