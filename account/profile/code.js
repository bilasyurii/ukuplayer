$(document).ready(() => {
  const addSongs = (songs) => {
    songs.forEach((song) => addSong(song));
  };

  const addSong = (songData) => {
    const song = $(`
<a href="#" class="list-group-item list-group-item-action d-flex flex-column align-items-center flex-sm-row align-items-sm-start">
  <img src="" alt="thumbnail" class="song-thumbnail me-3">

  <div class="flex-grow-1 align-self-stretch">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1 song-title"></h5>
    </div>

    <small class="text-muted song-artist"></small>
  </div>
</a>
`);

    const videoURLData = UKU.parseYoutubeURL(songData.link);
    const videoId = videoURLData.videoId;
    const thumbnailURL = UKU.getYoutubeThumbnailURL(videoId);

    song.find('.song-thumbnail').attr('src', thumbnailURL);
    song.find('.song-title').html(songData.title);
    song.find('.song-artist').html(songData.artist);
    song.find('.author').html(songData.userName);
    song.attr('href', '/song?id=' + songData.id);
    $('.songs-list').append(song);
  };

  const addPlaceholder = () => {
    const placeholder = $('<h5 class="text-center">No songs found</h5>');
    $('.songs-list').append(placeholder);
  };

  const setUserName = (name) => {
    $('.user-name').html(name);
  };

  $('#logoutBtn').click(() => {
    $.post({
      url: '/backend/account/logout.php',
      dataType: 'json',
    })
    .done((data) => {
      if (data.status === true) {
        window.location.href = '/';
      } else {
        UKU.handleError(data);
      }
    })
    .fail((data) => {
      UKU.handleError(data);
    });
  });

  $.post({
    url: '/backend/account/profile.php',
    dataType: 'json',
  })
  .done((data) => {
    if (data.status === true) {
      const songs = data.songs;

      if (songs.length === 0) {
        addPlaceholder();
      } else {
        addSongs(data.songs);
      }

      setUserName(data.userName);
    } else {
      UKU.handleError(data);
    }
  })
  .fail((data) => {
    UKU.handleError(data);
  });
});
