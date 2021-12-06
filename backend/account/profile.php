<?php

require_once '../core/check-authorization.php';
require_once '../core/connect.php';

$userId =  $user['id'];
$userName =  $user['name'];
$songsFound = mysqli_query($connect, "SELECT id, artist, title, link FROM `songs` where userId=$userId");

if ($songsFound) {
  $songs = array();

  while ($song = mysqli_fetch_assoc($songsFound)) {
    array_push($songs, $song);
  }

  echo json_encode([
    'status' => true,
    'songs' => $songs,
    'userName' => $userName,
  ]);
} else {
  echo json_encode([
    'status' => false,
    'error' => 'Error while fetching songs',
  ]);
}
