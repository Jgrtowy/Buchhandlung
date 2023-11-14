import type { NextRequest } from 'next/server';
import { db } from '~/server/db';

interface Data {
    body: {
        id: number;
    };
}

export async function POST(req: NextRequest) {
    const data = (await req.json()) as Data;
    const { id } = data.body;
    try {
        await db.ksiazki.delete({
            where: {
                id_k: id,
            },
        });
        return Response.json('success');
    } catch (error) {
        console.error(error);
        return Response.json('error');
    }
}
