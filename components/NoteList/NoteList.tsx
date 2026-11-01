import css from "./NoteList.module.css";
import type { Note } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api/clientApi";
import toast from 'react-hot-toast';
import Link from "next/link";

interface NoteListProps{
    notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            toast.success("Note deleted successfully.");
        },
        onError: () => {
            toast.error("Failed to delete the note.");
        },
    })
    return (
        <ul className={css.list}>
            {notes.map((note) => (
                <li className={css.listItem} key={note.id}>
                    <h2 className={css.title}>{note.title}</h2>
                    <p className={css.content}>{note.content}</p>
                    <div className={css.footer}>
                        <span className={css.tag}>{note.tag}</span>
                        <Link className={css.link} href={`/notes/${note.id}`}>View details</Link>
                        <button className={css.button} onClick={()=>mutate(note.id)}>Delete</button>
                    </div>
                </li>
            ))}
        </ul>
    );
}