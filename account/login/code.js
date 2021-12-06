$(document).ready(() => {
  $('#loginBtn').click(() => {
    const name = UKU.inputVal('name');
    const password = UKU.inputVal('password');

    $.post({
      url: '/backend/account/login.php',
      dataType: 'json',
      data: {
        name,
        password,
      },
    })
    .done((data) => {
      if (data.status === true) {
        window.location.href = '/';
      } else {
        console.error(data.error);
      }
    })
    .fail((a, b, c) => {
      console.error(a, b, c);
    });
  });
});
