import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";
import nextServer from "./api";

interface FetchNotesResponse{
    notes: Note[];
    totalPages: number,
}

export interface CreateNote {
    title: string;
    content: string;
    tag: NoteTag;
}

export type RegisterRequest = {
    email: string,
    password: string,
};

export type LoginRequest = {
    email: string,
    password: string,
};

export type CheckSession = {
    success: boolean,
};

export type UpdateMeRequest = {
    username: string,
}

export const fetchNotes = async (search: string, page: number, perPage = 12, tag?: string): Promise<FetchNotesResponse> => {
    const response = await nextServer.get<FetchNotesResponse>(
        "/notes",
        {
            params: {
                search,
                page,
                perPage,
                tag,
            },
             }
    );
    
    return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await nextServer.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (payload: CreateNote): Promise<Note> => {
    const response = await nextServer.post<Note>("/notes", payload);
    return response.data;
};

export const deleteNote = async (noteId: Note["id"]): Promise<Note> => {
    const response = await nextServer.delete<Note>(`/notes/${noteId}`);
    return response.data;
};

export const register = async (payload: RegisterRequest): Promise<User> => {
    const response = await nextServer.post<User>("/auth/register", payload);
    return response.data;
};

export const login = async (payload: LoginRequest): Promise<User> => {
    const response = await nextServer.post<User>("/auth/login", payload);
    return response.data;
};

export const logout = async (): Promise<void> => {
    await nextServer.post("/auth/logout");
};

export const checkSession = async (): Promise<boolean> => {
    const response = await nextServer.get<CheckSession>("/auth/session");
    return response.data.success;
}

export const getMe = async (): Promise<User> => {
    const { data } = await nextServer.get<User>("/users/me");
    return data;
};

export const updateMe = async (payload: UpdateMeRequest): Promise<User> => {
    const { data } = await nextServer.patch("/users/me", payload);
    return data;
};