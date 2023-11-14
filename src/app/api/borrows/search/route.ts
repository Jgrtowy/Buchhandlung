import { type NextRequest } from 'next/server';
import { db } from '~/server/db';

interface Data {
    body: {
        search: string;
    };
}

export async function POST(req: NextRequest) {
    const data = (await req.json()) as Data;
    if (data.body.search === '') {
        try {
            const borrows = await db.wypozyczalnia.findMany({
                select: {
                    data_od: true,
                    data_do: true,
                    czytelnicy: {
                        select: {
                            imie: true,
                            nazwisko: true,
                        },
                    },
                    ksiazki: {
                        select: {
                            id_k: true,
                            tytul: true,
                            autor: true,
                            wypozyczona: true,
                        },
                    },
                },
            });
            return Response.json(borrows);
        } catch (error) {
            console.log(error);
        }
    }

    try {
        const results = await db.wypozyczalnia.findMany({
            where: {
                OR: [
                    {
                        czytelnicy: {
                            OR: [
                                {
                                    imie: {
                                        contains: data.body.search,
                                    },
                                },
                                {
                                    nazwisko: {
                                        contains: data.body.search,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        ksiazki: {
                            OR: [
                                {
                                    tytul: {
                                        contains: data.body.search,
                                    },
                                },
                                {
                                    autor: {
                                        contains: data.body.search,
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
            select: {
                data_od: true,
                data_do: true,
                czytelnicy: {
                    select: {
                        imie: true,
                        nazwisko: true,
                    },
                },
                ksiazki: {
                    select: {
                        id_k: true,
                        tytul: true,
                        autor: true,
                        wypozyczona: true,
                    },
                },
            },
        });
        return Response.json(results);
    } catch (error) {
        console.log(error);
    }
}
