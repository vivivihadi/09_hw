import css from "@/app/page.module.css"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: '404 Notehub - Page Not Found',
    description: 'The page you are looking for could not be reached. Return to the NoteHub Homepage',
    openGraph: {
        title: '404 Notehub - Page Not Found',
        description: 'The page you are looking for could not be reached. Return to the NoteHub Homepage',
        url: 'https://09-auth-kappa-five.vercel.app/404',
        images: [
            {
                url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
                width: 1200,
                height: 630,
                alt: "Note Hub Logo",
            },
        ],
    },
};

export default function NotFound() {
    return (
        <div className={css.container} >
            <h1 className={css.title}>404 - Page not found</h1>
            <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
        </div>
    );
}