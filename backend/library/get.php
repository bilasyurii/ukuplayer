<?php

require_once '../core/check-authorization.php';
require_once '../core/connect.php';

$songsFound = mysqli_query($connect, "SELECT s.id, s.artist, s.title, s.link, u.id as userId, u.name as userName FROM `songs` as s JOIN `users` as u ON s.userId=u.id");

if ($songsFound) {
  $songs = array();

  while ($song = mysqli_fetch_assoc($songsFound)) {
    array_push($songs, $song);
  }

  echo json_encode([
    'status' => true,
    'songs' => $songs,
  ]);
} else {
  echo json_encode([
    'status' => false,
    'error' => 'Error while fetching songs',
  ]);
}
