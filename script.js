// CCT360 Lab 5 - Sounds of Hyderabad
// the picture, title and background change depending on where the soundscape is

var soundscape = document.getElementById("soundscape");
var playBtn = document.getElementById("playBtn");
var scenePic = document.getElementById("scenePic");
var sceneTitle = document.getElementById("sceneTitle");
var sceneText = document.getElementById("sceneText");
var sceneBtns = document.querySelectorAll(".sceneBtn");

var currentScene = "";

// ---------- play / pause / volume buttons ----------

playBtn.addEventListener("click", function () {
  if (soundscape.paused) {
    soundscape.play();
  } else {
    soundscape.pause();
  }
});

document.getElementById("volUpBtn").addEventListener("click", function () {
  if (soundscape.volume < 1) {
    soundscape.volume = Math.min(1, soundscape.volume + 0.1);
  }
});

document.getElementById("volDownBtn").addEventListener("click", function () {
  if (soundscape.volume > 0) {
    soundscape.volume = Math.max(0, soundscape.volume - 0.1);
  }
});

document.getElementById("restartBtn").addEventListener("click", function () {
  soundscape.currentTime = 0;
  soundscape.play();
});

// change the button text and start/stop the zoom
soundscape.addEventListener("play", function () {
  playBtn.innerHTML = "Pause";
  scenePic.classList.add("zoom");
});

soundscape.addEventListener("pause", function () {
  playBtn.innerHTML = "Play";
  scenePic.classList.remove("zoom");
});


// ---------- change the scene with the sound ----------

// timeupdate runs a few times every second while it plays
soundscape.addEventListener("timeupdate", function () {
  var time = soundscape.currentTime;

  if (time < 14) {
    showScene("Fajr", "images/dawn.jpg", "The morning azaan from the old city, before the sun is up.");
  } else if (time < 27) {
    showScene("Temple", "images/temple.jpg", "Bells at Birla Mandir while the street starts waking up.");
  } else if (time < 50) {
    showScene("Charminar", "images/evening.jpg", "Autos, honking, bargaining, friends talking in Telugu.");
  } else if (time < 64) {
    showScene("Marfa", "images/wedding.jpg", "Somewhere there's always a baraat, and the marfa band is going hard.");
  } else {
    showScene("Isha", "images/night.jpg", "The last azaan of the day. The city finally goes quiet.");
  }
});

function showScene(title, picture, text) {
  // only change things if it's a new scene
  if (title == currentScene) {
    return;
  }
  currentScene = title;

  // fade out, swap the picture, fade back in
  scenePic.classList.add("fade");
  setTimeout(function () {
    scenePic.src = picture;
    scenePic.classList.remove("fade");
  }, 1000);

  sceneTitle.innerHTML = title;
  sceneText.innerHTML = text;
  document.body.style.backgroundImage = "url(" + picture + ")";

  // highlight the button for this scene
  for (var i = 0; i < sceneBtns.length; i++) {
    if (sceneBtns[i].innerHTML == title) {
      sceneBtns[i].classList.add("current");
    } else {
      sceneBtns[i].classList.remove("current");
    }
  }
}

// skip buttons
for (var i = 0; i < sceneBtns.length; i++) {
  sceneBtns[i].addEventListener("click", function () {
    soundscape.currentTime = this.dataset.time;
    soundscape.play();
  });
}


// ---------- the sound cards ----------

function setUpCard(name) {
  var card = document.getElementById("card-" + name);
  var sound = new Audio("audio/" + name + ".mp3");

  card.addEventListener("click", function () {
    if (sound.paused) {
      sound.currentTime = 0;
      sound.play();
      card.classList.add("playing");
    } else {
      sound.pause();
      card.classList.remove("playing");
    }
  });

  // take the orange border off when the sound finishes
  sound.addEventListener("ended", function () {
    card.classList.remove("playing");
  });
}

setUpCard("azaan");
setUpCard("bells");
setUpCard("auto");
setUpCard("chai");
setUpCard("marfa");
