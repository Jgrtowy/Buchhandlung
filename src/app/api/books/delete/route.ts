/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from 'next/server';
import { db } from '~/server/db';

export async function POST(req: NextRequest) {
    const data: any = await req.json();
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
    }
}
