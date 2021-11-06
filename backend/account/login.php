<?php

session_start();

require_once '../core/connect.php';

$name = $_POST['name'];
$password = $_POST['password'];

$password = md5($password);

$usersFound = mysqli_query($connect, "SELECT * FROM `users` WHERE `name` = '$name' AND `password` = '$password'");

if (mysqli_num_rows($usersFound) > 0) {
  $user = mysqli_fetch_assoc($usersFound);
  $id = $user['id'];
  $name = $user['name'];

  $_SESSION['user'] = [
    'id' => $id,
    'name' => $name,
  ];

  echo json_encode([
    'status' => true,
    'id' => $id,
    'name' => $name,
  ]);
} else {
  echo json_encode([
    'status' => false,
    'error' => 'Wrong name or password',
  ]);
}
