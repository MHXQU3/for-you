/* ============================================================
   No need to edit this file — all personal content lives in
   config.js. This just wires everything up.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const cfg = window.SITE_CONFIG;

  /* ---------- petals ---------- */
  (function petals(){
    const wrap = document.getElementById('petals');
    const count = window.innerWidth < 600 ? 10 : 18;
    for(let i=0;i<count;i++){
      const p = document.createElement('span');
      p.className = 'petal';
      p.textContent = '❀';
      p.style.left = Math.random()*100 + 'vw';
      p.style.setProperty('--drift', (Math.random()*80-40)+'px');
      p.style.fontSize = (10 + Math.random()*10) + 'px';
      p.style.animationDuration = (14 + Math.random()*14) + 's';
      p.style.animationDelay = (Math.random()*-20) + 's';
      wrap.appendChild(p);
    }
  })();

  /* ---------- hero ---------- */
  document.getElementById('hero-eyebrow').textContent = cfg.heroLine;
  document.getElementById('hero-title').textContent = cfg.herNames;
  document.getElementById('hero-sub').textContent = cfg.heroDate;
  document.getElementById('scroll-cue').addEventListener('click', () => {
    document.getElementById('timeline').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- shared audio player ---------- */
  const audioEl = new Audio();
  const nowPlaying = document.getElementById('now-playing');
  const nowPlayingTitle = document.getElementById('now-playing-title');
  const nowPlayingPause = document.getElementById('now-playing-pause');
  let activePlayButtons = [];

  function playSong(src, title, triggerBtn){
    if(audioEl.src.endsWith(src) && !audioEl.paused){
      audioEl.pause();
      resetPlayButtons();
      nowPlaying.classList.remove('is-active');
      return;
    }
    audioEl.src = src;
    audioEl.play().catch(() => {
      nowPlayingTitle.textContent = `Add "${src.split('/').pop()}" to assets/audio to hear this`;
      nowPlaying.classList.add('is-active');
      setTimeout(() => nowPlaying.classList.remove('is-active'), 3500);
    });
    resetPlayButtons();
    if(triggerBtn){ triggerBtn.classList.add('is-playing'); activePlayButtons.push(triggerBtn); }
    nowPlayingTitle.textContent = title;
    nowPlaying.classList.add('is-active');
  }
  function resetPlayButtons(){
    activePlayButtons.forEach(b => b.classList.remove('is-playing'));
    activePlayButtons = [];
  }
  audioEl.addEventListener('ended', () => {
    resetPlayButtons();
    nowPlaying.classList.remove('is-active');
  });
  nowPlayingPause.addEventListener('click', () => {
    if(audioEl.paused){ audioEl.play(); } else { audioEl.pause(); }
  });

  function playIcon(){
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
  }

  /* ---------- timeline ---------- */
  const track = document.getElementById('timeline-track');
  cfg.memories.forEach((m, i) => {
    const row = document.createElement('div');
    row.className = 'memory reveal';
    row.innerHTML = `
      <div class="memory-dot"></div>
      <div class="memory-card">
        <span class="memory-date">${m.date}</span>
        <img class="memory-photo" src="${m.image}" alt="${m.title}"
             onerror="this.onerror=null;this.classList.add('placeholder');this.removeAttribute('src');this.textContent='Add ${m.image.split('/').pop()}';">
        <h3 class="memory-title">${m.title}</h3>
        <p class="memory-caption">${m.caption}</p>
        <div class="memory-song">
          <span class="song-title">${m.songTitle}</span>
          <button class="song-play" aria-label="Play ${m.songTitle}">${playIcon()}</button>
        </div>
      </div>
    `;
    track.appendChild(row);
    row.querySelector('.song-play').addEventListener('click', (e) => {
      playSong(m.song, m.songTitle, e.currentTarget);
    });
  });

  /* ---------- envelope + letter ---------- */
  const envelope = document.getElementById('envelope');
  const modal = document.getElementById('letter-modal');
  const letterBody = document.getElementById('letter-body');
  const letterSongTag = document.getElementById('letter-song-tag');
  letterBody.textContent = cfg.letter.body;
  letterSongTag.textContent = '♫ ' + cfg.letter.songTitle;

  envelope.addEventListener('click', () => {
    envelope.classList.add('is-open');
    setTimeout(() => {
      modal.classList.add('is-active');
      playSong(cfg.letter.songBehind, cfg.letter.songTitle, null);
    }, 550);
  });

  function closeLetter(){
    modal.classList.remove('is-active');
    envelope.classList.remove('is-open');
  }
  document.getElementById('letter-close').addEventListener('click', closeLetter);
  document.getElementById('letter-backdrop').addEventListener('click', closeLetter);
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeLetter(); });

  /* ---------- memory matching game ---------- */
  const board = document.getElementById('game-board');
  const movesEl = document.getElementById('game-moves');
  const winEl = document.getElementById('game-win');
  const resetBtn = document.getElementById('game-reset');

  let moves = 0, flipped = [], matchedCount = 0, lock = false;

  function shuffledDeck(){
    const deck = [...cfg.gamePhotos, ...cfg.gamePhotos]
      .map((src, idx) => ({ src, key: src, uid: idx }));
    for(let i = deck.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  function buildGame(){
    board.innerHTML = '';
    moves = 0; flipped = []; matchedCount = 0; lock = false;
    movesEl.textContent = 'Moves: 0';
    winEl.textContent = '';

    if(cfg.gameSong){
      // subtle: start game music muted-first-interaction friendly, only on first flip
    }

    shuffledDeck().forEach((card) => {
      const btn = document.createElement('button');
      btn.className = 'game-card';
      btn.setAttribute('aria-label', 'Flip card');
      btn.innerHTML = `
        <div class="game-card-inner">
          <div class="game-card-face game-card-back">❀</div>
          <div class="game-card-face game-card-front">
            <img src="${card.src}" alt=""
                 onerror="this.parentElement.classList.add('placeholder');this.remove();this.parentElement.textContent='Add ${card.src.split('/').pop()}';">
          </div>
        </div>`;
      btn.dataset.key = card.key;
      btn.addEventListener('click', () => flipCard(btn));
      board.appendChild(btn);
    });
  }

  let gameMusicStarted = false;
  function flipCard(btn){
    if(lock || btn.classList.contains('is-flipped') || btn.classList.contains('is-matched')) return;

    if(!gameMusicStarted && cfg.gameSong){
      gameMusicStarted = true;
      playSong(cfg.gameSong, cfg.gameSongTitle, null);
    }

    btn.classList.add('is-flipped');
    flipped.push(btn);

    if(flipped.length === 2){
      moves++;
      movesEl.textContent = 'Moves: ' + moves;
      lock = true;
      const [a, b] = flipped;
      if(a.dataset.key === b.dataset.key){
        a.classList.add('is-matched');
        b.classList.add('is-matched');
        matchedCount += 2;
        flipped = [];
        lock = false;
        if(matchedCount === cfg.gamePhotos.length * 2){
          winEl.textContent = 'you found them all 🤍';
        }
      } else {
        setTimeout(() => {
          a.classList.remove('is-flipped');
          b.classList.remove('is-flipped');
          flipped = [];
          lock = false;
        }, 750);
      }
    }
  }

  resetBtn.addEventListener('click', buildGame);
  buildGame();

  /* ---------- scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
});
