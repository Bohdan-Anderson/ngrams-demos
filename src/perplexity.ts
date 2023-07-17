import {normalizeWords} from './singleMemWords.ts';

// perplexity of the next word
export const perplexity = (text: string, nextWords: Map<string, Map<string, number>>) => {
  const wordsArray = normalizeWords(text).split(' ');
  let totalLogProb = 0;
  for (let i = 0; i < wordsArray.length - 2; i++) {
    const word1 = wordsArray[i];
    const word2 = wordsArray[i + 1];
    const nextWord = wordsArray[i + 2];
    const nextWordMap = nextWords.get(word1 + ' ' + word2);
    if (nextWordMap === undefined) {
      console.log('could not find next word');
      break;
    }
    let percentage = nextWordMap.get(nextWord);
    if (percentage === undefined) {
      console.log('could not find percentage');
      break;
    }
    const totalCount = [...nextWordMap.values()].reduce((a, b) => a + b, 0);
    percentage = percentage / totalCount;
    const logProb = Math.log(percentage);
    totalLogProb += logProb;
  }
  const perplexity = Math.exp(-totalLogProb / (wordsArray.length - 2));
  return perplexity;
}

// for each word option in the next word map, calculate the perplexity
export const perplexityOfNextWords = (text: string, nextWords: Map<string, Map<string, number>>) => {
  const wordsArray = normalizeWords(text).split(' ');
  const nextWordMap = nextWords.get(wordsArray[wordsArray.length - 2] + ' ' + wordsArray[wordsArray.length - 1]);
  if (nextWordMap === undefined) {
    console.log('could not find next word');
    return;
  }
  const nextWordArray = [...nextWordMap.entries()];
  const perplexities = nextWordArray.map(([word, _count]) => {
    const perplexityOfWord = perplexity(text + ' ' + word, nextWords);
    // console.log(word, perplexityOfWord)
    return [word, perplexityOfWord] as [string, number];
  }).sort((a, b) => a[1] - b[1]);
  // console.log(perplexities)
  return perplexities;
}

export const getNextWords = (text: string, nextWords: Map<string, Map<string, number>>, length: number,randomness:number) => {
  // get the next set of words by getting the most likely word based on perplexity
  // if we end in space remove it
  if(text[text.length - 1] === ' '){
    text = text.slice(0, text.length - 1);
  };
  
  let outText = text;
  let match = 0;
  for(let i = 0; i < length; i++) {
    const perplexities = perplexityOfNextWords(outText, nextWords);
    if(perplexities !== undefined){
      perplexities.map(([word, perplexity]) => {
        return [word, perplexity * (Math.random() * randomness)] as [string, number];
      }).sort((a, b) => a[1] - b[1]);
      const mostLikelyWord = perplexities[0][0];
      outText += ' ' + mostLikelyWord;
      match = perplexities[0][1];
    }
  }
  return {"text":outText.replace(text, ''), match};
};
