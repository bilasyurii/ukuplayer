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
