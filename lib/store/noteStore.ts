import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { CreateNote } from "../api/clientApi";

type NoteDraftStore = {
    draft: CreateNote;
    setDraft: (note: CreateNote) => void;
    clearDraft: () => void;
};

const initialDraft: CreateNote = {
    title: '',
    content: '',
    tag: 'Todo',
};

export const useDraftStore = create<NoteDraftStore>()(
    persist(
        (set) => ({
            draft: initialDraft,
            setDraft: (note) => set(() => ({ draft: note })),
            clearDraft: () => set(() => ({ draft: initialDraft })),
        }),
        {
            name: 'note-draft',
            partialize: (state) => ({ draft: state.draft }),
        },
    ),
);