const assert = require('assert');
const swearjar = require('../lib/swearjar.js');

describe('swearjar.profane', () => {
  it('should should detect bad words', () => {
    assert.equal(swearjar.profane('i love you john doe'), false);
    assert.equal(swearjar.profane('fuck you john doe'), true);
  });

  it('should detect uppercase bad words', () => {
    assert.equal(swearjar.profane('FUCK you john doe'), true);
  });

  it('should detect mixedcase bad words', () => {
    assert.equal(swearjar.profane('FuCk you john doe'), true);
  });
});

describe('swearjar.censor', () => {
  it('should remove bad words', () => {
    assert.equal(swearjar.censor('fuck you john doe bitch'), '**** you john doe *****');
  });

  it('should handle edgecases', () => {
    assert.equal(swearjar.censor("Assasin's Creed Ass"), "Assasin's Creed ***");
    assert.equal(swearjar.censor("Assasin's Creed\nAss"), "Assasin's Creed\n***");
  });
});

describe('swearjar.scorecard', () => {
  it('should count bad words and categorize them', () => {
    assert.deepEqual(swearjar.scorecard('fuck you john doe'), {
      sexual: 1,
    });

    assert.deepEqual(swearjar.scorecard('fuck you john doe bitch fuck'), {
      sexual: 2,
      insult: 1,
    });
  });
});

describe('swearjar.words', () => {
  it('should return bad words and their categories', () => {
    assert.deepEqual(swearjar.words('fuck you john doe'), { fuck: ['sexual'] });

    assert.deepEqual(swearjar.words('fuck you john doe bitch fuck'), { fuck: ['sexual'], bitch: ['insult'] });
  });
});

describe('swearjar.detailedProfane', () => {
  it('should count bad words and categorize them and censor the text', () => {
    assert.deepEqual(swearjar.detailedProfane('fuck you john doe'), {
      categoryCount: {
        sexual: 1,
      },
      censored: 'f****you john doe',
      profane: true,
      wordCount: {
        fuck: 1,
      },
      words: {
        fuck: [
          'sexual',
        ],
      },
    });

    assert.deepEqual(swearjar.detailedProfane('fuck you john doe bitch fuck'), {
      categoryCount: {
        insult: 1,
        sexual: 1,
      },
      censored: 'f****you john doe b*****fuck',
      profane: true,
      wordCount: {
        bitch: 1,
        fuck: 1,
      },
      words: {
        bitch: [
          'insult',
        ],
        fuck: [
          'sexual',
        ],
      },
    });
  });
});

describe('should handle object properties', () => {
  it('should not return "should" as profane', () => {
    Object.defineProperty(Object.prototype, 'should', {
      set() {
      },
      get() {
        return this;
      },
      configurable: true,
    });

    assert.equal(swearjar.profane('this should not be profane'), false);
  });
});
