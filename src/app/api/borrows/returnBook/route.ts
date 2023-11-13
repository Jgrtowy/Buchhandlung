/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from 'next/server';
import { db } from '~/server/db';

export async function POST(req: NextRequest) {
    const data = await req.json();
    const { id_k } = data.body;
    await db.ksiazki.update({
        where: {
            id_k,
        },
        data: {
            wypozyczona: false,
        },
    });

    return Response.json({ message: 'success' });
}
