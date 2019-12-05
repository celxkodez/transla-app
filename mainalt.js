//initialize speech recognition API
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
// var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const recognition = new SpeechRecognition(); //initialize my instance of speech recognition
recognition.interimResults = true; //return results while still working on current recognition

//this is where your speech-to-text results will appear
let p = document.createElement("p")
const words = document.querySelector(".words-container")
// words.appendChild(p)
let speechText = document.querySelector('#speechText');
let out = '';

//I want to select and change the color of the body, but this could be any HTML element on your page
// let body = document.querySelector("body")

// let cap_css_colors = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
// const CSS_COLORS = cap_css_colors.map(color => {
//   //I need to change all color names to lower case, because comparison between words will be case sensitive
//   return color.toLowerCase()
// })

//once speech recognition determines it has a "result", grab the texts of that result, join all of them, and add to paragraph
recognition.addEventListener("result", e => {
  const transcript = Array.from(e.results)
  .map(result => result[0])
  .map(result => result.transcript)
  .join("")
  out = transcript

  //once speech recognition determines it has a final result, create a new paragraph and append it to the words-container
  //this way every time you add a new p to hold your speech-to-text every time you're finished with the previous results
  if (e.results[0].isFinal) {
   speechText.value = out;
  }
  //for each result, map through all color names and check if current result (transcript) contains that color
  //i.e. see if a person said any color name you know
  // CSS_COLORS.forEach(color => {
  //   //if find a match, change your background color to that color
  //   if (transcript.includes(color)) {
  //     body.style.backgroundColor = color;
  //   }
  // }) 
})

//add your functionality to the start and stop buttons
function startRecording() {
  recognition.start();
  recognition.addEventListener("end", recognition.start)

  document.getElementById("stop").addEventListener("click", stopRecording)
}

function stopRecording() {
  console.log("okay I'll stop")
  recognition.removeEventListener("end", recognition.start)
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
});
document.querySelector('.pitch').innerHTML = pitch.value;
pitch.addEventListener('change', e => {
  document.querySelector('.pitch').innerHTML = pitch.value;
});

document.querySelector('#speak').addEventListener('click', e => {
e.preventDefault();
speak();
});


//DOM MANIPULATIONS 

let textToSpeech = document.querySelector('#textToSpeech');
let speechToText = document.querySelector('#speechToText');

let buttons = document.querySelectorAll('.btnLink');

buttons[0].addEventListener('click', e => {
  speechToText.classList.remove('off');
  textToSpeech.classList.add('off');
});

buttons[1].addEventListener('click', e => {
  textToSpeech.classList.remove('off');
  speechToText.classList.add('off');
  })