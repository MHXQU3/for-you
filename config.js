/* ============================================================
   EDIT THIS FILE — everything personal lives here.
   You don't need to touch any other file to customize the site.
   ============================================================ */

const SITE_CONFIG = {

  // ---- Hero section ----
  herNames: "Us",              // e.g. "Sarah & Tom" — shown big on the landing screen
  heroLine: "one year of you",  // small line under the names
  heroDate: "for your birthday",

  // ---- The timeline of memories ----
  // Add, remove, or reorder as many of these as you like.
  // image: path to a photo in assets/images/memories/
  // song / songTitle: path to an mp3 in assets/audio/ and the display name
  memories: [
    {
      date: "The beginning",
      title: "The day we met",
      caption: "Replace this with the story of how it started — where you were, what you noticed first, how it felt.",
      image: "assets/images/memories/memory-1.jpg",
      song: "assets/audio/song-1.mp3",
      songTitle: "Song title — Artist"
    },
    {
      date: "A little later",
      title: "The first time I knew",
      caption: "Write about the moment you realized this was something special.",
      image: "assets/images/memories/memory-2.jpg",
      song: "assets/audio/song-2.mp3",
      songTitle: "Song title — Artist"
    },
    {
      date: "Somewhere in between",
      title: "Our little adventure",
      caption: "A trip, a random Tuesday, a place you both keep talking about.",
      image: "assets/images/memories/memory-3.jpg",
      song: "assets/audio/song-3.mp3",
      songTitle: "Song title — Artist"
    },
    {
      date: "A quiet moment",
      title: "Just an ordinary day",
      caption: "Sometimes the small, quiet days are the ones worth keeping.",
      image: "assets/images/memories/memory-4.jpg",
      song: "assets/audio/song-4.mp3",
      songTitle: "Song title — Artist"
    },
    {
      date: "More recently",
      title: "Where we are now",
      caption: "Something about who you both are together today.",
      image: "assets/images/memories/memory-5.jpg",
      song: "assets/audio/song-5.mp3",
      songTitle: "Song title — Artist"
    },
    {
      date: "Looking ahead",
      title: "Everything still to come",
      caption: "A note about the future you're looking forward to with her.",
      image: "assets/images/memories/memory-6.jpg",
      song: "assets/audio/song-6.mp3",
      songTitle: "Song title — Artist"
    }
  ],

  // ---- The envelope letter ----
  // Write it as a LIST of paragraphs — one pair of quotes "..." per paragraph,
  // with a comma after each one (except the last). This is the safest way to
  // edit it by hand: you can't accidentally break the code with punctuation,
  // apostrophes, or quotation marks inside your text.
  letter: {
    songBehind: "assets/audio/letter-song.mp3",
    songTitle: "Song title — Artist",
    body: [
      "My love,",
      "Write your letter here. This is the heart of the whole site, so take your time with it — say the thing you don't always say out loud.",
      "Tell her what this year has meant. Tell her what you noticed about her that surprised you. Tell her what you're grateful for.",
      "Happy birthday. I love you.",
      "— [Your name]"
    ]
  },

  // ---- Memory matching game ----
  // Needs exactly 6 photos — each will appear twice as a matching pair.
  gamePhotos: [
    "assets/images/game/game-1.jpg",
    "assets/images/game/game-2.jpg",
    "assets/images/game/game-3.jpg",
    "assets/images/game/game-4.jpg",
    "assets/images/game/game-5.jpg",
    "assets/images/game/game-6.jpg"
  ],
  gameSong: "assets/audio/game-song.mp3",
  gameSongTitle: "Song title — Artist"
};
