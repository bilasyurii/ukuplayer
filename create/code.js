const DEBUG = true;
const MARKERS = 'markers';
const CHORDS = 'chords';

let section = MARKERS;

const song = new Song();

let player;
let playerReady = false;

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

    player.one('play', () => {
      playerReady = true;
      setupSection(section);
    });

    if (DEBUG) {
      const kekMarker = createMarker(20, 'Kek');
      const cheburekMarker = createMarker(100, 'Cheburek');

      addMarkerToUI(kekMarker);
      addMarkerToUI(cheburekMarker);

      markers.push(kekMarker);
      markers.push(cheburekMarker);

      sortMarkers();
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

  $('#sectionTabs').on('show.bs.tab', (e) => {
    const tab = e.target;
    const sectionName = tab.getAttribute('aria-controls');

    switch (sectionName) {
      case MARKERS:
        section = MARKERS;
        break;
      case CHORDS:
        section = CHORDS;
        break;
    }

    setupSection(section);
  });

  const setupSection = (section) => {
    if (!playerReady) {
      return;
    }

    switch (section) {
      case MARKERS:
        setupMarkersSection();
        break;
      case CHORDS:
        setupChordsSection();
        break;
    }
  };

  const removeMarkersFromPlayer = () => {
    if (player) {
      player.markers.removeAll();
    }
  };

  const setupMarkersSection = () => {
    removeMarkersFromPlayer();
    addMarkersToPlayer(markers);
  };

  const goToMarker = (marker) => {
    player.currentTime(marker.getTime());
  };

  const hideMarkerControls = () => {
    $('#createMarkerBtn').hide();
    $('#saveMarkerBtn').hide();
    $('#cancelMarkerBtn').hide();
    $('#deleteMarkerBtn').hide();
  };

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

  const onMarkerButtonClicked = (marker) => {
    editMarker(marker);
  };

  const sortMarkers = () => {
    markers.sort((a, b) => {
      return a.getTime() - b.getTime();
    });

    const list = $('#markersList');
    const buttons = list.children();

    Array.prototype.sort.call(buttons, (a, b) => {
      return a.marker.getTime() - b.marker.getTime();
    });

    list.append(buttons);
  };

  const createMarker = (time, text) => {
    const data = {
      time,
      text,
    };
    const marker = new Marker();
    marker.data = data;
    data.marker = marker;
    return marker;
  };

  const addMarkerToPlayer = (marker) => {
    player.markers.add([marker.data]);
  };

  const addMarkersToPlayer = (markers) => {
    markers.forEach((marker) => {
      addMarkerToPlayer(marker);
    });
  };

  const addMarkerToUI = (marker) => {
    const buttonNative = document.createElement('button');
    const button = $(buttonNative);
    button.html(marker.getText());
    button.addClass('list-group-item list-group-item-action')
    button.click(() => onMarkerButtonClicked(marker))
    $('#markersList').append(button);

    marker.button = button;
    marker.buttonNative = buttonNative;
    buttonNative.marker = marker;
  };

  $('#createMarkerBtn').click(() => {
    if (!player) {
      return;
    }

    const currentTime = player.currentTime();
    const markerName = UKU.inputVal('marker_name');
    const marker = createMarker(currentTime, markerName);

    addMarkerToPlayer(marker);
    addMarkerToUI(marker);
    markers.push(marker);
    sortMarkers();
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

  const setupChordsSection = () => {
    removeMarkersFromPlayer();
  };

  const hideChordControls = () => {
    $('#createChordsGroupBtn').hide();
    $('#createChordBtn').hide();
  };

  const setupChordGroupCreation = () => {
    hideChordControls();
    $('#createChordsGroupBtn').show();
  };

  $('#createChordsGroupBtn').click(() => {
    if (!player) {
      return;
    }

    const currentTime = player.currentTime();
    console.log(currentTime);

    // addMarkerToPlayer(marker);
    // addMarkerToUI(marker);
    // markers.push(marker);
    // sortMarkers();
  });

  setupMarkerCreation();
  setupChordGroupCreation();

  if (DEBUG) {
    createSongContainer.hide();
    setupSongContainer.show();
  }
});
