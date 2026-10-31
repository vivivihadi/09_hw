'use client';

import css from "./NotePreview.module.css";
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api/clientApi';

type Props = {
  noteId: string;
};

export default function NotePreview({ noteId }: Props) {
  const router = useRouter();

  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <Modal onClose={() => router.back()}>
        <p>Loading...</p>
      </Modal>
    );
  }

  if (error || !note) {
    return (
      <Modal onClose={() => router.back()}>
        <p>Failed to load note</p>
      </Modal>
    );
  }

  return (
    <Modal onClose={() => router.back()}>
      <div>
        <div className={css.header}>
          <h2>{note.title}</h2>
          {note.tag && <span className={css.tag}>{note.tag}</span>}
        </div>

        <p className={css.content}>{note.content}</p>

        {note.createdAt && (
          <div className={css.date}>
            {new Date(note.createdAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </Modal>
  );
}