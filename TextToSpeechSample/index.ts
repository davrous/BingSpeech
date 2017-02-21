var bingClientTTS = new BingSpeech.TTSClient("YOUR_BING_SPEECH_API_KEY");

document.getElementById("speakBtn").addEventListener("click", function () {
    bingClientTTS.multipleXHR = (<HTMLInputElement>document.getElementById("multipleXHRChk")).checked;
    bingClientTTS.synthesize("Hello, my name is Mat, I'm glad to meet you");
    bingClientTTS.synthesize("How are you?");
    bingClientTTS.synthesize("Salut, je m'appelle David", BingSpeech.SupportedLocales.frFR_Female);
    bingClientTTS.synthesize("Enchanté de faire votre connaissance!", BingSpeech.SupportedLocales.frFR_Male);
    bingClientTTS.synthesize("Hallo, mein Name ist Frank.", BingSpeech.SupportedLocales.deDE_Male);
    bingClientTTS.synthesize("Wie geht es Ihnen?", BingSpeech.SupportedLocales.deDE_Female);
    bingClientTTS.synthesize("Zdravstvuite, menya zovut Kristina i ya rada vas privetstvovat'"
        , BingSpeech.SupportedLocales.ruRU_Female
        , () => {
            bingClientTTS.synthesize("Even more later text to speech!", BingSpeech.SupportedLocales.enGB_Female);
    });
});