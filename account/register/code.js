$(document).ready(() => {
  $('#registerBtn').click(() => {
    const name = UKU.inputVal('name');
    const password = UKU.inputVal('password');
    const passwordConfirm = UKU.inputVal('passwordConfirm');

    $.post({
      url: '/backend/account/register.php',
      dataType: 'json',
      data: {
        name,
        password,
        passwordConfirm,
      },
    })
    .done((data) => {
      if (data.status === true) {
        window.location.href = '/account/login';
      } else {
        console.error(data.error);
      }
    })
    .fail((a, b, c) => {
      console.error(a, b, c);
    });
  });
});
