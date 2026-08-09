/* ============================================================
   No need to edit this file — all personal content lives in
   config.js. This just wires everything up.

   Each section below is wrapped in its own try/catch, so if one
   part has a problem (e.g. a typo in config.js) the rest of the
   page still works. Check the browser console (F12) for any
   red [site error] messages if something looks off.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const cfg = window.SITE_CONFIG || {};

  function safe(label, fn){
    try { fn(); }
    catch (err) { console.error('[site error] ' + label + ':', err); }
  }

  /* ---------- petals ---------- */
  safe('petals', () => {
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
  });

  /* ---------- hero ---------- */
  safe('hero', () => {
    document.getElementById('hero-eyebrow').textContent = cfg.heroLine || '';
    document.getElementById('hero-title').textContent = cfg.herNames || 'Us';
    document.getElementById('hero-sub').textContent = cfg.heroDate || '';
    document.getElementById('scroll-cue').addEventListener('click', () => {
      document.getElementById('timeline').scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- shared audio player ---------- */
  const audioEl = new Audio();
  const nowPlaying = document.getElementById('now-playing');
  const nowPlayingTitle = document.getElementById('now-playing-title');
  const nowPlayingPause = document.getElementById('now-playing-pause');
  let activePlayButtons = [];

  function playSong(src, title, triggerBtn){
    if(!src) return;
    try{
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
      nowPlayingTitle.textContent = title || '';
      nowPlaying.classList.add('is-active');
    } catch(err){ console.error('[site error] playSong:', err); }
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
  safe('timeline', () => {
    const track = document.getElementById('timeline-track');
    const memories = Array.isArray(cfg.memories) ? cfg.memories : [];
    memories.forEach((m, idx) => {
      try {
        const row = document.createElement('div');
        row.className = 'memory reveal';
        row.innerHTML = `
          <div class="memory-dot"></div>
          <div class="memory-card">
            <span class="memory-date">${m.date || ''}</span>
            <div class="memory-song">
              <span class="song-title">${m.songTitle || ''}</span>
              <button class="song-play" aria-label="Play ${m.songTitle || 'song'}">${playIcon()}</button>
            </div>
            <img class="memory-photo" src="${m.image || ''}" alt="${m.title || ''}"
                 onerror="this.onerror=null;this.classList.add('placeholder');this.removeAttribute('src');this.textContent='Add ${(m.image||'').split('/').pop()}';">
            <h3 class="memory-title">${m.title || ''}</h3>
            <p class="memory-caption">${m.caption || ''}</p>
          </div>
        `;
        track.appendChild(row);
        const playBtn = row.querySelector('.song-play');
        if(playBtn){
          playBtn.addEventListener('click', (e) => {
            playSong(m.song, m.songTitle, e.currentTarget);
          });
        }
        observeReveal(row);
      } catch(err){
        console.error('[site error] memory #' + (idx + 1) + ' (' + (m && m.title) + '):', err);
      }
    });
  });

  /* ---------- envelope + letter ---------- */
  safe('envelope', () => {
    const envelope = document.getElementById('envelope');
    const modal = document.getElementById('letter-modal');
    const letterBody = document.getElementById('letter-body');
    const letterSongTag = document.getElementById('letter-song-tag');

    const letterCfg = cfg.letter || {};
    const paragraphs = Array.isArray(letterCfg.body) ? letterCfg.body : [String(letterCfg.body || '')];
    const letterText = paragraphs.join('\n\n').trim();
    letterBody.textContent = letterText || 'Your letter isn\'t showing up here — check that config.js was saved and uploaded with your text in it, then hard-refresh this page (Ctrl+Shift+R / Cmd+Shift+R).';
    letterSongTag.textContent = letterCfg.songTitle ? ('♫ ' + letterCfg.songTitle) : '';

    envelope.addEventListener('click', () => {
      envelope.classList.add('is-open');
      setTimeout(() => {
        modal.classList.add('is-active');
        playSong(letterCfg.songBehind, letterCfg.songTitle, null);
      }, 550);
    });

    function closeLetter(){
      modal.classList.remove('is-active');
      envelope.classList.remove('is-open');
    }
    document.getElementById('letter-close').addEventListener('click', closeLetter);
    document.getElementById('letter-backdrop').addEventListener('click', closeLetter);
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeLetter(); });
  });

  /* ---------- memory matching game ---------- */
  safe('game', () => {
    const board = document.getElementById('game-board');
    const movesEl = document.getElementById('game-moves');
    const winEl = document.getElementById('game-win');
    const resetBtn = document.getElementById('game-reset');
    const gamePhotos = Array.isArray(cfg.gamePhotos) && cfg.gamePhotos.length ? cfg.gamePhotos : [
      'assets/images/game/game-1.jpg','assets/images/game/game-2.jpg','assets/images/game/game-3.jpg',
      'assets/images/game/game-4.jpg','assets/images/game/game-5.jpg','assets/images/game/game-6.jpg',
      'assets/images/game/game-7.jpg','assets/images/game/game-8.jpg'
    ];

    let moves = 0, flipped = [], matchedCount = 0, lock = false, gameMusicStarted = false;

    function shuffledDeck(){
      const deck = gamePhotos.concat(gamePhotos).map((src) => ({ src, key: src }));
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
          if(matchedCount === gamePhotos.length * 2){
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
  });

  /* ---------- scroll reveal ---------- */
  let io;
  try {
    io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
  } catch(err){ console.error('[site error] IntersectionObserver:', err); }

  function observeReveal(el){
    if(io){ io.observe(el); }
    else { el.classList.add('is-visible'); } // fallback: just show it
  }

  // Always reveal every .reveal element that already exists in the HTML,
  // no matter what happened above.
  safe('reveal-static', () => {
    document.querySelectorAll('.reveal').forEach(el => observeReveal(el));
  });

  // Safety net: if anything is still invisible 4 seconds after load
  // (e.g. IntersectionObserver never fired for some reason), just show it.
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => el.classList.add('is-visible'));
  }, 4000);
});
