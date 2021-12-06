const DEBUG = false;
const MARKERS = 'markers';
const CHORDS = 'chords';
const CREATE_CHORD = 'create chord';
const EDIT_CHORD = 'edit chord';

let section = MARKERS;

const song = new Song();

let player;
let playerReady = false;

const markers = [];
const chordGroups = [];

let selectedMarker = null;
let selectedChordGroup = null;
let selectedChord = null;
let chordAction = CREATE_CHORD;

$(document).ready(() => {
  UKU.injectChordPicker();

  UKU.injectVideoJs().then(() => {
    player = videojs($('#ukuVideo')[0], {
      techOrder: ['youtube'],
      sources: [{
        type: 'video/youtube',
        src: 'https://www.youtube.com/watch?v=eJnQBXmZ7Ek&ab_channel=twentyonepilots',
      }],
    });

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
      markers.push(kekMarker);
      addMarkerToUI(kekMarker);

      const cheburekMarker = createMarker(100, 'Cheburek');
      markers.push(cheburekMarker);
      addMarkerToUI(cheburekMarker);

      sortMarkers();

      const kekGroup = createChordGroup(30, 'kek');
      chordGroups.push(kekGroup);
      addChordGroupToUI(kekGroup);
      sortChordGroups();
      addChordGroupToPlayer(kekGroup);

      const chord = new Chord();
      chord.name = 'C#';
      selectedChordGroup = kekGroup;
      createChord(chord);
      removeChordsFromUI();
    }
  });

  const createSongContainer = $('.create-song-container');
  const setupSongContainer = $('.setup-song-container');

  setupSongContainer.hide();

  $('#continueBtn').click(() => {
    song.artist = UKU.inputVal('artist') || 'Unnamed';
    song.title = UKU.inputVal('title') || 'Untitled';
    song.link = UKU.inputVal('link') || 'https://www.youtube.com/watch?v=67Cv0dMmi_8';

    player.ready(() => {
      player.poster('');
      player.src({
        type: 'video/youtube',
        src: song.link,
      });
    });

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

  const onMarkerClicked = (marker) => {
    switch (section) {
      case MARKERS:
        onMarkerMarkerClicked(marker);
        break;
      case MARKERS:
        onChordMarkerClicked(marker);
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
    deselectMarker();
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

    const markerName = selectedMarker.getText();
    UKU.inputVal('marker_name', markerName);
  };

  const deselectMarker = () => {
    if (!selectedMarker) {
      return;
    }

    selectedMarker.button.removeClass('active');
    selectedMarker = null;
    setupMarkerCreation();
    UKU.inputVal('chord_group_name', '');
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

  const onMarkerMarkerClicked = (marker) => {
    editMarker(marker);
  };

  const onMarkerButtonClicked = (marker) => {
    editMarker(marker);
  };

  const compareMarkers = (a, b) => {
    return a.getTime() - b.getTime();
  };

  const compareMarkersButtons = (a, b) => {
    return a.marker.getTime() - b.marker.getTime();
  };

  const sortMarkers = () => {
    markers.sort(compareMarkers);

    const list = $('#markersList');
    const buttons = list.children();

    Array.prototype.sort.call(buttons, compareMarkersButtons);

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
    const markerName = UKU.inputVal('marker_name') || 'Unnamed';
    const marker = createMarker(currentTime, markerName);

    markers.push(marker);
    addMarkerToUI(marker);
    sortMarkers();
    addMarkerToPlayer(marker);
    UKU.inputVal('marker_name', '');
  });

  $('#saveMarkerBtn').click(() => {
    const markerName = UKU.inputVal('marker_name') || 'Unnamed';
    selectedMarker.setText(markerName);
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
    addMarkersToPlayer(chordGroups);
    removeChordsFromUI();
    deselectChordGroup();
  };

  const hideChordGroupControls = () => {
    $('#createChordsGroupBtn').hide();
    $('#createChordBtn').hide();
    $('#saveChordsGroupBtn').hide();
    $('#cancelChordsGroupBtn').hide();
    $('#deleteChordsGroupBtn').hide();
  };

  const setupChordGroupCreation = () => {
    hideChordGroupControls();
    $('#createChordsGroupBtn').show();
  };

  const createChordGroup = (time, text) => {
    const data = {
      time,
      text,
      class: 'chord-group-marker',
    };
    const chordGroup = new ChordGroup();
    chordGroup.data = data;
    data.marker = chordGroup;
    return chordGroup;
  };

  const addChordGroupToUI = (chordGroup) => {
    const buttonNative = document.createElement('button');
    const button = $(buttonNative);
    button.html(chordGroup.getText());
    button.addClass('list-group-item list-group-item-action')
    button.click(() => onChordGroupButtonClicked(chordGroup))
    $('#chordGroupsList').append(button);

    chordGroup.button = button;
    chordGroup.buttonNative = buttonNative;
    buttonNative.marker = chordGroup;
  };

  const onChordGroupButtonClicked = (chordGroup) => {
    editChordGroup(chordGroup);
  };

  const editChordGroup = (chordGroup) => {
    const isActive = chordGroup.button.hasClass('active');

    removeChordsFromUI();
    deselectChordGroup();

    if (!isActive) {
      selectChordGroup(chordGroup);
      addChordsFromGroup(chordGroup);
      setupChordGroupEditing();
      goToChordGroup(selectedChordGroup);
    }
  };

  const goToChordGroup = (chordGroup) => {
    player.currentTime(chordGroup.getTime());
  };

  const setupChordGroupEditing = () => {
    hideChordGroupControls();
    $('#saveChordsGroupBtn').show();
    $('#cancelChordsGroupBtn').show();
    $('#deleteChordsGroupBtn').show();
    $('#createChordBtn').show();

    const chordGroupName = selectedChordGroup.getText();
    UKU.inputVal('chord_group_name', chordGroupName);
  };

  const addChordsFromGroup = (chordGroup) => {
    chordGroup.chords.forEach((chord) => addChordToUI(chord));
  };

  const removeChordsFromUI = () => {
    $('#chordsList').empty();
  };

  const deselectChordGroup = () => {
    if (!selectedChordGroup) {
      return;
    }

    selectedChordGroup.button.removeClass('active');
    selectedChordGroup = null;
    setupChordGroupCreation();
    UKU.inputVal('chord_group_name', '');
  };

  const selectChordGroup = (chordGroup) => {
    chordGroup.button.addClass('active');
    selectedChordGroup = chordGroup;
  };

  const deleteChordGroup = (chordGroup) => {
    if (selectedChordGroup === chordGroup) {
      selectedChordGroup = null;
    }

    const index = chordGroups.indexOf(chordGroup);
    chordGroups.splice(index, 1);
    player.markers.remove([index]);
    chordGroup.removeButton();
  };

  const sortChordGroups = () => {
    chordGroups.sort(compareMarkers);

    const list = $('#chordGroupsList');
    const buttons = list.children();

    Array.prototype.sort.call(buttons, compareMarkersButtons);

    list.append(buttons);
  };

  const addChordGroupToPlayer = (chordGroup) => {
    player.markers.add([chordGroup.data]);
  };

  const onChordMarkerClicked = (marker) => {
    editChordGroup(marker);
  };

  $('#createChordsGroupBtn').click(() => {
    if (!player) {
      return;
    }

    const currentTime = player.currentTime();
    const chordGroupName = UKU.inputVal('chord_group_name') || 'Unnamed';
    const marker = createChordGroup(currentTime, chordGroupName);

    chordGroups.push(marker);
    addChordGroupToUI(marker);
    sortChordGroups();
    addChordGroupToPlayer(marker);
    UKU.inputVal('chord_group_name', '');
  });

  $('#saveChordsGroupBtn').click(() => {
    const chordGroupName = UKU.inputVal('chord_group_name') || 'Unnamed';
    selectedChordGroup.setText(chordGroupName);
  });

  $('#cancelChordsGroupBtn').click(() => {
    removeChordsFromUI();
    deselectChordGroup();
  });

  $('#deleteChordsGroupBtn').click(() => {
    deleteChordGroup(selectedChordGroup);
    setupChordGroupCreation();
  });

  $('#createChordBtn').click(() => {
    chordAction = CREATE_CHORD;
    UKU.showChordModal();
  });

  UKU.events.on('chordPicked', (e, chord) => {
    switch (chordAction) {
      case CREATE_CHORD:
        createChord(chord);
        break;
      case EDIT_CHORD:
        editChord(chord);
        break;
    }
  });

  const addChordToUI = (chord) => {
    const card = $(`
<div class="card mx-2">
  <h5 class="card-title text-center m-3">C#</h5>

  <div class="btn-group-vertical">
    <button class="btn btn-primary rounded-0 btn-edit">Edit</button>
    <button class="btn btn-primary btn-delete">Delete</button>
  </div>
</div>
`);
    const cardNative = card[0];
    card.find('.btn-edit').click(() => onEditChordClicked(chord));
    card.find('.btn-delete').click(() => onDeleteChordClicked(chord));
    $('#chordsList').append(card);

    chord.card = card;
    chord.cardNative = cardNative;
    cardNative.chord = chord;

    updateChordUI(chord);
  };

  const updateChordUI = (chord) => {
    chord.card.find('.card-title').html(chord.name);
  };

  const createChord = (chord) => {
    selectedChordGroup.chords.push(chord);
    chord.group = selectedChordGroup;
    addChordToUI(chord);
  };

  const editChord = (chord) => {
    updateChordUI(chord);
  };

  const onEditChordClicked = (chord) => {
    selectedChord = chord;
    chordAction = EDIT_CHORD;
    UKU.showChordModal(chord);
  };

  const onDeleteChordClicked = (chord) => {
    chord.removeCard();
    chord.group.removeChord(chord);
  };

  $('#finishBtn').click(() => {
    song.visibility = UKU.inputRadioVal('visibility');
    song.markers = markers;
    song.chordGroups = chordGroups;

    const serialized = song.serialize();
    const artist = serialized.artist;
    const title = serialized.title;
    const link = serialized.link;
    const visibility = serialized.visibility;
    const options = serialized.options;

    $.post({
      url: '/backend/song/create.php',
      dataType: 'json',
      data: {
        artist,
        title,
        link,
        visibility,
        options,
      },
    })
    .done((data) => {
      if (data.status === true) {
        const songId = data.songId;
        window.location.href = '/song?id=' + songId;
      } else {
        console.error(data.error);
      }
    })
    .fail((a, b, c) => {
      console.error(a, b, c);
    });
  });

  setupMarkerCreation();
  setupChordGroupCreation();

  if (DEBUG) {
    createSongContainer.hide();
    setupSongContainer.show();
  }
});
