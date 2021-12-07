let song;
let player;

let srcSetup = false;

const markers = [];
const chordGroups = [];

let selectedMarker = null;
let selectedChordGroup = null;

$(document).ready(() => {
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
      addMarkersToPlayer(markers);
      sortMarkers();
      sortChordGroups();
    });

    player.ready(() => {
      setupPlayerSrc();
      player.on('timeupdate', onTimeUpdate);
    });
  });

  const onSongDataFetched = (data) => {
    song = new Song();
    song.artist = data.artist;
    song.title = data.title;
    song.link = data.link;

    const options = JSON.parse(data.options);
    const markersData = options.markers;
    const chordGroupsData = options.chordGroups;

    markersData.forEach((markerData) => {
      const marker = new Marker();
      const data = {
        time: markerData.time,
        text: markerData.text,
      };
      marker.data = data;
      data.marker = marker;
      markers.push(marker);
    });

    chordGroupsData.forEach((chordGroupData) => {
      const chordGroup = new ChordGroup();
      const data = {
        time: chordGroupData.time,
        text: chordGroupData.text,
      };
      chordGroup.data = data;
      data.marker = chordGroup;
      chordGroups.push(chordGroup);

      const chordsData = chordGroupData.chords;
      const chords = chordGroup.chords;

      chordsData.forEach((chordData) => {
        const chord = new Chord();
        chord.name = chordData.name;
        chord.group = chordGroup;
        chords.push(chord);
      });
    });

    addMarkersToUI(markers);
    setupPlayerSrc();
  };

  const fetchSongData = () => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));

    $.post({
      url: '/backend/song/get.php',
      dataType: 'json',
      data: {
        id,
      },
    })
    .done((data) => {
      if (data.status === true) {
        onSongDataFetched(data.song);
      } else {
        console.error(data.error);
      }
    })
    .fail((a, b, c) => {
      console.error(a, b, c);
    });
  };

  const setupPlayerSrc = () => {
    if (!player || !song || srcSetup) {
      return;
    }

    srcSetup = true;

    player.ready(() => {
      player.poster('');
      player.src({
        type: 'video/youtube',
        src: song.link,
      });
      player.show();
    });
  };

  const addMarkersToPlayer = (markers) => {
    markers.forEach((marker) => {
      addMarkerToPlayer(marker);
    });
  };

  const addMarkerToPlayer = (marker) => {
    player.markers.add([marker.data]);
  };

  const addMarkersToUI = (markers) => {
    markers.forEach((marker) => {
      addMarkerToUI(marker);
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

  const sortMarkers = () => {
    markers.sort(compareMarkers);

    const list = $('#markersList');
    const buttons = list.children();

    Array.prototype.sort.call(buttons, compareMarkersButtons);

    list.append(buttons);
  };

  const sortChordGroups = () => {
    chordGroups.sort(compareMarkers);
  };

  const compareMarkers = (a, b) => {
    return a.getTime() - b.getTime();
  };

  const compareMarkersButtons = (a, b) => {
    return a.marker.getTime() - b.marker.getTime();
  };

  const onMarkerClicked = (marker) => {
    const isActive = marker.button.hasClass('active');

    if (isActive) {
      return;
    }

    deselectMarker();
    selectMarker(marker);
    goToMarker(selectedMarker);
  };

  const onMarkerButtonClicked = (marker) => {
    const isActive = marker.button.hasClass('active');

    deselectMarker();

    if (!isActive) {
      selectMarker(marker);
      goToMarker(selectedMarker);
    }
  };

  const deselectMarker = () => {
    if (!selectedMarker) {
      return;
    }

    selectedMarker.button.removeClass('active');
    selectedMarker = null;
  };

  const selectMarker = (marker) => {
    marker.button.addClass('active');
    selectedMarker = marker;
  };

  const goToMarker = (marker) => {
    if (!player) {
      return;
    }

    player.currentTime(marker.getTime());
  };

  const onTimeUpdate = () => {
    const group = pickChordGroup(player.currentTime());

    if (group === selectedChordGroup) {
      return;
    }

    selectedChordGroup = group;
    removeChordsFromUI();

    if (group) {
      addChordsFromGroup(group);
      setChordGroupTitle(group.getText());
    } else {
      setChordGroupTitle('');
    }
  };

  const setChordGroupTitle = (title) => {
    $('#chord-group-title').html(title);
  };

  const pickChordGroup = (time) => {
    const count = chordGroups.length;

    for (let i = 0; i < count; ++i) {
      const group = chordGroups[i];

      if (group.getTime() >= time) {
        return group;
      }
    }

    return null;
  };

  const removeChordsFromUI = () => {
    $('#chordsList').empty();
  };

  const addChordsFromGroup = (chordGroup) => {
    chordGroup.chords.forEach((chord) => addChordToUI(chord));
  };

  const addChordToUI = (chord) => {
    const card = $(`
<div class="card m-2">
  <h5 class="card-title text-center m-3">C#</h5>
</div>
`);
    const cardNative = card[0];
    $('#chordsList').append(card);

    chord.card = card;
    chord.cardNative = cardNative;
    cardNative.chord = chord;

    updateChordUI(chord);
  };

  const updateChordUI = (chord) => {
    chord.card.find('.card-title').html(chord.name);
  };

  fetchSongData();

  UKU.injectSpeechRecognition().then(() => {
    if (!annyang) {
      return;
    }

    const commands = {
      // playing controls
      'play': play,
      'resume': play,
      'pause': pause,
      'stop': pause,
      'restart': restart,
      'go to start': restart,
      // seconds forward
      'forward :amount (second)': forwardSeconds,
      'forward :amount (seconds)': forwardSeconds,
      'skip :amount (second)': forwardSeconds,
      'skip :amount (seconds)': forwardSeconds,
      // seconds backward
      'backward :amount (second)': backwardSeconds,
      'backward :amount (seconds)': backwardSeconds,
      'back :amount (second)': backwardSeconds,
      'back :amount (seconds)': backwardSeconds,
      // minutes forward
      'forward minute :amount': forwardMinutes,
      'forward minutes :amount': forwardMinutes,
      'skip minute :amount': forwardMinutes,
      'skip minutes :amount': forwardMinutes,
      // minutes backward
      'backward minute :amount': backwardMinutes,
      'backward minutes :amount': backwardMinutes,
      'back minute :amount': backwardMinutes,
      'back minutes :amount': backwardMinutes,
    };

    annyang.addCommands(commands);
    annyang.addCallback('result', (a, b, c) => console.log(a, b, c));
    annyang.start();
  });

  const play = () => {
    if (player) {
      player.play();
    }
  };

  const pause = () => {
    if (player) {
      player.pause();
    }
  };

  const restart = () => {
    if (player) {
      player.currentTime(0);
    }
  };

  const seek = (amount) => {
    console.warn(amount);
    if (player) {
      let time = player.currentTime() + amount;

      if (time < 0) {
        time = 0;
      }

      player.currentTime(time);
    }
  };

  const forwardSeconds = (amount) => {
    seek(UKU.int(amount));
  };

  const backwardSeconds = (amount) => {
    seek(-UKU.int(amount));
  };

  const forwardMinutes = (amount) => {
    seek(UKU.int(amount) * 60);
  };

  const backwardMinutes = (amount) => {
    seek(UKU.int(amount) * -60);
  };
});
