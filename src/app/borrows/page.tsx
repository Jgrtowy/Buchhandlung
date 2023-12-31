'use client';
import type { ksiazki } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { modal, toast } from '~/utils/swal';

interface Borrow {
    id: number;
    data_od: Date;
    data_do: Date;
    czytelnicy: {
        imie: string;
        nazwisko: string;
    };
    ksiazki: {
        id_k: number;
        tytul: string;
        autor: string;
        wypozyczona: boolean;
    };
}

interface BooksResponse {
    data: ksiazki[];
}

interface BorrowsResponse {
    data: Borrow[];
}

interface FormValues {
    firstName: string;
    lastName: string;
    returnDate: Date;
}

interface SuccessResponse {
    data: {
        message: SuccessMessage;
    };
}

type SuccessMessage = 'success' | 'error';

export default function Borrows() {
    const [data, setData] = useState<ksiazki[]>([]);
    const [borrowed, setBorrowed] = useState<Borrow[]>([]);

    const [search, setSearch] = useState('');
    const [secondSearch, setSecondSearch] = useState('');
    const [dataChanged, setDataChanged] = useState<boolean>(false);
    useEffect(() => {
        const dataFetch = async () =>
            await axios
                .post(`/api/books/search`, {
                    body: {
                        search,
                    },
                })
                .then((res: BooksResponse) => setData(res.data));
        dataFetch().catch((error) => console.error(error));
    }, [search, dataChanged]);

    useEffect(() => {
        const dataFetch = async () =>
            await axios
                .post(`/api/borrows/search`, {
                    body: {
                        search: secondSearch,
                    },
                })
                .then((res: BorrowsResponse) => setBorrowed(res.data));
        dataFetch().catch((error) => console.error(error));
    }, [secondSearch, dataChanged]);

    const borrowBook = async (id_k: number) => {
        const form = await modal.fire({
            title: 'Wypożycz książkę',
            html: `
            <form class="flex flex-col gap-3">
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Imię" type="text" data-form-type="other" name="firstName"/>
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Nazwisko" type="text" data-form-type="other" name="lastName"/>
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Data zwrotu" type="date" data-form-type="other" name="returnDate"/>
            </form>
            `,
            confirmButtonText: 'Dodaj',
            preConfirm: () => {
                const form = document.querySelector('form')!;
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                const values = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    returnDate: data.returnDate,
                };
                return values;
            },
        });

        if (!form.isConfirmed) return;

        const { firstName, lastName, returnDate } = form.value as FormValues;
        if (!firstName || !lastName || !returnDate)
            return await toast.fire({
                icon: 'error',
                title: 'Wypełnij wszystkie pola',
            });

        try {
            await axios
                .post('/api/borrows/setBorrowed', {
                    body: {
                        id_k,
                        firstName,
                        lastName,
                        returnDate,
                    },
                })
                .then(async (res: SuccessResponse) => {
                    if (res.data.message === 'success') {
                        setDataChanged(!dataChanged);
                        await toast.fire({
                            icon: 'success',
                            title: 'Wypożyczono książkę',
                        });
                    } else {
                        await toast.fire({
                            icon: 'error',
                            title: 'Nie znaleziono czytelnika',
                        });
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    const returnBook = async (id: number, id_k: number) => {
        try {
            await axios
                .post('/api/borrows/returnBook', {
                    body: {
                        id,
                        id_k,
                    },
                })
                .then(async (res: SuccessResponse) => {
                    if (res.data.message === 'success') {
                        setDataChanged(!dataChanged);
                        await toast.fire({
                            icon: 'success',
                            title: 'Zwrócono książkę',
                        });
                    } else {
                        await toast.fire({
                            icon: 'error',
                            title: 'Nie można zwrócić książki',
                        });
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center text-white w-100 h-screen gap-5 mt-5">
            <div>
                <h1 className="text-4xl">Wypożyczone</h1>
            </div>
            <div className="flex gap-5">
                <input type="text" placeholder="Szukaj" onInput={(e) => setSecondSearch(e.currentTarget.value)} value={secondSearch} className="w-25 text-white px-3 py-1 h-12 bg-[#100f14] outline-none border-2 border-[#57bd8a] rounded-lg text-2xl" />
            </div>
            {borrowed.length !== 0 && (
                <>
                    <div className="w-screen flex flex-col items-center backdrop-blur-[1.5px]">
                        <div className="flex justify-around w-screen bg-gray-700 bg-opacity-50 py-3">
                            <div className="w-72"></div>
                            <div className="text-3xl w-52">Tytuł</div>
                            <div className="text-3xl w-52">Autor</div>
                            <div className="text-3xl w-52">Czytelnik</div>
                            <div className="text-3xl w-52">Data od</div>
                            <div className="text-3xl w-52">Data do</div>
                        </div>
                        {borrowed.length !== 0 &&
                            borrowed.map((item: Borrow) => {
                                const dateFrom = new Date(item.data_od);
                                const dateTo = new Date(item.data_do);
                                if (item.ksiazki.wypozyczona) {
                                    return (
                                        <div key={v4()} className="py-3 flex justify-around items-center w-screen bg-transparent odd:bg-gray-700/50">
                                            <button className="bg-transparent border-2 w-36 border-purple-500 outline-none rounded-lg text-lg px-3 hover:bg-purple-500 transition duration-300 ease-in-out" onClick={() => returnBook(item.id, item.ksiazki.id_k)}>
                                                Oddaj
                                            </button>
                                            <div className="text-lg w-52 ">{item.ksiazki.tytul}</div>
                                            <div className="text-lg w-52 ">{item.ksiazki.autor}</div>
                                            <div className="text-lg w-52 ">
                                                {item.czytelnicy.imie} {item.czytelnicy.nazwisko}
                                            </div>
                                            <div className="text-lg w-52 ">{dateFrom instanceof Date ? dateFrom.toLocaleDateString('en-GB') : 'N/A'}</div>
                                            <div className="text-lg w-52 ">{dateTo instanceof Date ? dateTo.toLocaleDateString('en-GB') : 'N/A'}</div>
                                        </div>
                                    );
                                } else {
                                    return;
                                }
                            })}
                    </div>
                </>
            )}
            {data.length === 0 && <h1 className="text-6xl">Nie znaleziono wypożyczonych książek</h1>}
            <div>
                <h1 className="text-4xl">Reszta książek</h1>
            </div>
            <div className="flex gap-5">
                <input type="text" placeholder="Szukaj" onInput={(e) => setSearch(e.currentTarget.value)} value={search} className="w-25 text-white px-3 py-1 h-12 bg-[#100f14] outline-none border-2 border-[#57bd8a] rounded-lg text-2xl" />
            </div>
            {data.length !== 0 && (
                <>
                    <div className="w-screen flex flex-col items-center backdrop-blur-[1.5px]">
                        <div className="flex justify-around w-screen bg-gray-700 bg-opacity-50 py-3">
                            <div className="w-72"></div>
                            <div className="text-3xl w-72">Tytuł</div>
                            <div className="text-3xl w-72">Autor</div>
                        </div>
                        {data.length !== 0 &&
                            data.map((book) => {
                                if (!book.wypozyczona) {
                                    return (
                                        <div key={v4()} className="py-3 flex justify-around items-center w-screen bg-transparent odd:bg-gray-700/50">
                                            <button className="bg-transparent border-2 w-36 border-blue-500 outline-none rounded-lg text-lg px-3 hover:bg-blue-500 transition duration-300 ease-in-out" onClick={() => borrowBook(book.id_k)}>
                                                Wypożycz
                                            </button>
                                            <div className="text-lg w-72 ">{book.tytul}</div>
                                            <div className="text-lg w-72 ">{book.autor}</div>
                                        </div>
                                    );
                                } else {
                                    return;
                                }
                            })}
                    </div>
                </>
            )}
            {data.length === 0 && <h1 className="text-6xl">Nie znaleziono książek</h1>}
        </div>
    );
}
