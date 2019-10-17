// swearjar-node
const path = require('path');

const swearjar = {

  _badWords: {},

  scan(text, callback) {
    let word;
    let key;
    let match;
    let
      notMatchedText = '';
    let regex = /\w+/g;

    while (match = regex.exec(text)) {
      word = match[0];
      key = word.toLowerCase();

      if (key in this._badWords.simple && Array.isArray(this._badWords.simple[key])) {
        if (callback(word, match.index, this._badWords.simple[key], key, 'simple') === false) {
          break;
        }
      } else if (key in this._badWords.emoji && Array.isArray(this._badWords.emoji[key])) {
        if (callback(word, match.index, this._badWords.emoji[key], key, 'emoji') === false) {
          break;
        }
      } else {
        notMatchedText += ` ${key}`;
      }
    }

    for (const regexString in this._badWords.regex) {
      regex = new RegExp(regexString);
      match = regex.exec(notMatchedText);
      while (match && match.length) {
        word = match.pop(0);

        if (word) {
          if (callback(word, match.index, this._badWords.regex[regexString], regexString, 'regex') === false) {
            break;
          }
        }
      }
    }
  },

  profane(text) {
    let profane = false;

    this.scan(text, (word, index, categories) => {
      profane = true;
      return false; // Stop on first match
    });

    return profane;
  },

  scorecard(text) {
    const scorecard = {};

    this.scan(text, (word, index, categories) => {
      for (let i = 0; i < categories.length; i += 1) {
        const cat = categories[i];

        if (cat in scorecard) {
          scorecard[cat] += 1;
        } else {
          scorecard[cat] = 1;
        }
      }
    });

    return scorecard;
  },

  words(text) {
    const words = {};

    this.scan(text, (word, index, categories) => {
      words[word] = categories;
    });

    return words;
  },

  censor(text) {
    let censored = text;

    this.scan(text, (word, index, categories) => {
      censored = censored.substr(0, index)
                + word.replace(/\S/g, '*')
                + censored.substr(index + word.length);
    });

    return censored;
  },

  loadBadWords(relativePath) {
    const basePath = path.dirname(module.parent.filename);
    const fullPath = path.join(basePath, relativePath);
    this._badWords = require(fullPath);
  },

  setBadWords(badWords) {
    this._badWords = badWords || {};
  },
};

swearjar._badWords = require('./config/en_US.json');

module.exports = swearjar;
