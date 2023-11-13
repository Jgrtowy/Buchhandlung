/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextRequest } from 'next/server';
import { db } from '~/server/db';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { id_k, firstName, lastName, returnDate } = data.body;
        await db.ksiazki.update({
            where: {
                id_k,
            },
            data: {
                wypozyczona: true,
            },
        });
        const reader = await db.czytelnicy.findFirst({
            where: {
                AND: [
                    {
                        imie: firstName,
                    },
                    {
                        nazwisko: lastName,
                    },
                ],
            },
        });
        await db.wypozyczalnia.create({
            data: {
                ksiazki: {
                    connect: {
                        id_k,
                    },
                },
                czytelnicy: {
                    connect: {
                        id_c: reader?.id_c,
                    },
                },
                data_od: new Date(),
                data_do: new Date(returnDate),
            },
        });
        return Response.json({ message: 'success' });
    } catch (error) {
        console.log(error);
    }
}
