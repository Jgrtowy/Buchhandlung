import { type ksiazki } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { db } from '~/server/db';

export async function POST(req: NextRequest) {
    console.log(req.body);

    try {
        const books: ksiazki[] = await db.ksiazki.findMany();
        return Response.json(books);
    } catch (error) {
        console.log(error);
        return Response.json({ error });
    }
}
