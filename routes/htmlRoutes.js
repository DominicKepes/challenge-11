const express = require('express');
const path = require('path');
const router = express.Router();
const store = require('../db/store');

// Route to serve notes.html
router.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/notes.html'));
});

// Route to handle API requests for getting all notes
router.get('/api/notes', async (req, res) => {
  try {
    const notes = await store.getNotes();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to handle API requests for adding a new note
router.post('/api/notes', async (req, res) => {
  try {
    const note = await store.addNote(req.body);
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to handle API requests for deleting a note by ID
router.delete('/api/notes/:id', async (req, res) => {
  try {
    await store.removeNote(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to serve index.html for all other routes
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;
