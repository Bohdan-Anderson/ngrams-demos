import {generateCorpus,getNextWord, createKneserNeyModel} from './kneserNeySmoothing.ts';
import {text} from './testText.ts';


const words = generateCorpus(text);
const model = createKneserNeyModel(words);

describe('generateCorpus', () => {
  it('should create a map', () => {
    expect(words).toBeDefined();
  });
});

describe('getNextWord', () => {
  it('should create a map', () => {
    expect(getNextWord('sound travel', model)).toBe('in');
  });
});

