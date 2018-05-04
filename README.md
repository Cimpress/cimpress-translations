# cimpress-translations

cimpress-translations is a convenient client for Cimpress' Translations service.

Features:
- list and describe services; get language blobs for a language
- pick language using ISO-639-2 ('eng', 'fra') or by passing the language's English name ('English', 'French')
- supply authorization statically (using a hard-coded string) or dynamically (with a custom method)
- convenience of a default service URL with the possibility of an override

## Getting Started

Include [cimpress-translations](https://www.npmjs.com/package/cimpress-translations) in your project using npm or yarn:
```
npm install --save cimpress-translations
```

Require the module with:
```
const TranslationsClient = require("cimpress-translations");
```

## Consuming the API

##### new TranslationsClient(url, auth)
Instantiates a new client. **auth** may be a string or a synchronous/asynchronous function returning a string.

##### client.listServices()
Lists all services for which you can access translations.
```javascript
let services = await client.listServices();
console.log(services);
/**
 * {
 *   "services": [
 *     {
 *       "serviceId": "28b1f0d2-9366-40cb-95bd-14de8c3adb9b"
 *       "name": ...
 *
```

##### client.describeService(serviceId)
Returns details about a service.
```javascript
let services = await client.describeService("28b1f0d2-9366-40cb-95bd-14de8c3adb9b");
console.log(service);
/**
 * {
 *   "serviceId": "28b1f0d2-9366-40cb-95bd-14de8c3adb9b"
 *   "name": "My Cimpress Service",
 *   "configuration": ...
 *
```

##### client.getLanguageBlob(serviceId, language)
Retrieves the translation for a service in a given language. The language may be specified using ISO-639-2 ('eng', 'fra') or selected using its English name ('English', 'French').
```javascript
let services = await client.getLanguageBlob("28b1f0d2-9366-40cb-95bd-14de8c3adb9b", "French");
console.log(service);
/**
 * {
 *   "blobId": "8a27db52-3245-4466-be94-5e9f39283a3b",
 *   "data": ...
 *
```

## Error handling

Identify errors by checking their **name** property.

##### EGENERIC
An unspecified error has occured.

##### ENOACCESS
You are not authenticated or authorized to read this information.

##### ENOTFOUND
The service was not found of does not support this language.

##### ENOLANG
The requested language was not found amongst languages specified in ISO-639-2.

## Built With

* [pope](https://github.com/poppinss/pope) - String templating engine
* [request-promise-native](https://github.com/request/request-promise-native) - HTTP request client
* [https-status-codes](https://github.com/prettymuchbryce/node-http-status) - HTTP status codes
* [jest](https://github.com/facebook/jest) - Node.js code testing framework
* [iso-639](https://github.com/haliaeetus/iso-639) - ISO 630 language codes in a Node.js module

## Contributing

Have you benefited from this library? Have you found or fixed a bug? Would you like to see a new feature implemented? We are eager to collaborate with you on GitHub.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Igor Sowinski** <[isowinski@cimpress.com](mailto:isowinski@cimpress.com), [igor@sowinski.blue](mailto:igor@sowinski.blue)> - [GitHub](https://github.com/Igrom)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the Apache 2.0 license - see the [LICENSE.md](LICENSE.md) file for details.
