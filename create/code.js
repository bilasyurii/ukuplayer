const DEBUG = true;

const song = new Song();

let player;

const markers = [];
let selectedMarker = null;

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
      onMarkerClick: (data) => {
        onMarkerClicked(data.marker);
      },
    });

    if (DEBUG) {
      player.one('play', () => {
        createMarker(20, 'Kek');
        createMarker(100, 'Cheburek');
      });
    }
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

  const goToMarker = (marker) => {
    player.currentTime(marker.getTime());
  };

  const hideMarkerControls = () => {
    $('#createMarkerBtn').hide();
    $('#saveMarkerBtn').hide();
    $('#cancelMarkerBtn').hide();
    $('#deleteMarkerBtn').hide();
  }

  const setupMarkerCreation = () => {
    hideMarkerControls();
    $('#createMarkerBtn').show();
    UKU.inputVal('marker_name', '');
  };

  const setupMarkerEditing = () => {
    hideMarkerControls();
    $('#saveMarkerBtn').show();
    $('#cancelMarkerBtn').show();
    $('#deleteMarkerBtn').show();
    UKU.inputVal('marker_name', selectedMarker.getText());
  };

  const deselectMarker = () => {
    if (!selectedMarker) {
      return;
    }

    selectedMarker.button.removeClass('active');
    selectedMarker = null;
    setupMarkerCreation();
  };

  const selectMarker = (marker) => {
    marker.button.addClass('active');
    selectedMarker = marker;
  };

  const deleteMarker = (marker) => {
    if (selectedMarker === marker) {
      selectedMarker = null;
    }

    const index = markers.indexOf(marker);
    markers.splice(index, 1);
    player.markers.remove([index]);
    marker.removeButton();
  };

  const editMarker = (marker) => {
    const isActive = marker.button.hasClass('active');

    deselectMarker();

    if (!isActive) {
      selectMarker(marker);
      setupMarkerEditing();
      goToMarker(selectedMarker);
    }
  };

  const onMarkerClicked = (marker) => {
    editMarker(marker);
  };

  const onMarkerButtonClicked = (button) => {
    editMarker(button.marker);
  };

  const createMarker = (time, text) => {
    const data = {
      time,
      text,
    };
    player.markers.add([data]);

    const button = $(document.createElement('button'));
    button.html(text);
    button.addClass('list-group-item list-group-item-action')
    button.click(() => onMarkerButtonClicked(button))
    $('#markersList').append(button);

    const marker = new Marker();
    marker.data = data;
    marker.button = button;
    markers.push(marker);

    data.marker = marker;
    button.marker = marker;
  };

  $('#createMarkerBtn').click(() => {
    if (!player) {
      return;
    }

    const currentTime = player.currentTime();
    const markerName = UKU.inputVal('marker_name');

    createMarker(currentTime, markerName);
  });

  $('#saveMarkerBtn').click(() => {
    selectedMarker.setText(UKU.inputVal('marker_name'));
  });

  $('#cancelMarkerBtn').click(() => {
    deselectMarker();
  });

  $('#deleteMarkerBtn').click(() => {
    deleteMarker(selectedMarker);
    setupMarkerCreation();
  });

  setupMarkerCreation();

  if (DEBUG) {
    createSongContainer.hide();
    setupSongContainer.show();
  }
});
