# Sounds of Hyderabad

Lab 5 for CCT360 (Design with Sound & Vision).

Live site: https://varnan234.github.io/CCT360-LAB5/

## Part A: Soundscape

`audio/hyderabad-soundscape.mp3` is 1:29 long and follows one day in Hyderabad:

| Time | Part | Sounds |
|---|---|---|
| 0:00 | Dawn | azaan over a quiet street |
| 0:14 | Temple | temple bells, street waking up |
| 0:26 | Morning rush | Hyderabad street traffic and honking, an auto starting and driving off |
| 0:42 | Evening chai | a group talking in Telugu, traffic in the background |
| 0:56 | Wedding night | marfa drums (my own recreation) with a crowd |
| 1:10 | Monsoon | rain and thunder, fades out |

I couldn't find a marfa recording with a free licence anywhere, so I made the marfa part myself: a deep marfa drum, daff slaps and jhanj cymbals in the fast triplet groove, built from scratch in code. It's a recreation, not a recording of a real band.

I layered and crossfaded the clips, evened out the volume of each one, and exported it as an mp3.

## Part B: Visualscape

- Custom controls for the HTML5 audio: play/pause, seek bar, time, volume and mute
- A blurred, darkened copy of the current photo fills the page background and changes with each scene
- The photo crossfades to a new scene when the soundscape reaches that part, and slowly zooms while it plays
- The Web Audio API (AnalyserNode) reads the sound, which drives:
  - frequency bars along the bottom of the picture
  - the picture getting brighter when the sound is louder
  - animated rain during the monsoon part, with more drops when it's louder
  - a lightning flash when the volume jumps suddenly (the thunder)
- Scene buttons jump to that part of the soundscape
- Six sound cards play the separate sounds (keys 1 to 6), and they wobble while playing
- Space bar plays and pauses

Note: the visuals need the page to be served from a web server (like GitHub Pages). If you open index.html straight from the folder, the sound plays but Chrome blocks the analyser, so the bars stay flat.

## Sound credits (all CC0, from Freesound)

- Indian Street Ambience (recorded in Hyderabad) - Manindhra_D - https://freesound.org/people/Manindhra_D/sounds/646051/
- A crowd of young men speaking in Telugu language in Hyderabad - ashwinrajashekar - https://freesound.org/people/ashwinrajashekar/sounds/662156/
- Indian Auto rickshaw, start leave and approach - Kriaa - https://freesound.org/people/Kriaa/sounds/353664/
- 2HinduTemplesBells2 - LoopUdu - https://freesound.org/people/LoopUdu/sounds/271627/
- Rain with thunder - Techienanna - https://freesound.org/people/Techienanna/sounds/400988/
- Muezzin on a busy street in Giza (used for the azaan; recorded in Egypt, I couldn't find a free Hyderabad recording) - Agim - https://freesound.org/people/Agim/sounds/457265/

## Photo credits (Unsplash License)

- dawn.jpg - Swipe - https://unsplash.com/photos/charminar-monument-in-hyderabad-F-LVLE4r7sA
- temple.jpg (Birla Mandir) - Naveen Naidu - https://unsplash.com/photos/white-concrete-building-under-blue-sky-during-daytime-XFTPmRwr9wE
- rush.jpg - Prabhav Kashyap Godavarthy - https://unsplash.com/photos/yellow-and-black-auto-rickshaw-on-road-during-daytime-1XJt1RpU5FI
- wedding.jpg - Royal Photography - https://unsplash.com/photos/groom-in-decorated-carriage-with-fireworks-at-night-HIljeUwGr3g
- marfa.jpg - Sreekumar Pillai - https://unsplash.com/photos/a-man-playing-a-drum-in-front-of-a-group-of-people-SzVfJkiuVu0
- evening.jpg - Mr Cool Hitman - https://unsplash.com/photos/charminar-monument-and-market-in-hyderabad-UW1MiJMXzsM
- monsoon.jpg - Rishabh Modi - https://unsplash.com/photos/a-couple-of-umbrellas-in-front-of-a-large-building-pYt4YtkXwWs
- chai.jpg - Ananthan Chithiraikani - https://unsplash.com/photos/a-plate-of-food-that-includes-bread-and-a-drink-7-PQGUrIGOc
- bells.jpg - atelierbyvineeth - https://unsplash.com/photos/decorative-brass-bells-with-festive-garlands-xbrnPhOYJrQ
