//TODO--Favourite, Add Playlist, Your Playlist section will be implemented later

console.log("Chaliye shurur karte hai...");

// Get all navbar links
let navLinks = document.querySelectorAll(".nav-link");

// Add click event listener to each navbar link
navLinks.forEach(function (navLink) {
  navLink.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default anchor behavior

    // Get the target section's ID from the href attribute
    let targetId = navLink.getAttribute("href");

    // Get the target section element
    let targetSection = document.querySelector(targetId);

    // Scroll to the target section
    targetSection.scrollIntoView({ behavior: "smooth" });
  });
});
let leftCrossBtn = document.getElementById("left-cross");
leftCrossBtn.style.display = "none";
document.getElementById("hemburger-icon").addEventListener("click", () => {
  document.getElementsByClassName("left")[0].style.left = "0";
  leftCrossBtn.style.display = "flex";
  leftCrossBtn.addEventListener("click", () => {
    document.getElementsByClassName("left")[0].style.left = "-150%";
  });
});

// window.location.href = url;
const url1 = "http://127.0.0.1:3000/SpotifyClone/assets/songs/";
const url2 = "http://127.0.0.1:3000/SpotifyClone/assets/songs/";
fetchData(url1, 1);

function fetchData(url, value) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Some problem occurred in fetched playlists. Network response not OK."
        );
      }
      return response.text();
    })
    .then((data) => {
      if (value == 1) {
        setPlaylistDatas(data);
      } else {
        setSongDatas(data);
      }
    })
    .catch((error) => {
      console.error("Problem in fetching operation.");
    });
}
let as;
let titles;
function setSongDatas(data) {
  as = null;
  titles = null;
  document.body.getElementsByClassName("songs-cards")[0].innerHTML = "";
  let div = document.createElement("div");
  div.innerHTML = data;

  // console.log(data);
  as = div.getElementsByTagName("a");

  for (let i = 1; i < as.length; i++) {
    createSongCard(as[i].innerText.split(".mp3")[0], i);
  }
}
function setPlaylistDatas(data) {
  let div = document.createElement("div");
  div.innerHTML = data;
  let as = div.getElementsByTagName("a");
  for (let i = 1; i < as.length; i++) {
    createPlaylistCard(as[i].href, as[i].innerText.split("/")[0]);
  }
}

function createSongCard(title, i) {
  let card = document.createElement("div");
  card.setAttribute("class", "song display-flex border-1 hover");
  card.innerHTML = `<img width="25px" src="assets/images/play.png" alt="icon" />
  <span id="song-name">${title}</span>`;
  document.body.getElementsByClassName("songs-cards")[0].append(card);
  //   console.log(document.body.getElementsByClassName("songs-cards")[0].innerHTML);
  card.addEventListener("click", () => {
    // console.log("dhjskhkds");
    playSong(i);
  });
}

let audio = new Audio();
function playSong(i) {
  if (as != null) {
    let src = as[i];
    audio.src = src;
    // console.log(audio);
    audio.autoplay = true;
    setControls(audio, i);
  }
}

function timeFormatter(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}
let volumeCircle = document.getElementById("volume-circle");
volumeCircle.style.left="100%";
function setControls(audio, i) {
  let volumeBtn = document.getElementById("volume-btn");
  let loopBtn = document.getElementById("loop-btn");
  let playBtn = document.getElementById("play-btn");
  let prevBtn = document.getElementById("previous-btn");
  let nextBtn = document.getElementById("next-btn");
  let favouriteBtn = document.getElementById("favourite-btn");
  let seekbarCircle = document.getElementById("seekbar-circle");
  let seekbarLine = document.getElementById("seekbar-line");
  let timeStamp = document.getElementById("control-time-stamp");
  seekbarCircle.style.left = "0%";
  let songName = document.getElementById("controls-song-name");
  songName.innerText = as[i].innerText.split(".mp3")[0];
  audio.addEventListener("timeupdate", function () {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    // console.log(duration);
    const progressPercentage = (currentTime / duration) * 100;
    seekbarCircle.style.left = `${progressPercentage}%`;
    timeStamp.innerText = `${timeFormatter(currentTime)}/${timeFormatter(
      duration
    )}`;
  });

  //Handling Seekbar

  const audioPlayer = audio;
  // const seekbarLine = document.getElementById("seekbar-line");
  // const seekbarCircle = document.getElementById("seekbar-circle");

  const seekbarContainer = document.querySelector(".seekbar");
  const seekbarContainerRect = seekbarContainer.getBoundingClientRect();

  const volumeContainer = document.querySelector(".volume-seekbar");
  let volumeLine = document.getElementById("volume-line");
  
  const volumeContainerRect = volumeContainer.getBoundingClientRect();

  function moveCircle(event, containerRect, container, circle, isVolume) {
    const x = event.clientX - containerRect.left;
    const maxWidth = container.offsetWidth;
    let clampedX = Math.min(Math.max(0, x), maxWidth);
    const percentage = clampedX / maxWidth;

    circle.style.left = `${clampedX - circle.offsetWidth / 2}px`;

    if (isVolume) {
      audioPlayer.volume = percentage;
    } else {
      audioPlayer.currentTime = percentage * audioPlayer.duration;
    }
  }

  function handleSeek(event, containerRect, container, circle, isVolume) {
    moveCircle(event, containerRect, container, circle, isVolume);
    if (!isVolume) {
      audioPlayer.play();
    }
  }

  let isDraggingSeek = false;
  let isDraggingVolume = false;

  seekbarCircle.addEventListener("mousedown", (event) => {
    isDraggingSeek = true;
    moveCircle(
      event,
      seekbarContainerRect,
      seekbarContainer,
      seekbarCircle,
      false
    );
  });

  volumeCircle.addEventListener("mousedown", (event) => {
    isDraggingVolume = true;
    moveCircle(event, volumeContainerRect, volumeContainer, volumeCircle, true);
  });

  document.addEventListener("mousemove", (event) => {
    if (isDraggingSeek) {
      moveCircle(
        event,
        seekbarContainerRect,
        seekbarContainer,
        seekbarCircle,
        false
      );
    }
    if (isDraggingVolume) {
      moveCircle(
        event,
        volumeContainerRect,
        volumeContainer,
        volumeCircle,
        true
      );
    }
  });

  document.addEventListener("mouseup", () => {
    if (isDraggingSeek) {
      isDraggingSeek = false;
      audioPlayer.play();
    }
    if (isDraggingVolume) {
      isDraggingVolume = false;
    }
  });

  seekbarContainer.addEventListener("click", (event) => {
    handleSeek(
      event,
      seekbarContainerRect,
      seekbarContainer,
      seekbarCircle,
      false
    );
  });

  volumeContainer.addEventListener("click", (event) => {
    handleSeek(event, volumeContainerRect, volumeContainer, volumeCircle, true);
  });

  audioPlayer.addEventListener("timeupdate", () => {
    const percentage = audioPlayer.currentTime / audioPlayer.duration;
    const x = percentage * seekbarContainer.offsetWidth;
    seekbarCircle.style.left = `${x - seekbarCircle.offsetWidth / 2}px`;
  });

  audioPlayer.addEventListener("volumechange", () => {
    const percentage = audioPlayer.volume;
    const x = percentage * volumeContainer.offsetWidth;
    volumeCircle.style.left = `${x - volumeCircle.offsetWidth / 2}px`;
  });

  

  let isPlay = true;
  // Ensure the progress displays correctly when the audio ends or is reset
  audio.addEventListener("ended", function () {
    playBtn.setAttribute("src", "assets/images/play.png");
    isPlay = false;
    if (i + 1 < as.length) {
      playSong(i + 1);
    }
  });

  playBtn.setAttribute("src", "assets/images/pause.svg");

  playBtn.addEventListener("click", () => {
    if (isPlay) {
      playBtn.setAttribute("src", "assets/images/play.png");
      audio.pause();
      isPlay = false;
    } else {
      playBtn.setAttribute("src", "assets/images/pause.svg");
      audio.play();
      isPlay = true;
    }
  });
  let isMute = false;
  volumeBtn.addEventListener("click", () => {
    if (!isMute) {
      volumeBtn.setAttribute("src", "assets/images/mute.svg");
      audio.muted = true;
      isMute = true;
    } else {
      volumeBtn.setAttribute("src", "assets/images/volume.png");
      audio.muted = false;
      isMute = false;
    }
  });
  loopBtn.setAttribute("src", "assets/images/loop.png");
  let isLoop = false;
  loopBtn.addEventListener("click", () => {
    if (!isLoop) {
      audio.loop = true;
      loopBtn.setAttribute("src", "assets/images/loop-on.svg");
      isLoop = true;
    } else {
      audio.loop = false;
      loopBtn.setAttribute("src", "assets/images/loop.png");
      isLoop = false;
    }
  });
  prevBtn.addEventListener("click", () => {
    if (i - 1 > 0) {
      i = i - 1;
      playSong(i);
    }
  });
  nextBtn.addEventListener("click", () => {
    if (i + 1 < as.length) {
      i = i + 1;
      playSong(i);
    }
  });
  favouriteBtn.addEventListener("click", () => {
    //TODO: Will be implemented later
  });
}

function createPlaylistCard(src, title) {
  let card = document.createElement("div");
  card.setAttribute("class", "card hover");
  card.innerHTML = `<img src="assets/images/image1.png" alt="" />
<div class="card-content display-flex hover">
  <span id="playlist-title">${title}</span>
  <img
    class="hover"
    id="card-play-btn"
    src="assets/images/play.png"
    alt=""
    srcset=""
  />
</div>`;
  document.body.getElementsByClassName("playlist-cards")[0].append(card);

  card.addEventListener("click", () => {
    fetchData(src, 0);
  });
}

//TODO--Solve the scrollbar glitch(Check for responsiveness)
//TODO--Solve the cross button glitch
//TODO--Implement Song and volume seekbar functionalities
