const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class NoteManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async loadNotes() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []; // Return an empty array if file does not exist
      } else {
        throw error;
      }
    }
  }

  async saveNotes(notes) {
    await fs.writeFile(this.filePath, JSON.stringify(notes, null, 2));
  }

  async getNotes() {
    try {
      const notes = await this.loadNotes();
      return notes;
    } catch (error) {
      console.error('Error getting notes:', error);
      throw new Error('Failed to get notes');
    }
  }

  async addNote(title, content) {
    try {
      const notes = await this.loadNotes();
      const newNote = { id: uuidv4(), title, content };
      notes.push(newNote);
      await this.saveNotes(notes);
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      throw new Error('Failed to add note');
    }
  }

  async removeNoteById(id) {
    try {
      let notes = await this.loadNotes();
      notes = notes.filter(note => note.id !== id);
      await this.saveNotes(notes);
    } catch (error) {
      console.error('Error removing note:', error);
      throw new Error('Failed to remove note');
    }
  }

  async updateNoteById(id, updatedNote) {
    try {
      let notes = await this.loadNotes();
      const index = notes.findIndex(note => note.id === id);
      if (index !== -1) {
        notes[index] = { id, ...updatedNote };
        await this.saveNotes(notes);
        return notes[index];
      } else {
        throw new Error('Note not found');
      }
    } catch (error) {
      console.error('Error updating note:', error);
      throw new Error('Failed to update note');
    }
  }
}

module.exports = NoteManager;
