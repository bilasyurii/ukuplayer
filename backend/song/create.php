<?php

session_start();

if (!isset($_SESSION['user'])) {
  echo json_encode([
    'status' => false,
    'error' => 'Not authorized',
  ]);

  exit();
}

$user = $_SESSION['user'];

require_once '../core/connect.php';

$userId =  $user['id'];
$artist = $_POST['artist'];
$title = $_POST['title'];
$link = $_POST['link'];
$options = $_POST['options'];
$visibility = $_POST['visibility'];

if (mysqli_query($connect, "INSERT INTO `songs` (`id`, `artist`, `title`, `link`, `visibility`, `options`, `userId`) VALUES (NULL, '$artist', '$title', '$link', '$visibility', '$options', '$userId')")) {
  $songId = mysqli_insert_id($connect);

  echo json_encode([
    'status' => true,
    'songId' => $songId,
  ]);
} else {
  echo json_encode([
    'status' => false,
    'error' => 'Error while creating a song',
  ]);
}