import './style.css'

import * as singleMemWords from './singleMemWords.ts'
import * as twoMem from './twoMemWords.ts'
// import * as perplextiy from './perplexity.ts'
import * as kneserNeySmoothing from './kneserNeySmoothing.ts'


const setup = async () => {

  const localText = localStorage.getItem('text');

  const text = localText
    ? localText 
    : await fetch('./text-raw.json').then(res => res.json()).then(data => {
      // save the data text to localstorage
      localStorage.setItem('text', data.data as string);
      return data.data as string;
    });

  const textAreaOne = document.getElementById('one-word') as HTMLTextAreaElement;
  const textAreaTwo = document.getElementById('two-word') as HTMLTextAreaElement;
  const textAreaThree = document.getElementById('three') as HTMLTextAreaElement;

  const textAreaOneOutput = document.getElementById('one-word-text') as HTMLDivElement;
  const textAreaTwoOutput = document.getElementById('two-word-text') as HTMLDivElement;
  const textAreaThreeOutput = document.getElementById('three-text') as HTMLDivElement;


  if(!textAreaOne || !textAreaTwo || !textAreaThree || !textAreaOneOutput || !textAreaTwoOutput || !textAreaThreeOutput){
    throw new Error('could not find text areas');
  }

  textAreaOne.value = 'good';
  textAreaTwo.value = 'good morning';
  textAreaThree.value = 'good morning';


  // Single Memory
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

  // Two Memory
  const words = twoMem.nextWords(text);
  const textAreaTwoChange = () => {
    const value = textAreaTwo.value;
    const nextWords = twoMem.getNextWords(value, words, 30, 0.1);
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


  
  const kneserModel = localStorage.getItem('kneserModel');

  const model = kneserModel? 
    kneserNeySmoothing.JSONStringToKneserNeyModel(kneserModel): 
    await fetch('./kneserModel.json').then(async res => {
      // save the string to a localstorage
      const text = (await res.text());
      localStorage.setItem('kneserModel', text);
      return kneserNeySmoothing.JSONStringToKneserNeyModel(text);
    })
  
  // const corpus = kneserNeySmoothing.generateCorpus(text);
  // const model = kneserNeySmoothing.createKneserNeyModel(corpus);
  // console.log(kneserNeySmoothing.KneserNeyModelToJSONString(model));

  const textAreaThreeChange = () => {
    let value = textAreaThree.value;
    // if the last value is space, remove it
    if(value[value.length - 1] === ' '){
      value = value.slice(0, value.length - 1);
    }
    let nextWord = kneserNeySmoothing.getNextWord(value, model);
    for(let i = 0; i < 5; i++){
      nextWord += " " + kneserNeySmoothing.getNextWord(value + ' ' + nextWord, model);
    }
      
    textAreaThreeOutput.innerHTML = `<span>${value}</span> ${nextWord}`;
  }
  const autoCompleteFillThree = () => {
    textAreaThree.value = textAreaThreeOutput.innerText;
  }
  textAreaThree.addEventListener('keyup', textAreaThreeChange);
  textAreaThree.addEventListener('doubleclick', autoCompleteFillThree);
  textAreaThree.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      autoCompleteFillThree();
      event.preventDefault();
    }
  });
  textAreaThreeChange();

};

setup();




// console.log(singleMemWords.getNextWords('people',wordMaps,30));

