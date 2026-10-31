import css from "./LayoutNotes.module.css";

type LayoutNotesProps = {
    children: React.ReactNode;
    sidebar: React.ReactNode;
};

export default function LayoutNotes({ children, sidebar }: LayoutNotesProps) {
    return (
        <section className={css.container}>
            <aside className={css.sidebar}>{sidebar}</aside>
            <div className={css.notesWrapper}>{children}</div>   
        </section>
    );
}