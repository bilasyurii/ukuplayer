(() => {

let currentChord = null;

const chordPickerModal = $(`
<div class="modal fade" id="chordPickerModal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Create chord</h5>
      </div>

      <div class="modal-body">
        <label for="chord_name">Name:</label>
        <input type="text" class="form-control" placeholder="Enter name of the chord" name="chord_name">
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" id="chordModalCancelBtn">Cancel</button>
        <button type="button" class="btn btn-primary" id="chordModalSaveBtn">Save</button>
      </div>
    </div>
  </div>
</div>
`);

$(document.body).append(chordPickerModal);

const closeModal = () => {
  chordPickerModal.modal('hide');
};

chordPickerModal.find('#chordModalCancelBtn').on('click', () => {
  closeModal();
});

chordPickerModal.find('#chordModalSaveBtn').on('click', () => {
  closeModal();

  currentChord.name = UKU.inputVal('chord_name');

  UKU.events.trigger('chordPicked', [currentChord]);
});

UKU.showChordModal = (chord) => {
  if (chord) {
    currentChord = chord;
  } else {
    currentChord = new Chord();
  }

  UKU.inputVal('chord_name', currentChord.name);
  chordPickerModal.modal('show');
};

})();
