document.addEventListener('DOMContentLoaded', fetchNotes);

const noteForm = document.getElementById('note-form');
const noteInput = document.getElementById('note-input');
const notesList = document.getElementById('notes-list');

noteForm.addEventListener('submit', addNote);

function fetchNotes() {
  fetch('/api/notes')
    .then(response => response.json())
    .then(notes => {
      notesList.innerHTML = '';
      notes.forEach(note => {
        renderNote(note);
      });
    });
}

function renderNote(note) {
  const li = document.createElement('li');
  li.dataset.id = note.id;
  li.innerHTML = `
    <span>${note.content || note.text || ''}</span>
    <div>
      <button onclick="editNote(${note.id})">Edit</button>
      <button onclick="deleteNote(${note.id})">Delete</button>
    </div>
  `;
  notesList.appendChild(li);
}

function addNote(e) {
  e.preventDefault();
  const content = noteInput.value;
  fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  })
  .then(response => response.json())
  .then(newNote => {
    renderNote(newNote);
    noteInput.value = '';
  });
}

function deleteNote(id) {
  fetch(`/api/notes/${id}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(() => {
      document.querySelector(`li[data-id="${id}"]`).remove();
    });
}

function editNote(id) {
  const li = document.querySelector(`li[data-id="${id}"]`);
  const currentContent = li.querySelector('span').innerText;
  const newContent = prompt('Edit your note:', currentContent);
  if (newContent !== null) {
    fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newContent })
    })
    .then(response => response.json())
    .then(() => {
      li.querySelector('span').innerText = newContent;
    });
  }
}
