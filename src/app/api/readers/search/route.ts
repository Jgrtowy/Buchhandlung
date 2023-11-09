/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { czytelnicy } from '@prisma/client';
import { NextRequest } from 'next/server';
import { db } from '~/server/db';

export async function POST(req: NextRequest) {
    const data: any = await req.json();
    if (data.body.search === '') {
        try {
            const readers: czytelnicy[] = await db.czytelnicy.findMany();
            return Response.json(readers);
        } catch (error) {
            console.log(error);
        }
    }

    try {
        const readers: czytelnicy[] = await db.czytelnicy.findMany({
            where: {
                OR: [
                    {
                        imie: {
                            startsWith: data.body.search,
                        },
                    },
                    {
                        nazwisko: {
                            startsWith: data.body.search,
                        },
                    },
                ],
            },
        });
        return Response.json(readers);
    } catch (error) {
        console.log(error);
    }
}
