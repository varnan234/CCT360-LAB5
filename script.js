// CCT360 Lab 5 - Sounds of Hyderabad
// Part A is the soundscape mp3 (audio/hyderabad-soundscape.mp3)
// Part B is this page: the picture changes with the soundscape, and the
// bars / brightness / rain / lightning all react to the sound using the Web Audio API

// ---------- the scenes in the soundscape ----------

var scenes = [
  { start: 0, img: "images/dawn.jpg", title: "Fajr", text: "The morning azaan from the old city, before the sun is up." },
  { start: 14, img: "images/temple.jpg", title: "Temple", text: "Bells at Birla Mandir while the street starts waking up." },
  { start: 27, img: "images/evening.jpg", title: "Charminar", text: "Autos, honking, bargaining, friends talking in Telugu." },
  { start: 50, img: "images/wedding.jpg", title: "Wedding night", text: "Somewhere there's always a baraat, and the marfa band is going hard." },
  { start: 64, img: "images/night.jpg", title: "Isha", text: "The last azaan of the day. The city finally goes quiet." }
];

var currentScene = 0;
var showingA = true;   // which of the two <img> tags is on top right now

// ---------- getting stuff from the html ----------

var soundscape = document.getElementById("soundscape");
var playBtn = document.getElementById("playBtn");
var muteBtn = document.getElementById("muteBtn");
var seekBar = document.getElementById("seekBar");
var volumeBar = document.getElementById("volumeBar");
var timeText = document.getElementById("timeText");
var stage = document.getElementById("stage");
var sceneA = document.getElementById("sceneA");
var sceneB = document.getElementById("sceneB");
var sceneTitle = document.getElementById("sceneTitle");
var sceneText = document.getElementById("sceneText");
var flash = document.getElementById("flash");
var bars = document.getElementById("bars");
var barsCtx = bars.getContext("2d");
var rainCanvas = document.getElementById("rainCanvas");
var rainCtx = rainCanvas.getContext("2d");
var chapterBtns = document.querySelectorAll(".chapter");
var padBtns = document.querySelectorAll(".pad");

// the short sounds for the cards
var padSounds = {
  azaan: new Audio("audio/azaan.mp3"),
  bells: new Audio("audio/bells.mp3"),
  auto: new Audio("audio/auto.mp3"),
  chai: new Audio("audio/chai.mp3"),
  marfa: new Audio("audio/marfa.mp3"),
  rain: new Audio("audio/rain.mp3")
};

var dragging = false;   // true while the user is dragging the seek bar
soundscape.volume = volumeBar.value;


// ---------- web audio (so the visuals can "hear" the sound) ----------

var audioCtx = null;
var analyser = null;
var freqData = null;

// browsers only allow this after the user clicks something, so it runs on the first click
function setUpAudio() {
  if (audioCtx) {
    return;
  }
  audioCtx = new AudioContext();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 128;
  freqData = new Uint8Array(analyser.frequencyBinCount);
  analyser.connect(audioCtx.destination);

  // send the soundscape and every pad sound through the analyser
  audioCtx.createMediaElementSource(soundscape).connect(analyser);
  for (var name in padSounds) {
    audioCtx.createMediaElementSource(padSounds[name]).connect(analyser);
  }

  draw();
}


// ---------- play, pause, seek, volume ----------

function togglePlay() {
  setUpAudio();
  if (soundscape.paused) {
    soundscape.play();
  } else {
    soundscape.pause();
  }
}

soundscape.addEventListener("play", function () {
  playBtn.innerHTML = "&#10074;&#10074; Pause";
  stage.classList.add("playing");
});

soundscape.addEventListener("pause", function () {
  playBtn.innerHTML = "&#9654; Play";
  stage.classList.remove("playing");
});

soundscape.addEventListener("ended", function () {
  playBtn.innerHTML = "&#8635; Play again";
});

soundscape.addEventListener("timeupdate", function () {
  if (!dragging) {
    seekBar.value = soundscape.currentTime;
  }
  timeText.innerHTML = formatTime(soundscape.currentTime) + " / " + formatTime(soundscape.duration || 88);
  checkScene();
});

seekBar.addEventListener("input", function () {
  dragging = true;
  timeText.innerHTML = formatTime(seekBar.value) + " / " + formatTime(soundscape.duration || 88);
});

seekBar.addEventListener("change", function () {
  soundscape.currentTime = seekBar.value;
  dragging = false;
});

volumeBar.addEventListener("input", function () {
  soundscape.volume = volumeBar.value;
  soundscape.muted = false;
  muteBtn.innerHTML = "Mute";
});

muteBtn.addEventListener("click", function () {
  soundscape.muted = !soundscape.muted;
  if (soundscape.muted) {
    muteBtn.innerHTML = "Unmute";
  } else {
    muteBtn.innerHTML = "Mute";
  }
});

playBtn.addEventListener("click", togglePlay);

// turns 65.3 into "1:05"
function formatTime(seconds) {
  var mins = Math.floor(seconds / 60);
  var secs = Math.floor(seconds % 60);
  if (secs < 10) {
    secs = "0" + secs;
  }
  return mins + ":" + secs;
}


// ---------- changing the picture with the sound ----------

function checkScene() {
  var t = soundscape.currentTime;
  var newScene = 0;

  // find the last scene that has started
  for (var i = 0; i < scenes.length; i++) {
    if (t >= scenes[i].start) {
      newScene = i;
    }
  }

  if (newScene != currentScene) {
    showScene(newScene);
  }
}

function showScene(index) {
  currentScene = index;
  var scene = scenes[index];

  // put the new picture in the hidden img, then fade it in over the old one
  if (showingA) {
    sceneB.src = scene.img;
    sceneB.classList.add("show");
    sceneA.classList.remove("show");
  } else {
    sceneA.src = scene.img;
    sceneA.classList.add("show");
    sceneB.classList.remove("show");
  }
  showingA = !showingA;

  sceneTitle.innerHTML = scene.title;
  sceneText.innerHTML = scene.text;

  // the page background changes too
  document.getElementById("pageBg").style.backgroundImage = "url(" + scene.img + ")";

  // highlight the matching chapter button
  for (var i = 0; i < chapterBtns.length; i++) {
    if (i == index) {
      chapterBtns[i].classList.add("active");
    } else {
      chapterBtns[i].classList.remove("active");
    }
  }
}

for (var i = 0; i < chapterBtns.length; i++) {
  chapterBtns[i].addEventListener("click", function () {
    setUpAudio();
    soundscape.currentTime = Number(this.dataset.time);
    soundscape.play();
  });
}


// ---------- sound pads ----------

function playPad(name) {
  setUpAudio();
  var sound = padSounds[name];
  var btn = document.querySelector('.pad[data-sound="' + name + '"]');

  // clicking a pad that is already playing stops it
  if (!sound.paused) {
    sound.pause();
    sound.currentTime = 0;
    btn.classList.remove("on");
    return;
  }

  sound.currentTime = 0;
  sound.play();
  btn.classList.add("on");
}

for (var name in padSounds) {
  // when a pad sound finishes, stop the wobble
  padSounds[name].addEventListener("ended", function () {
    for (var j = 0; j < padBtns.length; j++) {
      if (padSounds[padBtns[j].dataset.sound].paused) {
        padBtns[j].classList.remove("on");
      }
    }
  });
}

for (var i = 0; i < padBtns.length; i++) {
  padBtns[i].addEventListener("click", function () {
    playPad(this.dataset.sound);
  });
}

// keyboard: space = play/pause, 1-6 = pads
document.addEventListener("keydown", function (e) {
  if (e.target.tagName == "INPUT") {
    return;
  }
  if (e.key == " ") {
    e.preventDefault();
    togglePlay();
  } else if (e.key >= "1" && e.key <= "6") {
    playPad(padBtns[Number(e.key) - 1].dataset.sound);
  }
});


// ---------- the visuals that react to sound ----------

var raindrops = [];
var lastLoudness = 0;
var flashAmount = 0;

// make the canvases match their size on screen
function resizeCanvases() {
  bars.width = stage.clientWidth;
  bars.height = stage.clientHeight;
  rainCanvas.width = stage.clientWidth;
  rainCanvas.height = stage.clientHeight;
}
window.addEventListener("resize", resizeCanvases);
resizeCanvases();

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(freqData);

  // average loudness, 0 to 1
  var total = 0;
  for (var i = 0; i < freqData.length; i++) {
    total = total + freqData[i];
  }
  var loudness = total / freqData.length / 255;

  // 1. the picture gets brighter when it's loud
  // (when the rain card is playing it goes darker and greyer, like a storm)
  var raining = !padSounds.rain.paused;
  var bright = 0.75 + loudness * 0.9;
  var grey = 0;
  if (raining) {
    bright = 0.45 + loudness * 0.7;
    grey = 0.5;
  }
  var effect = "brightness(" + bright + ") grayscale(" + grey + ")";
  sceneA.style.filter = effect;
  sceneB.style.filter = effect;

  // 2. frequency bars along the bottom
  barsCtx.clearRect(0, 0, bars.width, bars.height);
  var barWidth = bars.width / freqData.length;
  for (var i = 0; i < freqData.length; i++) {
    var h = (freqData[i] / 255) * bars.height * 0.35;
    // colour goes from orange (low notes) to white (high notes)
    var light = 55 + (i / freqData.length) * 40;
    barsCtx.fillStyle = "hsla(38, 90%, " + light + "%, 0.75)";
    barsCtx.fillRect(i * barWidth, bars.height - h, barWidth - 2, h);
  }

  // 3. rain when the rain card is playing
  drawRain(raining, loudness);

  // 4. lightning: a sudden jump in loudness during the rain = thunder
  if (raining && loudness - lastLoudness > 0.06) {
    flashAmount = 0.8;
  }
  flashAmount = flashAmount * 0.9;
  flash.style.opacity = flashAmount;
  lastLoudness = loudness;
}

function drawRain(raining, loudness) {
  rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);

  // add new drops (more drops when the rain is louder)
  if (raining) {
    var newDrops = 2 + Math.round(loudness * 12);
    for (var i = 0; i < newDrops; i++) {
      raindrops.push({
        x: Math.random() * rainCanvas.width,
        y: -20,
        speed: 10 + Math.random() * 8,
        length: 10 + Math.random() * 15
      });
    }
  }

  // move and draw every drop
  rainCtx.strokeStyle = "rgba(210, 225, 255, 0.8)";
  rainCtx.lineWidth = 2;
  for (var i = raindrops.length - 1; i >= 0; i--) {
    var d = raindrops[i];
    d.y = d.y + d.speed;
    d.x = d.x - 2;
    rainCtx.beginPath();
    rainCtx.moveTo(d.x, d.y);
    rainCtx.lineTo(d.x - 3, d.y + d.length);
    rainCtx.stroke();

    // remove drops that fell off the bottom
    if (d.y > rainCanvas.height) {
      raindrops.splice(i, 1);
    }
  }
}

// start on the first scene
showScene(0);
