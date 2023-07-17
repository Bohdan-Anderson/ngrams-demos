import {normalizeWords} from './singleMemWords.ts';

export type NGram = string[];

interface KneserNeyModel {
  [nMinusOneGram: string]: Map<string, number>;
}

// take a string and generate it into a corpus of tri grams
export function generateCorpus(text: string): NGram[] {
  const corpus: NGram[] = [];
  const words = normalizeWords(text).split(' ');
  for (let i = 0; i < words.length - 2; i++) {
    const nGram: NGram = [words[i], words[i + 1], words[i + 2]];
    corpus.push(nGram);
  }
  return corpus;
}

export function createKneserNeyModel(corpus: NGram[]): KneserNeyModel {
  // Step 1: Collect counts of n-grams
  const nGramCounts: Map<string, Map<string, number>> = new Map();
  const totalNGrams = corpus.length;

  for (let i = 0; i < totalNGrams; i++) {
    const nGram: NGram = corpus[i];
    const nMinusOneGram: NGram = nGram.slice(0, -1);
    const lastWord: string = nGram[nGram.length - 1];

    if (!nGramCounts.has(nMinusOneGram.join(' '))) {
      nGramCounts.set(nMinusOneGram.join(' '), new Map());
    }

    const countMap = nGramCounts.get(nMinusOneGram.join(' '));
    if(countMap === undefined) break;

    countMap.set(lastWord, (countMap.get(lastWord) || 0) + 1);
  }

  // Step 2: Calculate probabilities using Kneser-Ney smoothing
  const model: KneserNeyModel = {};

  const arrayFromNGramCounts = Array.from(nGramCounts.values()).map((innerMap) => {
    return Array.from(innerMap.keys());
  });

  for (const [nMinusOneGram, countMap] of nGramCounts.entries()) {
    const totalOccurrences = Array.from(countMap.values()).reduce(
      (total, count) => total + count,
      0
    );
    const probMap: Map<string, number> = new Map();

    for (const [word, count] of countMap.entries()) {
      const continuationCount = arrayFromNGramCounts.filter(
        (innerMap) => innerMap.includes(word)
      ).length;

      const discountedCount = Math.max(count - 0.75, 0);
      const discount = 0.75 * (continuationCount / totalOccurrences);
      const continuationProb = continuationCount / totalOccurrences;

      const prob = discountedCount / totalOccurrences + discount * continuationProb;

      probMap.set(word, prob);
    }

    model[nMinusOneGram] = probMap;
  }

  return model;
}



// find the next word based on the previous two words
export function getNextWord(prev: string, model: KneserNeyModel): string {
  // remove the last character if it is a space
  if (prev[prev.length - 1] === ' ') {
    prev = prev.slice(0, prev.length - 1);
  };

  const [prevWord1, prevWord2] = normalizeWords(prev).split(' ').splice(-2);
  const probMap = model[prevWord1 + ' ' + prevWord2];
  if (probMap === undefined) {
    console.log('can not find word');
    return '';
  }
  const sortedProbMap = [...probMap.entries()].sort((a, b) => b[1] - a[1]);
  const mostLikelyWord = sortedProbMap[0][0];
  return mostLikelyWord;
}


type StringSafeKneserNeyModel = {[nMinusOneGram: string]:{[key:string]:number}}

export const KneserNeyModelToJSONString = (model: KneserNeyModel) => {
  const out:StringSafeKneserNeyModel = {};
  for (const [nMinusOneGram, countMap] of Object.entries(model)) {
    const countMapOut:{[key:string]:number} = {};
    for (const [word, count] of countMap.entries()) {
      countMapOut[word] = count;
    }
    out[nMinusOneGram] = countMapOut;
  }
  return JSON.stringify(out);
}
export const JSONStringToKneserNeyModel = (jsonString: string) => {
  const out:KneserNeyModel = {};
  const json = JSON.parse(jsonString) as StringSafeKneserNeyModel;
  for (const [nMinusOneGram, countMap] of Object.entries(json)) {
    const countMapOut:Map<string, number> = new Map();
    for (const [word, count] of Object.entries(countMap)) {
      countMapOut.set(word, count);
    }
    out[nMinusOneGram] = countMapOut;
  }
  return out;
}


