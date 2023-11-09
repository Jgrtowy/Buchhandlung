/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ksiazki } from '@prisma/client';
import { NextRequest } from 'next/server';
import { db } from '~/server/db';

export async function POST(req: NextRequest) {
    const data: any = await req.json();
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
    }
}
