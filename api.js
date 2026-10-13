const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.querySelector("#load-btn");
const status = document.querySelector("#status");
const notesList = document.querySelector("#notes-list");
const noteForm = document.querySelector("#note-form");
const titleInput = document.querySelector("#title-input");
const bodyInput = document.querySelector("#body-input");
const submitBtn = document.querySelector("#submit-btn");

let notes = [];

// Reusable request function
async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

// Render notes
function render(list) {
  notesList.innerHTML = "";
  if (list.length === 0) {
    status.textContent = "No notes available.";
    return;
  }
  list.forEach(note => {
    const li = document.createElement("li");
    li.textContent = `${note.title}`;
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteNote(note.id));
    li.appendChild(delBtn);
    notesList.appendChild(li);
  });
}

// Load notes
async function loadNotes() {
  loadBtn.disabled = true;
  status.textContent = "Loading notes...";
  try {
    notes = await request(`${API_URL}?_limit=10`);
    status.textContent = "Notes loaded successfully.";
    render(notes);
  } catch (err) {
    status.textContent = `Error: ${err.message}`;
  } finally {
    loadBtn.disabled = false;
  }
}

// Create note
async function createNote(title, body) {
  submitBtn.disabled = true;
  status.textContent = "Creating note...";
  try {
    if (!title.trim()) {
      status.textContent = "Title is required.";
      return;
    }
    if (title.length > 100) {
      status.textContent = "Title must be under 100 characters.";
      return;
    }
    const newNote = await request(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body })
    });
    notes.unshift(newNote);
    status.textContent = "Note created successfully.";
    render(notes);
  } catch (err) {
    status.textContent = `Error: ${err.message}`;
  } finally {
    submitBtn.disabled = false;
  }
}

// Delete note
async function deleteNote(id) {
  status.textContent = "Deleting note...";
  try {
    await request(`${API_URL}/${id}`, { method: "DELETE" });
    notes = notes.filter(n => n.id !== id);
    status.textContent = "Note deleted.";
    render(notes);
  } catch (err) {
    status.textContent = `Error: ${err.message}`;
  }
}

// Event listeners
loadBtn.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", e => {
  e.preventDefault();
  createNote(titleInput.value, bodyInput.value);
  titleInput.value = "";
  bodyInput.value = "";
});