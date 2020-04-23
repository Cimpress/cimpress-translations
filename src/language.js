"use strict";

const { iso_639_1, iso_639_2 } = require("iso-639");

const getLanguageCodeFromEnglishName = language => {
  let foundLanguage = Object.values(iso_639_2).find(entry => entry.en
    .map(name => name.toLowerCase())
    .includes(language.toLowerCase()));
  return (foundLanguage || {})["639-2"];
};

const findLanguageCode = language => {
  let languageByThreeLetterCode = (iso_639_2[language] || {})["639-2"];
  let languageByTwoLetterCode = (iso_639_1[language] || {})["639-2"];
  return languageByThreeLetterCode || languageByTwoLetterCode || getLanguageCodeFromEnglishName(language) || null;
};

const findLanguage = language => {
  let languageCode = findLanguageCode(language);
  return languageCode && iso_639_2[languageCode];
};

module.exports = { findLanguage, findLanguageCode };
