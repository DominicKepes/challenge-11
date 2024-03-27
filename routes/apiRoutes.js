const express = require('express');
const router = express.Router();
const UniqueNoteStore = require('../db/store'); // Import the UniqueNoteStore class

// Initialize a new instance of the UniqueNoteStore class
const noteStore = new UniqueNoteStore('../db/db.json');

// Route to get all notes
router.get('/api/notes', async (req, res) => {
  try {
    const notes = await noteStore.getNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to add a new note
router.post('/api/notes', async (req, res) => {
  try {
    const note = await noteStore.addNote(req.body);
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete a note by ID
router.delete('/api/notes/:id', async (req, res) => {
  try {
    await noteStore.removeNote(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
