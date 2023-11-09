import { type ksiazki } from '@prisma/client';
import { db } from '~/server/db';

export async function GET() {
    try {
        const books: ksiazki[] = await db.ksiazki.findMany();
        return Response.json(books);
    } catch (error) {
        console.log(error);
        return Response.json({ error });
    }
}
