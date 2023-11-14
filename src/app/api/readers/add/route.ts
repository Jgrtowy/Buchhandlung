import type { NextRequest } from 'next/server';
import { db } from '~/server/db';

interface Data {
    body: {
        firstname: string;
        surname: string;
        email: string;
        phone: string;
    };
}

export async function POST(req: NextRequest) {
    const data = (await req.json()) as Data;
    const { firstname, surname, email, phone } = data.body;
    try {
        await db.czytelnicy.create({
            data: {
                imie: firstname,
                nazwisko: surname,
                email: email,
                telefon: parseInt(phone),
            },
        });
        return Response.json({ message: 'success' });
    } catch (error) {
        console.log(error);
        return Response.json({ message: 'error' });
    }
}
