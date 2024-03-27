document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".note-form");
  const titleInput = document.querySelector(".note-title");
  const textInput = document.querySelector(".note-textarea");
  const noteList = document.querySelector("#list-group");

  const renderNoteList = (notes) => {
    noteList.innerHTML = "";
    notes.forEach((note) => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.dataset.noteId = note.id;

      const titleSpan = document.createElement("span");
      titleSpan.textContent = note.title;
      titleSpan.addEventListener("click", () => {
        // Function to view note details
        renderActiveNote(note);
      });

      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fas", "fa-trash-alt", "float-right", "text-danger", "delete-note");
      deleteIcon.addEventListener("click", async (e) => {
        e.stopPropagation();
        try {
          const noteId = e.target.parentElement.dataset.noteId;
          await deleteNoteFromServer(noteId);
          await getAndRenderNotes();
        } catch (error) {
          console.error("Error deleting note:", error);
        }
      });

      listItem.appendChild(titleSpan);
      listItem.appendChild(deleteIcon);
      noteList.appendChild(listItem);
    });
  };

  const renderActiveNote = (note) => {
    titleInput.value = note.title || "";
    textInput.value = note.text || "";
  };

  const saveNoteToServer = async (noteData) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Error saving note:", error);
    }
  };

  const deleteNoteFromServer = async (noteId) => {
    try {
      await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });
    } catch (error) {
      throw new Error("Error deleting note:", error);
    }
  };

  const getAndRenderNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      const notes = await response.json();
      renderNoteList(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const noteData = {
      title: titleInput.value,
      text: textInput.value,
    };
    try {
      const newNote = await saveNoteToServer(noteData);
      renderActiveNote(newNote);
      await getAndRenderNotes();
    } catch (error) {
      console.error(error);
    }
  });

  getAndRenderNotes();
});
