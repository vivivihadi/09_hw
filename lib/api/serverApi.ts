import { cookies } from 'next/headers';
import nextServer from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';

interface FetchNotesResponse{
    notes: Note[];
    totalPages: number,
}

export const fetchNotes = async (search: string, page: number, perPage = 12, tag?: string): Promise<FetchNotesResponse> => {
    const cookieStore = await cookies();
    const { data } = await nextServer.get<FetchNotesResponse>(
        "/notes",
        {
            params: {
                search,
                page,
                perPage,
                tag,
            },
            headers: {
                Cookie: cookieStore.toString(),
            },
        }
    );
    
    return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
    const cookieStore = await cookies();
    const { data } = await nextServer.get<Note>(`/notes/${id}`, {
        headers: {
            Cookie: cookieStore.toString(),
        },
    });
    return data;
};

export const checkServerSession = async () => {
    const cookieStore = await cookies();
    const response = await nextServer.get('/auth/session', {
        headers: {
            Cookie: cookieStore.toString(),
        },
    });
    return response;
};

export const getServerMe = async (): Promise<User> => {
    const cookieStore = await cookies();
    const { data } = await nextServer.get('/users/me', {
        headers: {
            Cookie: cookieStore.toString(),
        },
    });
    return data;
};