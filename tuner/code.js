const notesData = {
  'A': {
    name: 'A',
    frequency: 440,
  },
  'E': {
    name: 'E',
    frequency: 329.6276,
  },
  'C': {
    name: 'C',
    frequency: 261.6256,
  },
  'G': {
    name: 'G',
    frequency: 391.9954,
  },
};

let selectedNote = notesData['G'];

$(document).ready(() => {
  UKU.injectTuner().then(() => {
    const tuner = new Tuner();
    const differenceElement = $('#difference');

    tuner.onNoteDetected = function(note) {
      const diff = selectedNote.frequency - note.frequency;
      const diffRounded = Math.round(diff);
      const diffAbs = Math.abs(diffRounded);
      const diffStr = (diffRounded < 0 ? diffRounded : '+' + diffRounded);

      differenceElement.html(diffStr);

      if (diffAbs < 10) {
        differenceElement
          .removeClass('text-danger')
          .addClass('text-success');
      } else {
        differenceElement
          .removeClass('text-success')
          .addClass('text-danger');
      }
    };
  
    tuner.init()
  });

  $('.btn-group-toggle label.btn').click(function() {
    $('.btn-group-toggle')
      .find('input[type=radio]')
      .attr('checked', false)
      .parent()
      .removeClass('active');

    $(this)
      .find('input[type=radio]')
      .attr('checked', true)
      .parent()
      .addClass('active');

    const note = $(this).find('input[type=radio]').val();
    selectedNote = notesData[note.toUpperCase()];
  });
});
