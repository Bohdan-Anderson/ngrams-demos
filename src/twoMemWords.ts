
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


// based on the previous two words, find the most common next word

export const nextWords = (text: string) => {
  const normText = normalizeWords(text);
  const wordsArray = normText.split(' ');
  const nextWords = new Map<string, Map<string, number>>();
  for (let i = 0; i < wordsArray.length - 2; i++) {
    const word1 = wordsArray[i];
    const word2 = wordsArray[i + 1];
    const nextWord = wordsArray[i + 2];
    const nextWordMap = nextWords.get(word1 + ' ' + word2) ?? new Map<string, number>();
    const count = nextWordMap.get(nextWord) ?? 0;
    nextWordMap.set(nextWord, count + 1);
    nextWords.set(word1 + ' ' + word2, nextWordMap);
  }

  return nextWords;
};

export const getNextWords = (text: string, nextWords:Map<string,Map<string,number>>, length:number) => {
  const wordsArray = normalizeWords(text).split(' ');
  // if the last word is blank remove it
  if (wordsArray[wordsArray.length - 1] === ''){
    wordsArray.pop();
  }

  // only add the last two words to the outText array
  const outText = wordsArray.slice(wordsArray.length - 2);

  let lastWord = wordsArray[wordsArray.length - 2] + ' ' + wordsArray[wordsArray.length - 1];
  for (let i = 0; i < length; ++i){
    const nextWordMap = nextWords.get(lastWord);
    if (nextWordMap === undefined){
      console.log('could not find next word')
      break;
    }
    const sortedNextWords = [...nextWordMap.entries()].sort((a, b) => b[1] - a[1]);
    const mostFrequentNextWord = sortedNextWords[0];
    lastWord = outText[outText.length - 1] + ' ' + mostFrequentNextWord[0];
    outText.push(mostFrequentNextWord[0]);
  }

  // remove the first two words
  outText.shift();
  outText.shift();

  return outText.join(' ');
}
