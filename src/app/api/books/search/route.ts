import { type ksiazki } from '@prisma/client';
import { type NextRequest } from 'next/server';
import { db } from '~/server/db';

interface Data {
    body: {
        search: string;
    };
}

export async function POST(req: NextRequest) {
    const data = (await req.json()) as Data;
    if (data.body.search === '') {
        try {
            const books: ksiazki[] = await db.ksiazki.findMany();
            return Response.json(books);
        } catch (error) {
            console.log(error);
        }
    }

    try {
        const books: ksiazki[] = await db.ksiazki.findMany({
            where: {
                OR: [
                    {
                        autor: {
                            startsWith: data.body.search,
                        },
                    },
                    {
                        tytul: {
                            startsWith: data.body.search,
                        },
                    },
                ],
            },
        });
        return Response.json(books);
    } catch (error) {
        console.log(error);
        return Response.json({ message: 'error' });
    }
}
