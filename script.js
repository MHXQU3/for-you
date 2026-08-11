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
  const progressBar = document.getElementById('now-playing-progress-bar');
  let activePlayButtons = [];

  function playSong(src, title, triggerBtn){
    if(!src) return;
    playlist = null; // any direct single-song play cancels playlist mode
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

  /* ---------- playlist mode (used by the game's rotating songs) ---------- */
  let playlist = null; // { tracks: [{src,title}], index }

  function playPlaylist(tracks){
    const list = (tracks || []).filter(t => t && t.src);
    if(!list.length) return;
    playlist = { tracks: list, index: 0 };
    playPlaylistTrack();
  }
  function playPlaylistTrack(){
    if(!playlist) return;
    const track = playlist.tracks[playlist.index];
    try{
      audioEl.src = track.src;
      audioEl.play().catch(() => {
        nowPlayingTitle.textContent = `Add "${track.src.split('/').pop()}" to assets/audio to hear this`;
      });
      nowPlayingTitle.textContent = track.title || '';
      nowPlaying.classList.add('is-active');
    } catch(err){ console.error('[site error] playPlaylistTrack:', err); }
  }

  function resetPlayButtons(){
    activePlayButtons.forEach(b => b.classList.remove('is-playing'));
    activePlayButtons = [];
  }
  audioEl.addEventListener('ended', () => {
    if(playlist){
      playlist.index = (playlist.index + 1) % playlist.tracks.length;
      playPlaylistTrack();
      return;
    }
    resetPlayButtons();
    nowPlaying.classList.remove('is-active');
  });
  audioEl.addEventListener('timeupdate', () => {
    if(audioEl.duration){
      progressBar.style.width = ((audioEl.currentTime / audioEl.duration) * 100) + '%';
    }
  });
  audioEl.addEventListener('loadstart', () => { progressBar.style.width = '0%'; });
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

      if(!gameMusicStarted && Array.isArray(cfg.gameSongs) && cfg.gameSongs.length){
        gameMusicStarted = true;
        playPlaylist(cfg.gameSongs);
      } else if(!gameMusicStarted && cfg.gameSong){
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

  /* ---------- notes jar ---------- */
  safe('jar', () => {
    const moodsWrap = document.getElementById('jar-moods');
    const songWrap = document.getElementById('jar-mood-song');
    const jarBtn = document.getElementById('jar-container');
    const tapLabel = document.getElementById('jar-tap-label');
    const drawnNoteEl = document.getElementById('jar-drawn-note');
    const moods = Array.isArray(cfg.notesJar && cfg.notesJar.moods) ? cfg.notesJar.moods : [];

    let activeId = moods.length ? moods[0].id : null;
    let remainingNotes = [];

    function shuffle(arr){
      const a = arr.slice();
      for(let i = a.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function renderMoods(){
      moodsWrap.innerHTML = '';
      moods.forEach((mood) => {
        const btn = document.createElement('button');
        btn.className = 'jar-mood' + (mood.id === activeId ? ' is-active' : '');
        btn.type = 'button';
        btn.textContent = mood.label || mood.id || 'Notes';
        btn.addEventListener('click', () => {
          activeId = mood.id;
          renderMoods();
          selectMood(mood, true);
        });
        moodsWrap.appendChild(btn);
      });
    }

    function renderMoodSong(mood){
      songWrap.innerHTML = '';
      if(!mood.song && !mood.songTitle) return null;
      const row = document.createElement('div');
      row.className = 'memory-song';
      row.innerHTML = `
        <span class="song-title">${mood.songTitle || ''}</span>
        <button class="song-play" aria-label="Play ${mood.songTitle || 'song'}">${playIcon()}</button>
      `;
      songWrap.appendChild(row);
      const btn = row.querySelector('.song-play');
      if(btn){
        btn.addEventListener('click', (e) => playSong(mood.song, mood.songTitle, e.currentTarget));
      }
      return btn;
    }

    function selectMood(mood, autoplay){
      const songBtn = renderMoodSong(mood);
      remainingNotes = shuffle(Array.isArray(mood.notes) ? mood.notes : []);
      drawnNoteEl.classList.remove('is-visible');
      drawnNoteEl.textContent = '';
      tapLabel.textContent = remainingNotes.length ? 'tap the jar' : 'no notes yet';
      jarBtn.disabled = !remainingNotes.length;
      if(autoplay && songBtn && mood.song){
        playSong(mood.song, mood.songTitle, songBtn);
      }
    }

    jarBtn.addEventListener('click', () => {
      const mood = moods.find(m => m.id === activeId);
      if(!mood) return;
      if(!remainingNotes.length){
        remainingNotes = shuffle(Array.isArray(mood.notes) ? mood.notes : []);
        if(!remainingNotes.length) return;
      }
      const note = remainingNotes.pop();
      tapLabel.textContent = remainingNotes.length ? remainingNotes.length + ' left in the jar' : 'that\'s all of them — tap for more';
      jarBtn.classList.add('is-shaking');
      drawnNoteEl.classList.remove('is-visible');
      setTimeout(() => {
        jarBtn.classList.remove('is-shaking');
        drawnNoteEl.textContent = note;
        drawnNoteEl.classList.add('is-visible');
      }, 350);
    });

    if(moods.length){
      renderMoods();
      selectMood(moods[0]);
    }
  });

  /* ---------- time together counter ---------- */
  safe('counter', () => {
    const grid = document.getElementById('time-counter-grid');
    const cfgStart = cfg.togetherSince;
    const start = cfgStart
      ? new Date(cfgStart.year, cfgStart.month - 1, cfgStart.day, cfgStart.hour || 0, cfgStart.minute || 0, 0)
      : null;
    if(!start || isNaN(start.getTime())) return;

    const units = [
      { key: 'years',   label: 'Years' },
      { key: 'months',  label: 'Months' },
      { key: 'days',    label: 'Days' },
      { key: 'hours',   label: 'Hrs' },
      { key: 'minutes', label: 'Min' },
      { key: 'seconds', label: 'Sec' }
    ];
    grid.innerHTML = units.map(u =>
      `<div class="time-unit"><span class="time-unit-value" id="tu-${u.key}">0</span><span class="time-unit-label">${u.label}</span></div>`
    ).join('');

    function diff(){
      const now = new Date();
      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();
      let hours = now.getHours() - start.getHours();
      let minutes = now.getMinutes() - start.getMinutes();
      let seconds = now.getSeconds() - start.getSeconds();
      if(seconds < 0){ seconds += 60; minutes--; }
      if(minutes < 0){ minutes += 60; hours--; }
      if(hours < 0){ hours += 24; days--; }
      if(days < 0){
        const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonthLastDay;
        months--;
      }
      if(months < 0){ months += 12; years--; }
      return { years, months, days, hours, minutes, seconds };
    }

    function pad(n){ return String(n).padStart(2, '0'); }

    function tick(){
      const d = diff();
      const setVal = (key, val) => { const el = document.getElementById('tu-' + key); if(el) el.textContent = val; };
      setVal('years', d.years);
      setVal('months', d.months);
      setVal('days', d.days);
      setVal('hours', pad(d.hours));
      setVal('minutes', pad(d.minutes));
      setVal('seconds', pad(d.seconds));
    }
    tick();
    setInterval(tick, 1000);
  });

  /* ---------- passcode gate ---------- */
  safe('gate', () => {
    const overlay = document.getElementById('gate-overlay');
    const catEl = document.getElementById('gate-cat');
    const msgEl = document.getElementById('gate-message');
    const dotsWrap = document.getElementById('gate-dots');
    const keypadWrap = document.getElementById('gate-keypad');

    const code = String(cfg.accessCode || '');
    const messages = cfg.gateMessages || {};
    let entered = '';

    if(!code){
      overlay.style.display = 'none';
      document.body.classList.remove('is-locked');
      return;
    }

    function renderDots(){
      dotsWrap.innerHTML = '';
      for(let i = 0; i < code.length; i++){
        const dot = document.createElement('span');
        dot.className = 'gate-dot' + (i < entered.length ? ' is-filled' : '');
        dotsWrap.appendChild(dot);
      }
    }

    function resetAfterWrong(){
      catEl.classList.add('is-shaking');
      dotsWrap.classList.add('is-shaking');
      setTimeout(() => {
        catEl.classList.remove('is-shaking');
        dotsWrap.classList.remove('is-shaking');
        entered = '';
        renderDots();
        msgEl.textContent = messages.hint || 'enter our special day';
        catEl.textContent = '🐱';
      }, 900);
    }

    function checkCode(){
      if(entered === code){
        catEl.textContent = '😻';
        msgEl.textContent = messages.success || 'WELCOME TO YOUR GIFT MY BABY';
        setTimeout(() => {
          overlay.classList.add('is-unlocking');
          document.body.classList.remove('is-locked');
          setTimeout(() => { overlay.style.display = 'none'; }, 700);
        }, 1100);
      } else {
        catEl.textContent = '😿';
        msgEl.textContent = messages.error || "you forgot our special day?";
        resetAfterWrong();
      }
    }

    function addDigit(d){
      if(entered.length >= code.length) return;
      entered += d;
      renderDots();
      if(entered.length === code.length){
        setTimeout(checkCode, 200);
      }
    }
    function backspace(){
      entered = entered.slice(0, -1);
      renderDots();
    }

    keypadWrap.innerHTML = '';
    const keys = ['1','2','3','4','5','6','7','8','9','clear','0','back'];
    keys.forEach((k) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      if(k === 'clear'){
        btn.className = 'gate-key gate-key-clear';
        btn.textContent = 'clear';
        btn.addEventListener('click', () => { entered = ''; renderDots(); });
      } else if(k === 'back'){
        btn.className = 'gate-key gate-key-clear';
        btn.textContent = '⌫';
        btn.addEventListener('click', backspace);
      } else {
        btn.className = 'gate-key';
        btn.textContent = k;
        btn.addEventListener('click', () => addDigit(k));
      }
      keypadWrap.appendChild(btn);
    });

    msgEl.textContent = messages.hint || 'enter our special day';
    renderDots();
  });

  /* ---------- bouquet ---------- */
  safe('bouquet', () => {
    const trigger = document.getElementById('bouquet-trigger');
    const emojiEl = document.getElementById('bouquet-emoji');
    const modal = document.getElementById('bouquet-modal');
    const backdrop = document.getElementById('bouquet-backdrop');
    const closeBtn = document.getElementById('bouquet-close');
    const bigEl = document.getElementById('bouquet-big');
    const envelopeBtn = document.getElementById('bouquet-envelope');
    const hintEl = document.getElementById('bouquet-hint');
    const letterEl = document.getElementById('bouquet-letter');

    const bouquetCfg = cfg.bouquet || {};
    const varieties = Array.isArray(bouquetCfg.varieties) && bouquetCfg.varieties.length
      ? bouquetCfg.varieties
      : [];
    const chosen = varieties.length ? varieties[Math.floor(Math.random() * varieties.length)] : '';

    function setBouquetImage(imgEl, src){
      if(!src) return;
      imgEl.src = src;
      imgEl.alt = 'Your bouquet';
      imgEl.onerror = () => {
        imgEl.onerror = null;
        imgEl.classList.add('placeholder');
        imgEl.removeAttribute('src');
        imgEl.alt = 'Add ' + src.split('/').pop();
      };
    }
    setBouquetImage(emojiEl, chosen);
    setBouquetImage(bigEl, chosen);

    const paragraphs = Array.isArray(bouquetCfg.letter) ? bouquetCfg.letter : [];
    letterEl.textContent = paragraphs.join('\n\n');

    function openModal(){ modal.classList.add('is-active'); }
    function closeModal(){ modal.classList.remove('is-active'); }
    trigger.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    envelopeBtn.addEventListener('click', () => {
      if(envelopeBtn.classList.contains('is-open')) return;
      envelopeBtn.classList.add('is-open');
      hintEl.classList.add('is-hidden');
      letterEl.classList.add('is-visible');
      playSong(bouquetCfg.song, bouquetCfg.songTitle, null);
    });
  });

  /* ---------- wishing sky ---------- */
  safe('wishes', () => {
    const skyEl = document.getElementById('wishes-sky');
    const twinklesEl = document.getElementById('sky-twinkles');
    const hintEl = document.getElementById('wishes-hint');

    const wishModal = document.getElementById('wish-modal');
    const wishTitleEl = document.getElementById('wish-title');
    const wishTextEl = document.getElementById('wish-text');
    const wishCloseBtn = document.getElementById('wish-close');
    const wishBackdrop = document.getElementById('wish-backdrop');

    const completeModal = document.getElementById('wish-complete-modal');
    const completeTextEl = document.getElementById('wish-complete-text');
    const completeCloseBtn = document.getElementById('wish-complete-close');
    const completeBackdrop = document.getElementById('wish-complete-backdrop');

    const skyCfg = cfg.wishingSky || {};
    const wishes = Array.isArray(skyCfg.wishes) ? skyCfg.wishes : [];
    completeTextEl.textContent = skyCfg.completeMessage ||
      "You found all my wishes for you on this gift ❤️";

    // ambient background twinkle dots
    for(let i = 0; i < 26; i++){
      const t = document.createElement('span');
      t.className = 'sky-twinkle';
      t.style.top = Math.random() * 100 + '%';
      t.style.left = Math.random() * 100 + '%';
      t.style.animationDuration = (2 + Math.random() * 3) + 's';
      t.style.animationDelay = (Math.random() * -4) + 's';
      twinklesEl.appendChild(t);
    }

    // fixed scattered positions (top%, left%) for up to 6 stars
    const positions = [
      { top: 16, left: 14 },
      { top: 12, left: 78 },
      { top: 46, left: 32 },
      { top: 55, left: 68 },
      { top: 80, left: 18 },
      { top: 82, left: 82 }
    ];

    let foundCount = 0;
    let allFoundPending = false;

    function closeWishModal(){
      wishModal.classList.remove('is-active');
      if(allFoundPending){
        allFoundPending = false;
        setTimeout(() => { completeModal.classList.add('is-active'); }, 450);
      }
    }
    function closeCompleteModal(){
      completeModal.classList.remove('is-active');
    }
    wishCloseBtn.addEventListener('click', closeWishModal);
    wishBackdrop.addEventListener('click', closeWishModal);
    completeCloseBtn.addEventListener('click', closeCompleteModal);
    completeBackdrop.addEventListener('click', closeCompleteModal);

    wishes.forEach((wish, i) => {
      const pos = positions[i % positions.length];
      const starBtn = document.createElement('button');
      starBtn.type = 'button';
      starBtn.className = 'wish-star';
      starBtn.style.top = pos.top + '%';
      starBtn.style.left = pos.left + '%';
      starBtn.style.animationDelay = (Math.random() * -2.6) + 's';
      starBtn.setAttribute('aria-label', wish.title || 'A wish for you');
      starBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.9L22 9.6l-5.5 4.8L18 22l-6-3.7L6 22l1.5-7.6L2 9.6l7.1-.7L12 2z" fill="currentColor"/></svg>`;

      starBtn.addEventListener('click', () => {
        if(!starBtn.classList.contains('is-found')){
          starBtn.classList.add('is-found');
          foundCount++;
          hintEl.textContent = foundCount < wishes.length
            ? foundCount + ' of ' + wishes.length + ' found'
            : 'all found ✨';
          if(foundCount === wishes.length){ allFoundPending = true; }
        }
        wishTitleEl.textContent = wish.title || '';
        wishTextEl.textContent = wish.text || '';
        wishModal.classList.add('is-active');
      });

      skyEl.appendChild(starBtn);
    });
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
