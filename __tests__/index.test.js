"use strict";

const nock = require("nock");
const assert = require("assert");
const { pope } = require("pope");

const paths = {
  client: "../src/client"
};

const TranslationsClient = require(paths.client);
const API = TranslationsClient.API;

const TEST_URL = "http://myservice.com";
const TEST_ID = "TEST_ID";
const TEST_LANGUAGE = "English";
const TEST_REPLY = "TEST_REPLY";
const client = new TranslationsClient(TEST_URL, () => null);

describe("for TranslationsClient", () => {
  describe("for listServices()", () => {
    afterEach(nock.cleanAll);

    it("returns list of services", async () => {
      let n = nock(TEST_URL)
        .get(API.v1Services)
        .reply(200, TEST_REPLY);

      let response = await client.listServices();
      assert.equal(response, TEST_REPLY);
    });

    it("throws ENOACCESS if unauthorized", async () => {
      let n = nock(TEST_URL)
        .get(route => route.match(pope(API.v1ServicesIdLanguage, { id: TEST_ID })))
        .reply(401);

      try {
        let response = await client.getLanguageBlob(TEST_ID, "English");
      } catch (err) {
        assert.equal(err.name, "ENOACCESS");
      }
    });
  });

  describe("for describeService()", () => {
    afterEach(nock.cleanAll);

    it("returns a description of the service", async () => {
      let n = nock(TEST_URL)
        .get(pope(API.v1ServicesId, { id: TEST_ID }))
        .reply(200, TEST_REPLY);

      let response = await client.describeService(TEST_ID);
      assert.equal(response, TEST_REPLY);
    });

    it("throws ENOTFOUND if couldn't find service", async () => {
      let n = nock(TEST_URL)
        .get(pope(API.v1ServicesId, { id: TEST_ID }))
        .reply(404);

      try {
        let response = await client.describeService(TEST_ID);
      } catch (err) {
        assert.equal(err.name, "ENOTFOUND");
      }
    });
  });

  describe("for getLanguageBlob()", () => {
    afterEach(nock.cleanAll);

    it("returns the language blob", async () => {
      let n = nock(TEST_URL)
        .get(route => route.match(pope(API.v1ServicesIdLanguage, { id: TEST_ID })))
        .reply(200, TEST_REPLY);

      let response = await client.getLanguageBlob(TEST_ID, TEST_LANGUAGE);
      assert.equal(response, TEST_REPLY);
    });

    it("throws ENOTFOUND if couldn't find language", async () => {
      let n = nock(TEST_URL)
        .get(route => route.match(pope(API.v1ServicesIdLanguage, { id: TEST_ID })))
        .reply(404);

      try {
        let response = await client.getLanguageBlob(TEST_ID, "English");
      } catch (err) {
        assert.equal(err.name, "ENOTFOUND");
      }
    });

    it("throws ENOLANG if language is unrecognized", async () => {
      try {
        let response = await client.getLanguageBlob(TEST_ID, "Cimpress");
      } catch (err) {
        assert.equal(err.name, "ENOLANG");
      }
    });
  });
});
