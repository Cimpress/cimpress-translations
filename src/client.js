"use strict";

const rp = require("request-promise-native");
const { pope } = require("pope");
const httpStatus = require("http-status-codes");

const { buildError } = require("./errors");
const { findLanguageCode } = require("./language");

const API = {
  url: "https://api.translations.cimpress.io",
  v1Services: "/v1/services",
  v1ServicesId: "/v1/services/{{id}}",
  v1ServicesIdLanguage: "/v1/services/{{id}}/blobs/{{language}}",
};

const requestCatch = err => {
  if (err && err.statusCode === httpStatus.NOT_FOUND) {
    throw buildError("ENOTFOUND");
  }

  if (err && [httpStatus.UNAUTHORIZED, httpStatus.FORBIDDEN].includes(err.statusCode)) {
    throw buildError("ENOACCESS");
  }

  throw buildError("EGENERIC");
};

class CimpressTranslationsClient {
  constructor(url, auth) {
    this.url = url || API.url;
    this.auth = auth;
  }

  buildUrl(path, dict) {
    return pope(this.url + path, dict);
  }

  async addAuth(options) {
    let auth = await this.getAuth();
    if (auth) {
      auth = auth.startsWith('Bearer ') ? auth : 'Bearer ' + auth;
      options.headers = Object.assign(options.headers || {}, {
        Authorization: auth
      });
    }
  }

  getAuth() {
    if (typeof this.auth === "function") {
      return this.auth();
    }
    return this.auth;
  }

  async listServices() {
    let options = {
      url: this.buildUrl(API.v1Services),
      json: true
    };

    await this.addAuth(options);
    return rp(options)
      .catch(requestCatch);
  }

  async describeService(serviceId) {
    let options = {
      url: this.buildUrl(API.v1ServicesId, { id: serviceId }),
      json: true
    };

    await this.addAuth(options);
    return rp(options)
      .catch(requestCatch);
  }

  async getLanguageBlob(serviceId, language) {
    let languageCode = findLanguageCode(language);
    if (!languageCode) {
      throw buildError("ENOLANG");
    }

    let options = {
      url: this.buildUrl(API.v1ServicesIdLanguage, { id: serviceId, language: languageCode }),
      json: true
    };

    await this.addAuth(options);
    return rp(options)
      .catch(requestCatch);
  }
}

CimpressTranslationsClient.API = API;

module.exports = CimpressTranslationsClient;
