
export const normalizeWords = (word: string) => {
  const normalizedWord = word.toLowerCase()
    .replace(/[,!.]/g, '');
  return normalizedWord;
};

export const words = (text: string) => {
  const words = normalizeWords(text).split(' ');
  // create a set of words ordered by frequency
  const wordSet = new Map<string, number>();
  for (const word of words) {
    const count = wordSet.get(word) ?? 0;
    wordSet.set(word, count + 1);
  }
  // order wordsSet by frequency
  return wordSet;
};

// find the most common next word for each word
export const nextWords = (text: string) => {
  const normText = normalizeWords(text);
  const wordsArray = normText.split(' ');
  const nextWords = new Map<string, Map<string, number>>();
  for (let i = 0; i < wordsArray.length - 1; i++) {
    const word = wordsArray[i];
    const nextWord = wordsArray[i + 1];
    const nextWordMap = nextWords.get(word) ?? new Map<string, number>();
    const count = nextWordMap.get(nextWord) ?? 0;
    nextWordMap.set(nextWord, count + 1);
    nextWords.set(word, nextWordMap);
  }

  return nextWords;
};

export const getNextWords = (text: string, nextWords:Map<string,Map<string,number>>, length:number, randomness:number) => {
  const outText = [];
  const wordsArray = normalizeWords(text).split(' ');
  let lastWord = wordsArray[wordsArray.length - 1];
  for (let i = 0; i < length; ++i){
    const nextWordMap = nextWords.get(lastWord);
    if (nextWordMap === undefined){
      break;
    }
    const wordMap = [...nextWordMap.entries()];

    // we add a bit of randomness to the word selection so we don't get in loops
    const lastWordOptions = wordMap
      .map(([word, count]) => {
        return [word, (count/ wordsArray.length) * ( Math.random() * randomness)] as [string, number];
      })
      .sort((a, b) => b[1] - a[1]);


    lastWord = lastWordOptions[0][0];
    outText.push(lastWord);
  }
  return outText.join(' ');
};