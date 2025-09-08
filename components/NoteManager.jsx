// components/NoteManager.jsx
'use client';
import { useState, useEffect } from 'react';

// Editor Component (Modal)
function NoteEditor({ activeNote, onSave, onCancel }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (activeNote) {
            setTitle(activeNote.title);
            setContent(activeNote.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [activeNote]);

    const handleSave = () => {
        onSave({ ...activeNote, title, content });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note Title"
                    className="w-full text-2xl font-bold p-2 border-b-2 mb-4 focus:outline-none focus:border-blue-500"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your note..."
                    className="w-full h-64 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end gap-4 mt-4">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
                </div>
            </div>
        </div>
    );
}


// Main Note Manager Component
export default function NoteManager() {
    const [notes, setNotes] = useState([]);
    const [activeNote, setActiveNote] = useState(null); // null when no note is open, object when editing/creating
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotes = async () => {
        setIsLoading(true);
        const res = await fetch('/api/notes');
        const data = await res.json();
        setNotes(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleNewNote = () => {
        setActiveNote({ title: '', content: '' }); // An empty object signifies a new note
    };

    const handleSelectNote = (note) => {
        setActiveNote(note);
    };
    
    const handleCancel = () => {
        setActiveNote(null);
    };

    const handleSaveNote = async (noteToSave) => {
        if (noteToSave._id) { // Existing note
            await fetch(`/api/notes/${noteToSave._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteToSave),
            });
        } else { // New note
            await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteToSave),
            });
        }
        setActiveNote(null);
        fetchNotes();
    };
    
    const handleDeleteNote = async (id) => {
        if (!confirm("Are you sure you want to delete this note?")) return;
        await fetch(`/api/notes/${id}`, { method: 'DELETE' });
        fetchNotes();
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Notes</h2>
                <button onClick={handleNewNote} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">+ New Note</button>
            </div>

            {activeNote !== null && <NoteEditor activeNote={activeNote} onSave={handleSaveNote} onCancel={handleCancel} />}

            <div className="space-y-2">
                {isLoading ? <p>Loading notes...</p> : notes.length > 0 ? (
                    notes.map(note => (
                       <div key={note._id} className="p-3 rounded-lg border flex justify-between items-center hover:bg-gray-50 cursor-pointer" onClick={() => handleSelectNote(note)}>
                           <p className="font-medium text-gray-800">{note.title}</p>
                           <button onClick={(e) => { e.stopPropagation(); handleDeleteNote(note._id);}} className="text-gray-400 hover:text-red-500 text-xs">Delete</button>
                       </div>
                    ))
                ) : (
                    <p className="text-gray-500">You have no notes. Create your first one!</p>
                )}
            </div>
        </div>
    );
}