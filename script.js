/* ==========================================================================
   Ashu & Hrithik - 1 Year Anniversary & Birthday Animation Logic
   ========================================================================== */

const slidesData = [
  {
    img: 'IMG_20251103_113000071_HDR.jpg',
    quote: '"I would never fall in love until I found you... 365 days ago, my whole world changed forever."'
  },
  {
    img: 'IMG_20251104_160922747_BURST000_COVER.jpg',
    quote: '"I said, \'I would never fall unless it\'s you I fall into\'... Thank you for being my everything for a whole year."'
  },
  {
    img: 'IMG_20260116_175642834_HDR.jpg',
    quote: '"I was lost in the dark till I saw your face. 365 days of holding your hand, Ashu."'
  },
  {
    img: 'IMG_20260116_180421944_HDR_PORTRAIT.jpg',
    quote: '"One whole year of laughter, silly moments, and unconditional love with my favorite person."'
  },
  {
    img: 'IMG_20260116_180431648_HDR_PORTRAIT.jpg',
    quote: '"I\'ll never let you go, my girl. Happy Birthday to the love of my life!"'
  },
  {
    img: 'IMG_20260117_103217774_HDR.jpg',
    quote: '"Your smile is my favorite view in the whole wide world. Thank you for this magical year."'
  },
  {
    img: 'IMG_20260117_125748296_HDR.jpg',
    quote: '"From day one to day 365, loving you has been the easiest decision I\'ve ever made."'
  },
  {
    img: 'IMG_20260118_133049169_HDR.jpg',
    quote: '"In a world full of temporary things, you are my permanent happiness. Happy Birthday, Ashu!"'
  },
  {
    img: 'IMG_20260119_100602448_HDR.jpg',
    quote: '"Thank you for being my soulmate, best friend, and partner in crime for 365 beautiful days."'
  },
  {
    img: 'IMG_20260119_114211.jpg',
    quote: '"One year down, a lifetime to go. Happy Birthday, my beautiful Ashu! ❤️"'
  }
];

let currentSlideIdx = 0;
let isSlideshowPlaying = true;
let slideshowTimer = null;
let isMusicPlaying = false;
let audioCtx = null;
let synthInterval = null;
let ytPlayer = null;
let isYtReady = false;
let activeLayer = 'a';

/* YouTube Player API */
window.onYouTubeIframeAPIReady = function() {
  try {
    ytPlayer = new YT.Player('yt-player', {
      height: '1',
      width: '1',
      videoId: 'EmGj_k1fE5A',
      playerVars: {
        'autoplay': 0,
        'controls': 0,
        'loop': 1,
        'playlist': 'EmGj_k1fE5A',
        'playsinline': 1
      },
      events: {
        'onReady': () => { isYtReady = true; },
        'onStateChange': (event) => {
          if (event.data === 1) { // PLAYING
            isMusicPlaying = true;
            updateMusicBtnUI(true);
          } else if (event.data === 2) { // PAUSED
            isMusicPlaying = false;
            updateMusicBtnUI(false);
          }
        }
      }
    });
  } catch (e) {
    console.log("YT player init exception:", e);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initMemoryCounter();
  initAudioEngine();
  initTouchOverlay();
  initSlideshowEngine();
  initCakeCandles();
  initEnvelopeLetter();
  initBalloons();
  initHeartReactions();
  initMobileSwipe();
});

/* Touch Overlay Audio Launcher */
function initTouchOverlay() {
  const touchOverlay = document.getElementById('touch-overlay');
  if (!touchOverlay) return;

  function unlockAudioAndStart() {
    startAudioPlayback();
    touchOverlay.style.opacity = '0';
    setTimeout(() => {
      touchOverlay.style.display = 'none';
    }, 500);
    startSlideshow();
  }

  touchOverlay.addEventListener('click', unlockAudioAndStart);
  touchOverlay.addEventListener('touchstart', unlockAudioAndStart, { passive: true });
}

/* Audio Playback Controller */
function initAudioEngine() {
  const musicBtn = document.getElementById('music-toggle-btn');
  const bgAudio = document.getElementById('bg-audio');
  const fileInput = document.getElementById('local-audio-input');

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (isMusicPlaying) {
        stopAudioPlayback();
      } else {
        startAudioPlayback();
      }
    });
  }

  if (fileInput && bgAudio) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        bgAudio.src = URL.createObjectURL(file);
        if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
          try { ytPlayer.pauseVideo(); } catch(err){}
        }
        bgAudio.play();
        isMusicPlaying = true;
        updateMusicBtnUI(true);
      }
    });
  }

  const startSlideshowBtn = document.getElementById('start-slideshow-btn');
  if (startSlideshowBtn) {
    startSlideshowBtn.addEventListener('click', () => {
      const stage = document.getElementById('slideshow-section');
      if (stage) stage.scrollIntoView({ behavior: 'smooth' });
      if (!isMusicPlaying) startAudioPlayback();
      if (!isSlideshowPlaying) startSlideshow();
    });
  }
}

function startAudioPlayback() {
  const bgAudio = document.getElementById('bg-audio');

  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  // 1. HTML5 audio element
  if (bgAudio) {
    bgAudio.volume = 0.85;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isMusicPlaying = true;
        updateMusicBtnUI(true);
        return;
      }).catch(err => {
        console.log("HTML5 Audio play catch, trying YouTube:", err);
        tryYouTubeOrSynth();
      });
    } else {
      tryYouTubeOrSynth();
    }
  } else {
    tryYouTubeOrSynth();
  }
}

function tryYouTubeOrSynth() {
  if (ytPlayer && isYtReady && typeof ytPlayer.playVideo === 'function') {
    try {
      ytPlayer.playVideo();
      isMusicPlaying = true;
      updateMusicBtnUI(true);
      return;
    } catch (e) {
      console.log("YT Player play error:", e);
    }
  }
  startSynthMelody();
}

function stopAudioPlayback() {
  if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
    try { ytPlayer.pauseVideo(); } catch(e){}
  }
  const bgAudio = document.getElementById('bg-audio');
  if (bgAudio) bgAudio.pause();
  if (synthInterval) clearInterval(synthInterval);
  isMusicPlaying = false;
  updateMusicBtnUI(false);
}

function updateMusicBtnUI(playing) {
  const musicBtn = document.getElementById('music-toggle-btn');
  if (!musicBtn) return;
  if (playing) {
    musicBtn.classList.add('playing');
    musicBtn.querySelector('i').className = 'bi bi-pause-fill';
  } else {
    musicBtn.classList.remove('playing');
    musicBtn.querySelector('i').className = 'bi bi-play-fill';
  }
}

/* Synthesized Chords Backup */
function startSynthMelody() {
  if (synthInterval) clearInterval(synthInterval);
  isMusicPlaying = true;
  updateMusicBtnUI(true);

  const chords = [
    [261.63, 329.63, 392.00],
    [246.94, 329.63, 392.00],
    [261.63, 349.23, 440.00],
    [261.63, 349.23, 415.30]
  ];
  let chordIdx = 0;

  function playChordStep() {
    if (!audioCtx) return;
    const currentChord = chords[chordIdx % chords.length];
    chordIdx++;

    currentChord.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.08);

      gain.gain.setValueAtTime(0.01, audioCtx.currentTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + i * 0.08 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.08 + 1.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime + i * 0.08);
      osc.stop(audioCtx.currentTime + i * 0.08 + 1.9);
    });
  }

  playChordStep();
  synthInterval = setInterval(playChordStep, 1800);
}

/* --------------------------------------------------------------------------
   2. 60FPS Silk-Smooth Photo Crossfade Engine
   -------------------------------------------------------------------------- */
function initSlideshowEngine() {
  const dotsContainer = document.getElementById('slideshow-dots');
  const prevBtn = document.getElementById('prev-slide-btn');
  const nextBtn = document.getElementById('next-slide-btn');
  const togglePlayBtn = document.getElementById('toggle-play-btn');

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slidesData.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `slide-dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => jumpToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      if (isSlideshowPlaying) startSlideshow();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      if (isSlideshowPlaying) startSlideshow();
    });
  }
  if (togglePlayBtn) {
    togglePlayBtn.addEventListener('click', () => {
      if (isSlideshowPlaying) {
        stopSlideshow();
      } else {
        startSlideshow();
      }
    });
  }

  showSlide(0);
}

function showSlide(index) {
  currentSlideIdx = (index + slidesData.length) % slidesData.length;
  const slide = slidesData[currentSlideIdx];

  const imgA = document.getElementById('slideshow-img-a');
  const imgB = document.getElementById('slideshow-img-b');
  const badgeEl = document.getElementById('slideshow-badge');
  const quoteEl = document.getElementById('slideshow-quote-text');
  const progressEl = document.getElementById('slideshow-progress');
  const dots = document.querySelectorAll('.slide-dot');

  if (imgA && imgB) {
    if (activeLayer === 'a') {
      imgB.src = slide.img;
      imgB.classList.add('active-slide');
      imgA.classList.remove('active-slide');
      activeLayer = 'b';
    } else {
      imgA.src = slide.img;
      imgA.classList.add('active-slide');
      imgB.classList.remove('active-slide');
      activeLayer = 'a';
    }
  }

  if (badgeEl) badgeEl.innerText = `Memory ${currentSlideIdx + 1} of ${slidesData.length}`;
  if (quoteEl) {
    quoteEl.style.opacity = '0';
    setTimeout(() => {
      quoteEl.innerText = slide.quote;
      quoteEl.style.opacity = '1';
    }, 200);
  }

  if (progressEl) {
    const pct = ((currentSlideIdx + 1) / slidesData.length) * 100;
    progressEl.style.width = pct + '%';
  }

  dots.forEach((dot, idx) => {
    if (idx === currentSlideIdx) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function nextSlide() { showSlide(currentSlideIdx + 1); }
function prevSlide() { showSlide(currentSlideIdx - 1); }

function jumpToSlide(idx) {
  showSlide(idx);
  if (isSlideshowPlaying) startSlideshow();
  const stage = document.getElementById('slideshow-section');
  if (stage) stage.scrollIntoView({ behavior: 'smooth' });
}

function startSlideshow() {
  if (slideshowTimer) clearInterval(slideshowTimer);
  isSlideshowPlaying = true;
  const togglePlayBtn = document.getElementById('toggle-play-btn');
  if (togglePlayBtn) togglePlayBtn.innerHTML = '<i class="bi bi-pause-fill"></i> Pause';

  slideshowTimer = setInterval(() => {
    nextSlide();
  }, 4800);
}

function stopSlideshow() {
  isSlideshowPlaying = false;
  if (slideshowTimer) clearInterval(slideshowTimer);
  const togglePlayBtn = document.getElementById('toggle-play-btn');
  if (togglePlayBtn) togglePlayBtn.innerHTML = '<i class="bi bi-play-fill"></i> Play';
}

/* Touch Swipe Gestures */
function initMobileSwipe() {
  const container = document.getElementById('slideshow-image-wrapper');
  if (!container) return;

  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 40) {
      nextSlide();
      if (isSlideshowPlaying) startSlideshow();
    }
    if (touchEndX > touchStartX + 40) {
      prevSlide();
      if (isSlideshowPlaying) startSlideshow();
    }
  }, { passive: true });
}

/* Live Memory Counter */
function initMemoryCounter() {
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  function updateClock() {
    const now = new Date();
    const diffMs = now - startDate;

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24) + (days * 24);
    const mins = Math.floor((diffMs / (1000 * 60)) % 60);
    const secs = Math.floor((diffMs / 1000) % 60);

    const elDays = document.getElementById('cnt-days');
    const elHours = document.getElementById('cnt-hours');
    const elMins = document.getElementById('cnt-mins');
    const elSecs = document.getElementById('cnt-secs');

    if (elDays) elDays.innerText = '365';
    if (elHours) elHours.innerText = hours.toLocaleString();
    if (elMins) elMins.innerText = mins < 10 ? '0' + mins : mins;
    if (elSecs) elSecs.innerText = secs < 10 ? '0' + secs : secs;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* Cake & Confetti */
function initCakeCandles() {
  const blowBtn = document.getElementById('blow-candles-btn');
  const flames = document.querySelectorAll('.flame');
  const wishBox = document.getElementById('wish-reveal-box');

  if (!blowBtn) return;

  blowBtn.addEventListener('click', () => {
    flames.forEach(f => f.classList.add('extinguished'));
    triggerConfettiExplosion();
    if (wishBox) wishBox.style.display = 'block';

    blowBtn.innerHTML = '<i class="bi bi-stars"></i> Wish Granted! Happy Birthday Ashu! ❤️';
    blowBtn.style.background = 'linear-gradient(135deg, #FFD700, #FF3385)';
    blowBtn.style.color = '#000';
    blowBtn.disabled = true;
  });
}

function triggerConfettiExplosion() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettis = [];
  const colors = ['#FF3385', '#9D4EDD', '#FFD700', '#FF85A1', '#00F5D4', '#FFF'];

  for (let i = 0; i < 90; i++) {
    confettis.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 14,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1
    });
  }

  let frame = 0;
  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettis.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3;
      p.opacity -= 0.009;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      ctx.restore();
    });

    frame++;
    if (frame < 110) {
      requestAnimationFrame(renderConfetti);
    } else {
      if (canvas.parentNode) document.body.removeChild(canvas);
    }
  }

  renderConfetti();
}

/* Typewriter Letter */
function initEnvelopeLetter() {
  const envelopeBtn = document.getElementById('open-envelope-btn');
  const letterPaper = document.getElementById('letter-paper');
  const letterTextEl = document.getElementById('typewriter-text');

  if (!envelopeBtn || !letterPaper || !letterTextEl) return;

  const fullText = `Dearest Ashu,

As I look back over the past 365 days, my heart fills with endless joy and gratitude. Thank you for being with me for a whole year — for being my companion through every laughter, my comfort during tough times, and the sweetest part of every single day.

You have brought so much light, warmth, and magic into my life. Every smile of yours makes my world brighter, and every moment with you is a memory I treasure forever.

On your special day, I want to promise you that my love for you will only grow stronger with each passing day. Happy Birthday, my beautiful girl! Here’s to 1 year of us, and to a lifetime of love ahead.`;

  let isTyped = false;

  envelopeBtn.addEventListener('click', () => {
    letterPaper.style.display = 'block';
    letterPaper.scrollIntoView({ behavior: 'smooth' });

    if (!isTyped) {
      isTyped = true;
      let idx = 0;
      letterTextEl.innerHTML = '';
      const timer = setInterval(() => {
        letterTextEl.innerHTML += fullText.charAt(idx);
        idx++;
        if (idx >= fullText.length) clearInterval(timer);
      }, 25);
    }
  });
}

/* Balloons & Heart Reactions */
function initBalloons() {
  const container = document.getElementById('balloon-container');
  if (!container) return;

  const msgs = ["You make my heart melt! 💕", "365 Days of Magic ✨", "My Favorite Person! 👑", "Forever & Always Yours ❤️"];
  const colors = ['#FF3385', '#9D4EDD', '#FF66B2', '#FF85A1'];

  function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'floating-balloon';
    const color = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.background = `radial-gradient(circle at 30% 30%, #FFF, ${color})`;
    balloon.style.left = Math.random() * 85 + 5 + '%';
    balloon.innerText = '🎈';

    balloon.addEventListener('click', (e) => {
      e.stopPropagation();
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      showPopToast(e.clientX, e.clientY, msg);
      balloon.remove();
    });

    container.appendChild(balloon);
    setTimeout(() => { if (balloon.parentNode) balloon.remove(); }, 9000);
  }

  setInterval(createBalloon, 2000);
}

function showPopToast(x, y, message) {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.left = x + 'px';
  toast.style.top = y + 'px';
  toast.style.transform = 'translate(-50%, -50%)';
  toast.style.background = 'rgba(255, 51, 133, 0.95)';
  toast.style.color = '#FFF';
  toast.style.padding = '8px 16px';
  toast.style.borderRadius = '30px';
  toast.style.fontSize = '0.85rem';
  toast.style.fontWeight = '600';
  toast.style.zIndex = '9999';
  toast.style.transition = 'all 1s ease';

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.transform = 'translate(-50%, -80px)';
    toast.style.opacity = '0';
  }, 50);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 1000);
}

function initHeartReactions() {
  document.querySelectorAll('.heart-react-btn').forEach(btn => {
    let count = Math.floor(Math.random() * 20) + 50;
    const countSpan = btn.querySelector('.heart-count');
    if (countSpan) countSpan.innerText = count;

    btn.addEventListener('click', (e) => {
      count++;
      if (countSpan) countSpan.innerText = count;

      const heart = document.createElement('span');
      heart.innerText = '💖';
      heart.style.position = 'fixed';
      heart.style.left = e.clientX + 'px';
      heart.style.top = e.clientY + 'px';
      heart.style.fontSize = '1.3rem';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '9999';
      heart.style.transition = 'all 1s ease-out';
      document.body.appendChild(heart);

      setTimeout(() => {
        heart.style.transform = 'translateY(-50px) scale(1.3)';
        heart.style.opacity = '0';
      }, 50);
      setTimeout(() => { if (heart.parentNode) heart.remove(); }, 1000);
    });
  });
}
