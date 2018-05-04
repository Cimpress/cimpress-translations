"use strict";

const { iso_639_2 } = require("iso-639");

const getLanguageCodeFromEnglishName = language => {
  let foundLanguage = Object.values(iso_639_2).find(entry => entry.en
    .map(name => name.toLowerCase())
    .includes(language.toLowerCase()));
  return (foundLanguage || {})["639-2"];
};

const findLanguageCode = language => {
  let languageByCode = (iso_639_2[language] || {})["639-2"];
  return languageByCode || getLanguageCodeFromEnglishName(language) || null;
};

module.exports = { findLanguageCode };
