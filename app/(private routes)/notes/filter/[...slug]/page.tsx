import { fetchNotes } from '@/lib/api/serverApi';
import { NoteTag } from '@/types/note';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const tag = slug[0];
    
    const title = tag === 'all'
        ? 'Notehub | All Tags'
        : `Notehub | Filtered by ${tag}`;
    
    const description = tag === 'all'
        ? 'All available notes'
        : `Notes filtered by ${tag}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://09auth1.vercel.app/notes/filter/${tag}`,
            images: [
                {
                    url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
                    width: 1200,
                    height: 630,
                    alt: `Note Hub - ${tag} Notes`,
                },
            ],
            type: 'article',
        },
    }
}

type Props = {
    params: Promise<{ slug: string[] }>;
};

export default async function FilterNotesPage({ params }: Props) {
    const { slug } = await params;
    const tag = slug[0] === 'all' ? undefined : (slug[0] as NoteTag);

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["notes", "", 1, tag],
        queryFn: () => fetchNotes("", 1, 12, tag),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient tag={tag}/>
        </HydrationBoundary>
    );
}