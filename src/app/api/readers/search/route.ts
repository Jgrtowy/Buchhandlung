import { type czytelnicy } from '@prisma/client';
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
            const readers: czytelnicy[] = await db.czytelnicy.findMany();
            return Response.json(readers);
        } catch (error) {
            console.log(error);
        }
    }

    try {
        const readers: czytelnicy[] = await db.czytelnicy.findMany({
            where: {
                OR: [
                    {
                        imie: {
                            startsWith: data.body.search,
                        },
                    },
                    {
                        nazwisko: {
                            startsWith: data.body.search,
                        },
                    },
                ],
            },
        });
        return Response.json(readers);
    } catch (error) {
        console.log(error);
        return Response.json({ message: 'error' });
    }
}
