import { NoteForm } from "@/components/NoteForm/NoteForm";
import css from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "NoteHub | New Note",
    description: "Create New Note",
    openGraph: {
        title: "NoteHub | New Note",
        description: "Create New Note",
        url: 'https://08zustand.vercel.app/action/create',
        siteName: 'NoteHub',
        images: [
            {
                url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
                width: 1200,
                height: 630,
                alt: "Note Hub Logo | Create New Note",
            },
        ],
    }
};

export default function CreateNote() {
    return (
        <main className={css.main}>
            <div className={css.container}>
                <h1 className={css.title}>Create note</h1>
                <NoteForm/>
            </div>
        </main>

    );
}