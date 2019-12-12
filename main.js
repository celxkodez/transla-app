//initialize speech recognition API
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
// var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const recognition = new SpeechRecognition();
recognition.interimResults = true; //return results while still working on current recognition

//for the output
let speechText = document.querySelector('#speechText');
let out = '';
let textFin = '';

//once speech recognition determines it has a "result", grab the texts of that result, join all of them, and add to paragraph
recognition.addEventListener("result", e => {
  const transcript = Array.from(e.results)
  .map(result => result[0])
  .map(result => result.transcript)
  .join("")
  out = transcript

  
 
  if (e.results[0].isFinal) {
   textFin =  out;
  }
});

function startRecording() {
  recognition.start();
  recognition.addEventListener("end", recognition.start);
  speechText.value = speechText.value + textFin;

  document.getElementById("stop").addEventListener("click", stopRecording)

}

function stopRecording() {
  console.log("okay I'll stop");  
  recognition.removeEventListener("end", recognition.start);
  recognition.stop();
}



// FOR THE TEXT TO SPEECH SYN

let textArea = document.querySelector('#textArea');
let seletedVoice = document.querySelector('#selectVoice');
let rate = document.querySelector('#rate');
let pitch = document.querySelector('#pitch');


const syn = window.speechSynthesis;
let voices = [];
const getVoices = () => {
  voices = syn.getVoices();
  // console.log(voices)

  voices.forEach(voice => {

    const option = document.createElement('option');

    option.textContent = voice.name + '(' + voice.lang +')';

    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    seletedVoice.appendChild(option);
  });
};

getVoices();
if (syn.onvoiceschanged !== undefined ){
  syn.onvoiceschanged = getVoices;
}

const speak = () => {
  console.log(textArea.value);
  if(syn.speaking){
    console.error('already speaking..');
    return;
  }

  if (textArea.value !== ' '){
    var speakText = new SpeechSynthesisUtterance(textArea.value);
    speakText.onend = e => {
      console.log('done speaking');
    }

    speakText.onerror = e =>{
      console.error('something went wrong..');
    }


    const postselectetedvoice = seletedVoice.selectedOptions[0].getAttribute('data-name');

      voices.forEach(voice => {
        if(voice.name === postselectetedvoice){
          speakText.voice = voice;
        }
      });
      speakText.rate = rate.value;
      speakText.pitch = pitch.value;
      syn.speak(speakText);
  }
}


// DOM ID SELECTORS
//speech to text.
//text area ==== #textArea
//rate ==== #rate
//rate dom value ==== .rate
//pitch ==== #pitch
//pitch dom value ==== .pitch
//speak button ==== #speak

            // EVENT LISTENERS
document.querySelector('.rate').innerHTML = rate.value;
rate.addEventListener('change', e => {
  document.querySelector('.rate').innerHTML = rate.value;
  speak();
});
document.querySelector('.pitch').innerHTML = pitch.value;
pitch.addEventListener('change', e => {
  document.querySelector('.pitch').innerHTML = pitch.value;
  speak();
});

document.querySelector('#speak').addEventListener('click', e => {
e.preventDefault();
speak();
});


//DOM MANIPULATIONS 

let textToSpeech = document.querySelector('#textToSpeech');
let speechToText = document.querySelector('#speechToText');
let note = document.querySelector('#note');

let buttons = document.querySelectorAll('.btnLink');

buttons[0].addEventListener('click', e => {
  speechToText.classList.remove('off');
  textToSpeech.classList.add('off');
  note.classList.add('off');

});

buttons[1].addEventListener('click', e => {
  textToSpeech.classList.remove('off');
  speechToText.classList.add('off');
  note.classList.add('off');
  });

  buttons[2].addEventListener('click', e => {
    textToSpeech.classList.add('off');
    speechToText.classList.add('off');
    note.classList.remove('off');
    })


    // FOR THE NOTE SECTIONS

    document.querySelector('#open-note').addEventListener('click', e => {

      document.querySelector('#notelist').classList.add('note-display');
    } );

    document.querySelector('.note-close').addEventListener('click', e => {
      document.querySelector('#notelist').classList.remove('note-display');
    });

    function saveNote(){
      let title = document.createElement('h4');
      let bodyOfNote = document.createElement('p');

      let noteWrapper = document.createElement('div');
      noteWrapper.id = 'notewrapper';

      title.innerHTML = document.querySelector('#notetitle').value;
      bodyOfNote.innerHTML = document.querySelector('#noteText').value;

      noteWrapper.appendChild(title);
      noteWrapper.appendChild(bodyOfNote);

      document.querySelector('#note-listings').appendChild(noteWrapper);

    }

    document.querySelector('#savenote').addEventListener('click', saveNote )
