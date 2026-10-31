import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/api';
import NoteDetailsClient from './NoteDetails.client';
import { Metadata } from "next";

export async function generateMetadata({ params }: NoteDetailsPageProps): Promise<Metadata> {
    const { id } = await params;
    const note = await fetchNoteById(id);

    return {
        title: `NoteHub | ${note.title}`,
        description: note.content.slice(0, 30),
        openGraph: {
            title: `NoteHub | ${note.title}`,
            description: note.content.slice(0, 30),
            url: `https://08zustand.vercel.app/notes/${id}`,
            images: [
                {
                    url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
                    width: 1200,
                    height: 630,
                    alt: `Note Hub - ${note.title}`,
                },
            ],
            type: 'article',
        },
    }
}

interface NoteDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({ params }: NoteDetailsPageProps) {
    const { id } = await params;
    const queryClient = new QueryClient();

     await queryClient.prefetchQuery({
        queryKey: ['note', id],
        queryFn: () => fetchNoteById(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NoteDetailsClient />
        </HydrationBoundary>
    );
}