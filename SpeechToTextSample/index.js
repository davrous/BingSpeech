var client;
var languageoptions = document.getElementById("languageoptions");
var speechActivity = document.getElementById("speechActivity");
var networkActivity = document.getElementById("networkActivity");

languageoptions.addEventListener("change", function () {
    createAndSetupClient();
});

function getKey() {
    return document.getElementById("key").value;
}

function getLanguage() {
    return languageoptions.value;
}

function setText(text) {
    document.getElementById("output").value += text + "\n";
}

function start() {
    document.getElementById("startBtn").disabled = true;
    document.getElementById("stopBtn").disabled = false;
    client.startMicAndContinuousRecognition();
}

function stop() {
    document.getElementById("startBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
    client.endMicAndContinuousRecognition();
}

function createAndSetupClient() {
    document.getElementById("startBtn").disabled = false;

    if (client) {
        stop();
    }

    client = new BingSpeech.RecognitionClient(getKey(), getLanguage());

    client.onFinalResponseReceived = function (response) {
        setText(response);
    }

    client.onError = function (code, requestId) {
        console.log("<Error with request n°" + requestId + ">");
    }

    client.onVoiceDetected = function () {
        speechActivity.classList.remove("hidden");
    }

    client.onVoiceEnded = function () {
        speechActivity.classList.add("hidden");
    }

    client.onNetworkActivityStarted = function () {
        networkActivity.classList.remove("hidden");
    }

    client.onNetworkActivityEnded = function () {
        networkActivity.classList.add("hidden");
    }
}