import './style.css'

import * as singleMemWords from './singleMemWords.ts'
import * as twoMem from './twoMemWords.ts'


const setup = async () => {

  const text = await fetch('./text-raw-full.json').then(res => res.json()).then(data => {
    return data.data as string;
  })

  const textAreaOne = document.getElementById('one-word') as HTMLTextAreaElement;
  const textAreaTwo = document.getElementById('two-word') as HTMLTextAreaElement;

  const textAreaOneOutput = document.getElementById('one-word-text') as HTMLTextAreaElement;
  const textAreaTwoOutput = document.getElementById('two-word-text') as HTMLTextAreaElement;

  if(!textAreaOne || !textAreaTwo){
    throw new Error('could not find text areas');
  }

  console.log(textAreaOne);
  textAreaOne.value = 'good';
  textAreaTwo.value = 'good morning';


  const wordMaps = singleMemWords.nextWords(text);
  const textAreaOneChange = () => {
    const value = textAreaOne.value;
    const nextWords = singleMemWords.getNextWords(value, wordMaps, 30, 0.1);
    textAreaOneOutput.innerHTML = `<span>${value}</span> ${nextWords}`;
  };
  const autoCompleteFillOne = () => {
    textAreaOne.value = textAreaOneOutput.innerText;
  }

  textAreaOne.addEventListener('keyup', textAreaOneChange);
  textAreaOne.addEventListener('doubleclick', autoCompleteFillOne);
  textAreaOne.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      autoCompleteFillOne();
      event.preventDefault();
    }
  });

  textAreaOneChange();

  const words = twoMem.nextWords(text);
  const textAreaTwoChange = () => {
    const value = textAreaTwo.value;
    const nextWords = twoMem.getNextWords(value, words, 30);
    textAreaTwoOutput.innerHTML = `<span>${value}</span> ${nextWords}`;
  };
  const autoCompleteFillTwo = () => {
    textAreaTwo.value = textAreaTwoOutput.innerText;
  }

  textAreaTwo.addEventListener('keyup', textAreaTwoChange);
  textAreaTwo.addEventListener('doubleclick', autoCompleteFillTwo);
  textAreaTwo.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      autoCompleteFillTwo();
      event.preventDefault();
    }
  });
  textAreaTwoChange();

};

setup();




// console.log(singleMemWords.getNextWords('people',wordMaps,30));

