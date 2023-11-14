import { type NextRequest } from 'next/server';
import { db } from '~/server/db';

interface Data {
    body: {
        id_k: number;
        firstName: string;
        lastName: string;
        returnDate: string;
    };
}

export async function POST(req: NextRequest) {
    try {
        const data = (await req.json()) as Data;
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
        return Response.json({ message: 'error' });
    }
}
