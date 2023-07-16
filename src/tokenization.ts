// Byte Pair Encoding

export const createVocab = (text: string) => {
  const vocab = new Set<string>();
  for (const char of text) {
    vocab.add(char);
  }
  return vocab;
};

export const createBigram = (text:string,vocab: Set<string>) => {
  const bigram = new Map<string, number>();
  for (let i = 0; i < text.length - 1; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (vocab.has(char) && vocab.has(nextChar)) {
      const key = char + nextChar;
      const count = bigram.get(key) ?? 0;
      bigram.set(key, count + 1);
    }
  }
  return bigram;
};

export const BPE = (text: string, vocabSize: number) => {
  const vocab = createVocab(text);
  let bigram = createBigram(text, vocab);
  for (let i = 0; i < vocabSize; i++) {
    const sortedBigram = [...bigram.entries()].sort((a, b) => b[1] - a[1]);
    const mostFrequentBigram = sortedBigram[0];
    const [char1, char2] = mostFrequentBigram[0];
    const newChar = char1 + char2;
    vocab.add(newChar);
    bigram = createBigram(text, vocab);
  }
  return vocab;
}

