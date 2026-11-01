'use client';

import css from "./page.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Toaster } from 'react-hot-toast';
import { fetchNotes } from "@/lib/api/clientApi";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
// import Modal from "@/components/Modal/Modal";
// import { NoteForm } from "@/components/NoteForm/NoteForm";
import type { NoteTag } from "@/types/note";
import Link from "next/link";

type NotesClientProps = {
    tag?: NoteTag;
};

export default function NotesClient({tag}:NotesClientProps) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    // const [isModalOpen, setIsModalOpen] = useState(false);

    const { data } = useQuery({
        queryKey: ["notes", search, page, tag],
        queryFn: () => fetchNotes(search, page, 12, tag),
        placeholderData: keepPreviousData,
    });

     const debouncedSearch = useDebouncedCallback(
        (value: string) => {
            setSearch(value);
            setPage(1);
        },
        300
    );

    return (
        <div className={css.app}>
            <header className={css.toolbar}>

                <SearchBox onChange={debouncedSearch} />
                {data && (
                    <Pagination
                        totalPages={data.totalPages}
                        page={page}
                        onPageChange={setPage}
                    />
                )}
                <div className={css.panel} >
                    <Link href="/notes/action/create" className={css.button} >Create note +</Link>
                </div>
                
            </header>
            <Toaster />
            {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}
            {/* {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm
                        onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )} */}
        </div>
    );
}