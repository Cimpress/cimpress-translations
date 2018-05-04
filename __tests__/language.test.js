"use strict";

const assert = require("assert");

const paths = {
  language: "../src/language"
};

const language = require(paths.language);

describe("for language utility module", () => {
  describe("for findLanguageCode()", () => {
    it("returns ISO 639-2 code of language given ISO 639-2 code", () => {
      let testLanguages = {
        "eng": "eng",
        "fra": "fra",
        "deu": "deu",
        "nld": "nld",
        "slk": "slk",
        "tur": "tur"
      };

      Object.entries(testLanguages).map(l => {
        assert.equal(language.findLanguageCode(l[0]), l[1]);
      });
    });

    it("returns ISO 639-2 code of language given English name of language", () => {
      let testLanguages = {
        "English": "eng",
        "French": "fra",
        "German": "deu",
        "Dutch": "nld",
        "Slovak": "slk",
        "Turkish": "tur"
      };

      Object.entries(testLanguages).map(l => {
        assert.equal(language.findLanguageCode(l[0]), l[1]);
      });
    });

    it("returns null if the language isn't found", () => {
      let testLanguages = {
        "Englisch": null,
        "Cimpress": null
      };

      Object.entries(testLanguages).map(l => {
        assert.equal(language.findLanguageCode(l[0]), l[1]);
      });
    });
  });
});
