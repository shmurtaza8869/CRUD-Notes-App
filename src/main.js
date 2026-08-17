import './style.css';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xaemeanywmnnirbwprnk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_2yGfJcXJWEi5-i7zHrWZbQ_Ep1K-V4D';

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const noteForm = document.getElementById('note-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const notesContainer = document.getElementById('notes-container');
const searchInput = document.getElementById('search');
const message = document.getElementById('message');
const saveButton = document.getElementById('save-btn');
const cancelButton = document.getElementById('cancel-btn');

let editingNoteId = null;

async function loadNotes(searchTerm = '') {
    let query = supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

    if (searchTerm.trim() !== '') {
        query = query.ilike('title', `%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('LOAD ERROR:', error);
        showMessage('Could not load notes.');
        return;
    }

    displayNotes(data);
}

function displayNotes(notes) {
    notesContainer.innerHTML = '';

    if (notes.length === 0) {
        notesContainer.innerHTML = '<p>No notes found.</p>';
        return;
    }

    notes.forEach(note => {
        const card = document.createElement('div');

        card.className = 'note-card';

        card.innerHTML = `
            <h2>${escapeHtml(note.title)}</h2>

            <p>${escapeHtml(note.content)}</p>

            <small>
                Created: ${new Date(note.created_at).toLocaleString()}
            </small>

            <div class="note-actions">
                <button
                    class="edit-btn"
                    data-id="${note.id}">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    data-id="${note.id}">
                    Delete
                </button>
            </div>
        `;

        notesContainer.appendChild(card);
    });
}

noteForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        showMessage('Please enter both title and content.');
        return;
    }

    saveButton.disabled = true;

    if (editingNoteId === null) {
        const { data, error } = await supabase
            .from('notes')
            .insert({
                title: title,
                content: content
            })
            .select();

        if (error) {
            console.error('CREATE ERROR:', error);
            showMessage('Could not create note.');
        } else {
            console.log('CREATED:', data);
            showMessage('Note added successfully!');
            resetForm();
            await loadNotes();
        }
    } else {
        console.log('Updating note ID:', editingNoteId);

        const { data, error } = await supabase
            .from('notes')
            .update({
                title: title,
                content: content
            })
            .eq('id', editingNoteId)
            .select();

        if (error) {
            console.error('UPDATE ERROR:', error);
            showMessage('Could not update note.');
        } else {
            console.log('UPDATED:', data);
            showMessage('Note updated successfully!');
            resetForm();
            await loadNotes();
        }
    }

    saveButton.disabled = false;
});

notesContainer.addEventListener('click', async (event) => {
    const id = event.target.dataset.id;

    if (!id) {
        return;
    }

    if (event.target.classList.contains('edit-btn')) {
        await editNote(id);
    }

    if (event.target.classList.contains('delete-btn')) {
        await deleteNote(id);
    }
});

async function editNote(id) {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('EDIT LOAD ERROR:', error);
        showMessage('Could not load note.');
        return;
    }

    titleInput.value = data.title;
    contentInput.value = data.content;

    editingNoteId = data.id;

    saveButton.textContent = 'Update Note';
    cancelButton.classList.remove('hidden');

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

async function deleteNote(id) {
    const confirmed = confirm(
        'Are you sure you want to delete this note?'
    );

    if (!confirmed) {
        return;
    }

    const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('DELETE ERROR:', error);
        showMessage('Could not delete note.');
        return;
    }

    showMessage('Note deleted successfully!');

    await loadNotes();
}

cancelButton.addEventListener('click', () => {
    resetForm();
});

function resetForm() {
    noteForm.reset();

    editingNoteId = null;

    saveButton.textContent = 'Add Note';

    cancelButton.classList.add('hidden');
}

searchInput.addEventListener('input', () => {
    loadNotes(searchInput.value);
});

function showMessage(text) {
    message.textContent = text;

    setTimeout(() => {
        message.textContent = '';
    }, 2500);
}

function escapeHtml(text) {
    const div = document.createElement('div');

    div.textContent = text;

    return div.innerHTML;
}

loadNotes();