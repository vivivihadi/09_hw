import css from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={css.footer}>
            <div className={css.content}>
                <p>© 2026 NoteHub. All rights reserved.</p>
                <div className={css.wrap}>
                    <p>Developer: Victoria Oliynyk</p>
                    <p>
                        Contact us: <a href="mailto:student@notehub.app">student@notehub.app</a>
                    </p>
                </div>
            </div>
        </footer>

    );
}