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
  it('should count bad words and categorize them', () => {
    assert.deepEqual(swearjar.words('fuck you john doe'), { fuck: ['sexual'] });

    assert.deepEqual(swearjar.words('fuck you john doe bitch fuck'), { fuck: ['sexual'], bitch: ['insult'] });
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
