"use strict";

const nock = require("nock");
const assert = require("assert");
const { pope } = require("pope");

const paths = {
  client: "../src/client"
};

const CimpressTranslationsClient = require(paths.client);
const API = CimpressTranslationsClient.API;

const TEST_URL = "http://myservice.com";
const TEST_ID = "TEST_ID";
const TEST_LANGUAGE = "English";
const TEST_BLOB = { testBlobKey: "testBlobValue" };
const TEST_REPLY = "TEST_REPLY";
const TEST_STRUCTURE_PATCHES = [
  {
    op: "add",
    path: "/pages",
    value: {
      contact: {
        name: "Contact page",
        description: "The title of the contact page",
        type: "singular"
      }
    }
  },
  {
    op: "remove",
    path: "/pages/home"
  }
];
const client = new CimpressTranslationsClient(TEST_URL, () => null);

describe("for CimpressTranslationsClient", () => {
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

  describe("for putLanguageBlob()", () => {
    afterEach(nock.cleanAll);

    it("throws ENOLANG if language is unrecognized", async () => {
      try {
        let response = await client.putLanguageBlob(TEST_ID, "Cimpress", TEST_BLOB);
      } catch (err) {
        assert.equal(err.name, "ENOLANG");
      }
    });

    it("returns the successful response and validates the request body", async () => {
      let expectedRequestBody = {
        blob: TEST_BLOB,
        metadata: {
          name: "German",
          shortName: "deu",
          nativeName: "Deutsch"
        }
      };

      let n = nock(TEST_URL)
        .put(route => route.match(pope(API.v1ServicesIdLanguage, { id: TEST_ID, language: "deu" })), blob => {
          assert.deepEqual(blob, expectedRequestBody);
          return true;
        })
        .reply(200, TEST_REPLY);

      let response = await client.putLanguageBlob(TEST_ID, "deu", TEST_BLOB);
      assert.equal(response, TEST_REPLY);
    });
  });

  describe("for patchStructure()", () => {
    afterEach(nock.cleanAll);

    it("throws EBADREQUEST if the structure patch is not a valid JSON patch", async () => {
      let invalidJsonPatch = [
        {
          whatever: "whenever"
        }
      ];

      try {
        await client.patchStructure(TEST_ID, invalidJsonPatch);
      } catch (error) {
        assert.equal(error.name, "EBADREQUEST");
      }
    });

    it("returns the successful response", async () => {
      let n = nock(TEST_URL)
        .patch(route => route.match(pope(API.v1ServicesIdStructure, {id: TEST_ID})), body => {
          assert.deepEqual(body, TEST_STRUCTURE_PATCHES);
          return true;
        })
        .reply(200, TEST_REPLY);

      let response = await client.patchStructure(TEST_ID, TEST_STRUCTURE_PATCHES);
      assert.equal(response, TEST_REPLY);
    });
  });

  describe("for removeKeysFromStruture()", () => {
    afterEach(nock.cleanAll);

    it("returns the successful response and validates that only remove patch operations were included", async () => {
      let remoteBlob = {
        data: {
          topLevelKey: "topLevelValue",
          topLevelObject: {
            secondLevelKey: "secondLevelValue"
          }
        },
        blobId: "eng"
      };

      let localBlob = {
        data: {
          anotherTopLevelKey: "anotherTopLevelValue",
          topLevelObject: {
            anotherSecondLevelKey: "anotherSecondLevelValue"
          }
        },
        blobId: "eng"
      };

      let expectedStructurePatches = [
        {
          op: "remove",
          path: "/topLevelObject/secondLevelKey"
        },
        {
          op: "remove",
          path: "/topLevelKey"
        }
      ];

      let getBlobMock = nock(TEST_URL)
        .get(route => route.match(pope(API.v1ServicesIdLanguage, { id: TEST_ID })))
        .reply(200, remoteBlob);

      let patchStructureMock = nock(TEST_URL)
        .patch(route => route.match(pope(API.v1ServicesIdStructure, {id: TEST_ID})), body => {
          assert.deepEqual(body, expectedStructurePatches);
          return true;
        })
        .reply(200, TEST_REPLY);

      let response = await client.removeKeysFromStructure(TEST_ID, localBlob);
      assert.equal(response, TEST_REPLY);
    });
  });
});
