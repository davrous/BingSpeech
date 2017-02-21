# Bing Speech-To-Text and Text-To-Speech Client JavaScript Lib
A small JavaScript library to call Bing Speech-To-Text API with continuous voice detection and Text-To-Speech API

This library fixes a couple of issues currently exposed in the official SDK: https://github.com/Microsoft/Cognitive-Speech-STT-JavaScript such as:

- reusing the web audio context that will be instanced one to avoid breaking in Chrome after 6 calls
- continuous recognition by detecting the voice/silence and automatically sending the audio sample to the API for analyze
- reusing the authentication token as it's valid for 10 min rather than creating it again on each request for better performance
- better browsers compatibility (specifically with Firefox and Chrome)

However, it doesn't support NACL or ActiveX fallbacks for older browsers such as IE11 or older versions of Chrome. 

## Prerequisites

- For Text-To-Speech, you need a **Web Audio** compatible browser to use this library (MS Edge, Chrome, Safari, Firefox or Opera) and it needs also to support **ES6/ES2015**: http://kangax.github.io/compat-table/es6/.
- For Speech-To-Text, you need a **GetUserMedia** and **Web Audio** compatible browser to use this library (MS Edge, Chrome, Firefox or Opera).
- Reference **BingSpeech.js** in your HTML page.  
- Generate your **Bing Speech API key**:
  - Free: https://www.microsoft.com/cognitive-services/en-us/subscriptions?productId=/products/Bing.Speech.Preview
  - Paid: https://portal.azure.com/#create/Microsoft.CognitiveServices/apitype/Bing.Speech/pricingtier/S0

## Usage for Speech-To-Text
### Constructor
```javascript
// By default, it will use en-us
var bingClientRecognition = new BingSpeech.RecognitionClient("YOUR_BING_SPEECH_API_KEY");

// You can change it
var bingClientRecognition = new BingSpeech.RecognitionClient("YOUR_BING_SPEECH_API_KEY ", "fr-fr");
```

Supported locales can be found here: https://www.microsoft.com/cognitive-services/en-us/Speech-api/documentation/API-Reference-REST/BingVoiceRecognition

### Available Events
Before starting the microphone and the continuous recognition process, you must first take care of the various events available.

Those 4 events could be useful to notify the user that something is going on:

- **onVoiceDetected()** is raised when the library has detected a voice and started to record the audio sample from your microphone.
- **onVoiceEnded()** when the library has detected the end of the speech, it will then send the recorded audio to Bing Speech API for recognition.
- **onNetworkActivityStarted()** when the audio sample is currently being sent via the network to Bing Speech API.
- **onNetworkActivityEnded()** when all network requests have finished.

The 2 others events are more important as this is the way to get the answer:

- **onFinalResponseReceived(text)** will be called as soon as the Bing Speech API have been able to recognize an audio sample received. It will return the associated text.
- **onError(code, requestId)** will be raised in case of errors. The code will be the HTTP error code if available and the requestId could help you troubleshooting which request failed using a F12 network tab tool. Several possible cases of errors;
  - the audio sample sent contains no interesting text to be recognized like background noise.
  - classic HTTP error like 5xx.  
  - you've reached the quota of number of requests / min (20 for the free key) and the error 429 will be raised.

### Start the recognition process
```javascript
bingClientRecognition.startMicAndContinuousRecognition();
```

### Stop the recognition process
```javascript
bingClientRecognition.endMicAndContinuousRecognition();
```

Please check the sample available in the *SpeechToTextSample* directory for a complete usage. 

Using logic extracted from https://github.com/mattdiamond/Recorderjs for the WAV encoding and https://github.com/kdavis-mozilla/vad.js for the Voice activity detection in JavaScript.

## Usage for Text-To-Speech
### Constructor
```javascript
// By default, it will use EN-US Male voice/locale
var bingClientTTS = new BingSpeech.TTSClient("YOUR_BING_SPEECH_API_KEY");

// You can change it
var bingClientTTS = new BingSpeech.TTSClient("YOUR_BING_SPEECH_API_KEY ", BingSpeech.SupportedLocales.frFR_Male);
```

### Speech with synthesize()
```javascript
// Use the synthesize function to speech, it will use the locale set in the constructor by default
// For instance, this will use the EN-US male voice/locale on both sentences
var bingClientTTS = new BingSpeech.TTSClient("YOUR_BING_SPEECH_API_KEY ");
bingClientTTS.synthesize("Hello, my name is Mat, I'm glad to meet you.");
bingClientTTS.synthesize("How are you?");
```

### Overriding locale
```javascript
// But you can override it anytime like that
var bingClientTTS = new BingSpeech.TTSClient("YOUR_BING_SPEECH_API_KEY ");
bingClientTTS.synthesize("Hello, my name is Mat.");
bingClientTTS.synthesize("Salut, je m'appelle David.", BingSpeech.SupportedLocales.frFR_Female);
bingClientTTS.synthesize("Hallo, mein Name ist Frank.", BingSpeech.SupportedLocales.deDE_Male);
bingClientTTS.synthesize("Zdravstvuite, menya zovut Kristina i ya rada vas privetstvovat'", BingSpeech.SupportedLocales.ruRU_Female);
```

### Callback
```javascript
// If you need a block of text to be read/speech before continuing, you can use the optional callback
// This code will download & play the 3 first sentences 
// Once the 3 sentences will be speech a new final XHR will be launched
// to download & play the last sentence using EN-GB Female.
bingClientTTS.synthesize("Hallo, mein Name ist Frank.", BingSpeech.SupportedLocales.deDE_Male);
bingClientTTS.synthesize("Wie geht es Ihnen?", BingSpeech.SupportedLocales.deDE_Female);
bingClientTTS.synthesize("Zdravstvuite, menya zovut Kristina i ya rada vas privetstvovat'"
    , BingTTS.SupportedLocales.ruRU_Female
    , () => {
        bingClientTTS.synthesize("Even more later text to speech!", BingSpeech.SupportedLocales.enGB_Female);
    }); 
```

By default, the library is sending **multiple XHR in parallel** to have better performance. But your text will be speech in the order of the calls to synthetize(). 

Still, if you’d like to serialize them to have a unique XHR being processed in background, you can change this flag to:

```javascript
bingClientTTS.multipleXHR = false;
```

It can be useful for the free version of your Bing Speech account to avoid reaching the quota of number of requests / min too quickly. 