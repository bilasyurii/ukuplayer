const DEBUG = true;

const song = new Song();
let player;

$(document).ready(() => {
  UKU.injectVideoJs().then(() => {
    player = videojs($('#ukuVideo')[0]);
    player.seekButtons({
      forward: 1,
      back: 1,
      forwardIndex: 3,
      backIndex: 3,
    });
    player.markers({
      markerStyle: {
        'border-radius': '40%',
        'background-color': '#0d6efd',
      },
      markerTip: {
        display: true,
        text: (marker) => {
          return marker.text;
        },
      },
      onMarkerClick: (marker) => {
        console.log(marker);
      },
      markers: [
        {
          time: 10,
          text: 'test',
        },
      ],
    });
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

  $('#createMarkerBtn').click(() => {
    if (!player) {
      return;
    }

    player.markers.add([
      {
        time: 100,
        text: 'hi)))',
      },
    ])
  });

  if (DEBUG) {
    createSongContainer.hide();
    setupSongContainer.show();
  }
});
