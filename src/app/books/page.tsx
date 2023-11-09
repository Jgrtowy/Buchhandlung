/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';
import type { ksiazki } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Books() {
    const [data, setData] = useState<ksiazki[]>([]);

    useEffect(() => {
        const dataFetch = async () =>
            await fetch('http://localhost:3000/api/books/get')
                .then((res) => res.json())
                .then((res) => setData(res));
        dataFetch().catch((error) => console.error(error));
    }, []);

    const [search, setSearch] = useState('');

    useEffect(() => {
        const dataFetch = async () =>
            await axios
                .post(`http://localhost:3000/api/books/search`, {
                    body: {
                        search: search,
                    },
                })
                .then((res) => setData(res.data));
        dataFetch().catch((error) => console.error(error));
    }, [search]);

    return (
        <div className="flex flex-col text-white w-100 h-screen">
            <input type="text" onInput={(e) => setSearch(e.currentTarget.value)} value={search} className="w-25" />
            {data.map((book) => (
                <div key={book.id_k} className="flex justify-center w-100">
                    <h1>{book.tytul}</h1>
                    <h2>{book.autor}</h2>
                    <h3>{book.gatunek}</h3>
                </div>
            ))}
        </div>
    );
}
