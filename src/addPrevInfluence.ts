
// N-gram model creation

export const normalizeWords = (word: string) => {
  const normalizedWord = word.toLowerCase()
    .replace(/[,!.]/g, '');
  return normalizedWord;
};

// for each word, find the most common previous word
// based on the previous word, percentages for each next word
export const prevWords = (text: string) => {
  const normText = normalizeWords(text);
  const wordsArray = normText.split(' ');
  const prevWords = new Map<string, Map<string, number>>();
  for (let i = 1; i < wordsArray.length; i++) {
    const word = wordsArray[i];
    const prevWord = wordsArray[i - 1];
    const prevWordMap = prevWords.get(word) ?? new Map<string, number>();
    const count = prevWordMap.get(prevWord) ?? 0;
    prevWordMap.set(prevWord, count + 1);
    prevWords.set(word, prevWordMap);
  }

  // normalize the counts to percentages and log them
  for (const [word, prevWordMap] of prevWords.entries()) {
    let totalCount = 0;
    for (const [prevWord, count] of prevWordMap.entries()) {
      totalCount += count;
    }
    for (const [prevWord, count] of prevWordMap.entries()) {
      prevWordMap.set(prevWord, count / totalCount);
    }
    prevWords.set(word, prevWordMap);
  }

  return prevWords;
}


const getPrevWordPercentage = (prevWord:string, word: string, prevWords: Map<string, Map<string, number>>) => {
  const prevWordMap = prevWords.get(prevWord);
  if (prevWordMap === undefined) {
    return 0;
  }
  const percentage = prevWordMap.get(word);
  if (percentage === undefined) {
    return 0;
  }
  return percentage;
};

// take in a Map<string, Map<string, number>> and an array of 



export const getNextWords = (text: string, prevWords: Map<string, Map<string, number>>, length: number) => {
  const outText = [];
  const wordsArray = normalizeWords(text).split(' ');

  for (let i = 0; i < length; ++i) {
    let lastWord = wordsArray[wordsArray.length - 1];
    const prevWordMap = prevWords.get(lastWord);
    if (prevWordMap === undefined) {
      break;
    }


  }

  return outText.join(' ');
}
  




