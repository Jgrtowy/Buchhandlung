import type { NextRequest } from 'next/server';
import { db } from '~/server/db';

interface Data {
    body: {
        title: string;
        author: string;
        genre: string;
        releaseDate: string;
    };
}

export async function POST(req: NextRequest) {
    const data = (await req.json()) as Data;
    const { title, author, genre, releaseDate } = data.body;
    try {
        await db.ksiazki.create({
            data: {
                tytul: title,
                autor: author,
                gatunek: genre,
                data_wydania: new Date(releaseDate),
                wypozyczona: false,
            },
        });
        return Response.json({ message: 'success' });
    } catch (error) {
        console.log(error);
        return Response.json({ message: 'error' });
    }
}
