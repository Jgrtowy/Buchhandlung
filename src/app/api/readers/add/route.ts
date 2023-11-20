import type { NextRequest } from 'next/server';
import { db } from '~/server/db';

interface Data {
    body: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
}

export async function POST(req: NextRequest) {
    const data = (await req.json()) as Data;
    const { firstName, lastName, email, phone } = data.body;
    console.log(firstName);

    try {
        await db.czytelnicy.create({
            data: {
                imie: firstName,
                nazwisko: lastName,
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
