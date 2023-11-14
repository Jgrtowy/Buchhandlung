import type { NextRequest } from 'next/server';
import { db } from '~/server/db';

interface Data {
    body: {
        id_k: number;
    };
}

export async function POST(req: NextRequest) {
    const data = (await req.json()) as Data;
    const { id_k } = data.body;
    try {
        await db.ksiazki.update({
            where: {
                id_k,
            },
            data: {
                wypozyczona: false,
            },
        });

        return Response.json({ message: 'success' });
    } catch (error) {
        console.log(error);
        return Response.json({ message: 'error' });
    }
}
