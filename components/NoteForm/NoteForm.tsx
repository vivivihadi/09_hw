"use client";

import css from "./NoteForm.module.css";
import { useId } from "react";
import type { NoteTag } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDraftStore } from "@/lib/store/noteStore";

export interface NoteFormValues{
    title: string,
    content: string,
    tag: NoteTag,
}

export function NoteForm() {
    const router = useRouter();
    const { draft, setDraft, clearDraft } = useDraftStore();

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        setDraft({
            ...draft,
            [event.target.name]: event.target.value,
        });
    };

    const fieldId = useId();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            clearDraft();
            toast.success("Note was created successfully!");
            router.push("/notes/filter/all");
        },
        onError: () => {
            toast.error("Cannot create a note now. Please try later.");
             }
    });

    const handleSubmit = (formData: FormData) => {
        const values: NoteFormValues = {
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            tag: formData.get('tag') as NoteTag,
        };
        mutate(values);
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <form action={handleSubmit} className={css.form}>
            <fieldset className={css.formGroup}>
                <label htmlFor={`${fieldId}-title`}>Title</label>
                <input
                    id={`${fieldId}-title`}
                    type="text"
                    name="title"
                    className={css.input}
                    required
                    minLength={3}
                    maxLength={50}
                    defaultValue={draft?.title}
                    onChange={handleChange}
                />
            </fieldset>

            <fieldset className={css.formGroup}>
                <label htmlFor={`${fieldId}-content`}>Content</label>
                <textarea
                    id={`${fieldId}-content`}
                    name="content"
                    rows={8}
                    className={css.textarea}
                     maxLength={500}
                    defaultValue={draft?.content}
                    onChange={handleChange}
                />
            </fieldset>

            <div className={css.formGroup}>
                <label htmlFor={`${fieldId}-tag`}>Tag</label>
                <select
                    id={`${fieldId}-tag`}
                    name="tag"
                    className={css.select}
                    required
                    defaultValue={draft?.tag}
                    onChange={handleChange}
                >
                    <option value="Todo">Todo</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Shopping">Shopping</option>
                </select>
            </div>

            <div className={css.actions}>
                <button
                    type="button"
                    className={css.cancelButton}
                    onClick={handleCancel}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={css.submitButton}
                    disabled={isPending}
                >
                    Create note
                </button>
            </div>
        </form>
    );
}