<?php

require_once '../core/check-authorization.php';
require_once '../core/connect.php';

$id = $_POST['id'];
$songsFound = mysqli_query($connect, "SELECT artist, title, link, options FROM `songs` where id=$id");

if (mysqli_num_rows($songsFound) > 0) {
  $song = mysqli_fetch_assoc($songsFound);

  echo json_encode([
    'status' => true,
    'song' => $song,
  ]);
} else {
  echo json_encode([
    'status' => false,
    'error' => 'Error while fetching song data',
  ]);
}
