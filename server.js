const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;
const dataFilePath = path.join(__dirname, 'data.json');

// Middleware to parse JSON
app.use(express.json());
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read notes from the JSON file
function readNotes() {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
}

// Helper to write notes to the JSON file
function writeNotes(notes) {
  fs.writeFileSync(dataFilePath, JSON.stringify(notes, null, 2));
}

// API: Get all notes
app.get('/api/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

// API: Create a new note
app.post('/api/notes', (req, res) => {
  const notes = readNotes();
  const newNote = { id: Date.now(), ...req.body };
  notes.push(newNote);
  writeNotes(notes);
  res.status(201).json(newNote);
});

// API: Update a note
app.put('/api/notes/:id', (req, res) => {
  let notes = readNotes();
  const noteId = parseInt(req.params.id, 10);
  notes = notes.map(note =>
    note.id === noteId ? { ...note, ...req.body } : note
  );
  writeNotes(notes);
  res.json({ message: 'Note updated' });
});

// API: Delete a note
app.delete('/api/notes/:id', (req, res) => {
  let notes = readNotes();
  const noteId = parseInt(req.params.id, 10);
  notes = notes.filter(note => note.id !== noteId);
  writeNotes(notes);
  res.json({ message: 'Note deleted' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
