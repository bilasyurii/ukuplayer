$(document).ready(() => {
  const addSongs = (songs) => {
    songs.forEach((song) => addSong(song));
  };

  const addSong = (songData) => {
    const song = $(`
<a href="#" class="list-group-item list-group-item-action d-flex flex-column align-items-center flex-sm-row align-items-sm-start">
  <img src="" alt="thumbnail" class="song-thumbnail me-3">

  <div class="flex-grow-1">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1 song-title"></h5>

      <small class="text-muted author"></small>
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
    $('.library-list').append(song);
  };

  $.post({
    url: '/backend/library/get.php',
    dataType: 'json',
  })
  .done((data) => {
    if (data.status === true) {
      addSongs(data.songs);
    } else {
      console.error(data.error);
    }
  })
  .fail((a, b, c) => {
    console.error(a, b, c);
  });
});
