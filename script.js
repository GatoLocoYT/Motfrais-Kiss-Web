lucide.createIcons();

const slides = Array.from(document.querySelectorAll(".slide"));
const dotsContainer = document.getElementById("carouselDots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let current = 0;

slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.addEventListener("click", () => {
        current = index;
        updateCarousel();
    });
    dotsContainer.appendChild(dot);
});

const dots = Array.from(dotsContainer.querySelectorAll("button"));

function updateCarousel() {
    slides.forEach((slide, index) => {
        slide.classList.remove("active", "prev-slide", "next-slide");

        if (index === current) {
            slide.classList.add("active");
        }

        if (index === getPreviousIndex()) {
            slide.classList.add("prev-slide");
        }

        if (index === getNextIndex()) {
            slide.classList.add("next-slide");
        }
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === current);
    });
}

function getPreviousIndex() {
    return current === 0 ? slides.length - 1 : current - 1;
}

function getNextIndex() {
    return current === slides.length - 1 ? 0 : current + 1;
}

prevBtn.addEventListener("click", () => {
    current = getPreviousIndex();
    updateCarousel();
});

nextBtn.addEventListener("click", () => {
    current = getNextIndex();
    updateCarousel();
});

setInterval(() => {
    current = getNextIndex();
    updateCarousel();
}, 5200);

updateCarousel();
document.querySelectorAll(".music-player").forEach(player => {
  const audio = new Audio(player.dataset.audio);

  const btn = player.querySelector(".play-btn");
  const bar = player.querySelector(".progress-bar");
  const progress = player.querySelector(".progress");
  const time = player.querySelector(".time");

  // 🔥 nuevo sistema de volumen (corazones)
  const heartButtons = player.querySelectorAll(".heart-volume button");
  const volumeIcon = player.querySelector(".volume-icon");

  let playing = false;

  // 🔥 función volumen
  function setVolume(value) {
    value = Math.max(0, Math.min(1, value));
    audio.volume = value;

    // llenar corazones
    heartButtons.forEach((heart, index) => {
      heart.classList.toggle("filled", index < Math.round(value * 10));
    });

    // cambiar icono
    volumeIcon.className =
      value === 0
        ? "fa-solid fa-volume-xmark volume-icon"
        : value < 0.5
        ? "fa-solid fa-volume-low volume-icon"
        : "fa-solid fa-volume-high volume-icon";
  }

  // 🔥 volumen inicial
  setVolume(0.7);

  // 🔥 click corazones
  heartButtons.forEach(button => {
    button.addEventListener("click", () => {
      setVolume(Number(button.dataset.value));
    });
  });

  // 🔥 play / pause
  btn.addEventListener("click", () => {

    // parar otros
    document.querySelectorAll(".music-player").forEach(p => {
      if (p !== player) {
        p.audio?.pause();
        p.playing = false;
        p.classList.remove("playing");
        p.querySelector(".play-btn").innerText = "▶";
      }
    });

    if (!playing) {
      audio.play();
      btn.innerText = "⏸";
      player.classList.add("playing");
      playing = true;
    } else {
      audio.pause();
      btn.innerText = "▶";
      player.classList.remove("playing");
      playing = false;
    }

    player.audio = audio;
    player.playing = playing;
  });

  // 🔥 progreso
  audio.addEventListener("timeupdate", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    bar.style.width = percent + "%";

    const minutes = Math.floor(audio.currentTime / 60);
    const seconds = Math.floor(audio.currentTime % 60)
      .toString()
      .padStart(2, "0");

    time.innerText = `${minutes}:${seconds}`;
  });

  // 🔥 click barra progreso
  progress.addEventListener("click", e => {
    const rect = progress.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  });

  // 🔥 cuando termina
  audio.addEventListener("ended", () => {
    btn.innerText = "▶";
    player.classList.remove("playing");
    playing = false;
  });
});