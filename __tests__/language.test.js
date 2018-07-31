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

  describe("for findLanguage()", () => {
    it("returns language object of given ISO 639-2 code", () => {
      let testLanguages = {
        "eng": {
          "639-1": "en",
          "639-2": "eng",
          "de": [
            "Englisch"
          ],
          "en": [
            "English"
          ],
          "fr": [
            "anglais"
          ],
          "wikiUrl": "https://en.wikipedia.org/wiki/English_language"
        },
        "deu": {
          "639-1": "de",
          "639-2": "deu",
          "639-2/B": "ger",
          "de": [
            "Deutsch"
          ],
          "en": [
            "German"
          ],
          "fr": [
            "allemand"
          ],
          "wikiUrl": "https://en.wikipedia.org/wiki/German_language"
        }
      };

      Object.entries(testLanguages).map(l => {
        assert.deepEqual(language.findLanguage(l[0]), l[1]);
      });
    });

    it("returns language object of given English name of language", () => {
      let testLanguages = {
        "English": {
          "639-1": "en",
          "639-2": "eng",
          "de": [
            "Englisch"
          ],
          "en": [
            "English"
          ],
          "fr": [
            "anglais"
          ],
          "wikiUrl": "https://en.wikipedia.org/wiki/English_language"
        },
        "German": {
          "639-1": "de",
          "639-2": "deu",
          "639-2/B": "ger",
          "de": [
            "Deutsch"
          ],
          "en": [
            "German"
          ],
          "fr": [
            "allemand"
          ],
          "wikiUrl": "https://en.wikipedia.org/wiki/German_language"
        }
      };

      Object.entries(testLanguages).map(l => {
        assert.deepEqual(language.findLanguage(l[0]), l[1]);
      });
    });

    it("returns null if the language isn't found", () => {
      let testLanguages = {
        "Englisch": null,
        "Cimpress": null
      };

      Object.entries(testLanguages).map(l => {
        assert.deepEqual(language.findLanguage(l[0]), l[1]);
      });
    });
  });
});
