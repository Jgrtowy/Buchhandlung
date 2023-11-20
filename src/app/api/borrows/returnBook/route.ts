import type { NextRequest } from 'next/server';
import { db } from '~/server/db';

interface Data {
    body: {
        id: number;
        id_k: number;
    };
}

export async function POST(req: NextRequest) {
    const data = (await req.json()) as Data;
    const { id, id_k } = data.body;
    try {
        await db.ksiazki.update({
            where: {
                id_k,
            },
            data: {
                wypozyczona: false,
            },
        });

        await db.wypozyczalnia.delete({
            where: {
                id: id_k,
            },
        });
        return Response.json({ message: 'success' });
    } catch (error) {
        console.log(error);
        return Response.json({ message: 'error' });
    }
}
