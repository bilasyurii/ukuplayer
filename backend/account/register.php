<?php

session_start();

require_once '../core/connect.php';

$name = $_POST['name'];
$password = $_POST['password'];

$password = md5($password);

if (!mysqli_query($connect, "INSERT INTO `users` (`id`, `name`, `password`) VALUES (NULL, '$name', '$password')")) {
  echo json_encode([
    'status' => false,
    'error' => 'Error while registering',
  ]);
} else {
  echo json_encode([
    'status' => true,
  ]);
}
