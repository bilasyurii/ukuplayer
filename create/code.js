const song = new Song();
const DEBUG = true;

$(document).ready(() => {
  UKU.injectVideoJs().then(() => {
    videojs($('#ukuVideo')[0]);
  });

  const createSongContainer = $('.create-song-container');
  const setupSongContainer = $('.setup-song-container');

  setupSongContainer.hide();

  $('#continueBtn').click(() => {
    song.artist = UKU.inputVal('artist');
    song.title = UKU.inputVal('title');
    song.link = UKU.inputVal('link');

    createSongContainer.hide();
    setupSongContainer.show();
  });

  if (DEBUG) {
    createSongContainer.hide();
    setupSongContainer.show();
  }
});
