import axios from "axios";
import type { Note, NoteTag } from "@/types/note";

const nextServer = axios.create({
baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
withCredentials: true,
});

// Отримання списку нотаток
export async function fetchNotes(
search: string,
page: number,
perPage: number,
tag?: NoteTag,
) {
const { data } = await nextServer.get<{
notes: Note[];
totalPages: number;
}>("/notes", {
params: {
search,
page,
perPage,
tag,
},
});

return data;
}

// Отримання однієї нотатки
export async function fetchNoteById(id: string) {
const { data } = await nextServer.get<Note>(`/notes/${id}`);
return data;
}

// Створення нотатки
export async function createNote(note: {
title: string;
content: string;
tag: NoteTag;
}) {
const { data } = await nextServer.post<Note>("/notes", note);
return data;
}

// Видалення нотатки
export async function deleteNote(id: string) {
const { data } = await nextServer.delete(`/notes/${id}`);
return data;
}

export default nextServer;