AOS.init({
  duration: 1200
});




$('.hero__scroll').on('click', function(e) {
    $('html, body').animate({
        scrollTop: $(window).height()
    }, 1200);
});
        

const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const audio = document.getElementById("audio")
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let isVideo = false;
let model = null;

const modelParams = {
    flipHorizontal: true,  // flip e.g for video  
    imageScaleFactor: 0.2,   
    maxNumBoxes: 3,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.72,    // confidence threshold for predictions.
}



function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Wideo ruszyło! Poszukuję dłoni."
            isVideo = true
            setInterval(runDetection(), 2800);
        } else {
            updateNote.innerText = "Proszę włącz obraz..."
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Startuję wideo..."
        startVideo();
    } else {
        updateNote.innerText = "Stopuję..."
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Zastopowane..."
    }
}



function runDetection() {
    model.detect(video).then(predictions => {
        //console.log("Predictions: ", predictions);
        model.setModelParameters(modelParams)
        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
        if(predictions.length > 0){
                audio.play();
                
            }
            else{
                audio.pause();

            }
    });
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Model załadowany (ML)"
    trackButton.disabled = false
});



