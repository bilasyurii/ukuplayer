<?php

$connect = mysqli_connect('localhost', 'root', '', 'ukuplayer');

if (!$connect) {
  echo json_encode([
    'status' => false,
    'error' => 'Could not connect to database',
  ]);
}
