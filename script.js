document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const preloader = document.getElementById("preloader");
  const themeBtn = document.getElementById("themeBtn");
  const menuBtn = document.getElementById("menuBtn");
  const navMenu = document.getElementById("navMenu");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover:hover) and (pointer:fine)").matches;

  // Loading screen
  setTimeout(() => preloader?.classList.add("hide"), 1100);

  // Theme with localStorage
  const saved = localStorage.getItem("yolanda-theme");
  if (saved === "dark") {
    body.dataset.theme = "dark";
    themeBtn.textContent = "☀";
  }
  themeBtn?.addEventListener("click", () => {
    const dark = body.dataset.theme === "dark";
    if (dark) {
      delete body.dataset.theme;
      localStorage.setItem("yolanda-theme", "light");
      themeBtn.textContent = "☾";
    } else {
      body.dataset.theme = "dark";
      localStorage.setItem("yolanda-theme", "dark");
      themeBtn.textContent = "☀";
    }
  });

  // Mobile navigation
  menuBtn?.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  navMenu?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  }));

  // Reveal on scroll
  const reveal = document.querySelectorAll(".reveal");
  if (reduceMotion) reveal.forEach(el => el.classList.add("visible"));
  else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.12});
    reveal.forEach(el => io.observe(el));
  } else reveal.forEach(el => el.classList.add("visible"));

  // Active nav item
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll(".nav-menu a[href^='#']");
  if ("IntersectionObserver" in window) {
    const navIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, {rootMargin:"-35% 0px -55% 0px"});
    sections.forEach(s => navIO.observe(s));
  }

  // Skill bars
  const skillBars = document.querySelectorAll(".skill i");
  if ("IntersectionObserver" in window) {
    const skillIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = `${entry.target.dataset.progress}%`;
          skillIO.unobserve(entry.target);
        }
      });
    }, {threshold:.3});
    skillBars.forEach(b => skillIO.observe(b));
  }

  // Lightweight desktop 3D tilt
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".tilt").forEach(card => {
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(850px) rotateX(${y * -6}deg) rotateY(${x * 7}deg)`;
      });
      card.addEventListener("pointerleave", () => card.style.transform = "");
    });
  }

  // Music player: no autoplay
  const audio = document.getElementById("audio");
  const play = document.getElementById("play");
  const mute = document.getElementById("mute");
  const progress = document.getElementById("musicProgress");
  let audioOK = true;

  audio?.addEventListener("error", () => {
    audioOK = false;
    play.disabled = true;
    play.textContent = "♪";
    play.title = "Tambahkan assets/heaven-song.mp3";
    play.style.opacity = ".55";
  });
  play?.addEventListener("click", async () => {
    if (!audioOK || !audio) return;
    try {
      if (audio.paused) {
        await audio.play();
        play.textContent = "Ⅱ";
      } else {
        audio.pause();
        play.textContent = "▶";
      }
    } catch (err) { console.warn("Audio tidak dapat diputar:", err); }
  });
  mute?.addEventListener("click", () => {
    if (!audio) return;
    audio.muted = !audio.muted;
    mute.textContent = audio.muted ? "🔇" : "🔊";
  });
  audio?.addEventListener("timeupdate", () => {
    if (audio.duration) progress.style.width = `${audio.currentTime / audio.duration * 100}%`;
  });
  audio?.addEventListener("ended", () => { play.textContent = "▶"; progress.style.width = "0"; });

  // Smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior: reduceMotion ? "auto" : "smooth"});
    });
  });
});

/*
  EDIT GUIDE
  1. Foto: ganti assets/profile.jpg
  2. Musik: ganti assets/heaven-song.mp3
  3. Skill: ubah data-progress="80" dan angka teks di index.html
  4. Warna: ubah variabel --pink, --pink-2, --pink-soft, --lav, --peach di style.css
  5. GitHub: ganti [username GitHub] dengan username asli setelah tersedia.
*/
