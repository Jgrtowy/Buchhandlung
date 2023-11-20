'use client';
import type { czytelnicy } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { modal, toast } from '~/utils/swal';

interface ReadersResponse {
    data: czytelnicy[];
}

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface SuccessResponse {
    data: {
        message: SuccessMessage;
    };
}

type SuccessMessage = 'success' | 'error';

export default function Readers() {
    const [data, setData] = useState<czytelnicy[]>([]);

    const [search, setSearch] = useState('');
    const [dataChanged, setDataChanged] = useState<boolean>(false);
    useEffect(() => {
        const dataFetch = async () =>
            await axios
                .post(`/api/readers/search`, {
                    body: {
                        search: search,
                    },
                })
                .then((res: ReadersResponse) => setData(res.data));
        dataFetch().catch((error) => console.error(error));
    }, [search, dataChanged]);

    const addPopup = async () => {
        try {
            const form = await modal.fire({
                title: 'Dodaj czytelnika',
                html: `
            <form class="flex flex-col gap-3">
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Imię" type="text" data-form-type="other" name="firstName"/>
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Nazwisko" type="text" data-form-type="other" name="lastName"/>
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="E-mail" type="text" data-form-type="other" name="email"/>
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Telefon" type="text" data-form-type="other" name="phone"/>
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
                        email: data.email,
                        phone: data.phone,
                    };
                    return values;
                },
            });

            if (!form.isConfirmed) return;

            const { firstName, lastName, email, phone } = form.value as FormValues;

            if (/^[0-9]{9}$/.test(phone) === false) {
                await toast.fire({
                    icon: 'error',
                    title: 'Niepoprawny numer telefonu',
                });
                return;
            }

            await axios
                .post(`/api/readers/add`, {
                    body: { firstName, lastName, email, phone },
                })
                .then(async (res: SuccessResponse) => {
                    if (res.data.message == 'success') {
                        setDataChanged(!dataChanged);
                        await toast.fire({
                            icon: 'success',
                            title: 'Dodano czytelnika',
                        });
                    } else {
                        await toast.fire({
                            icon: 'error',
                            title: 'Nie można dodać czytelnika',
                        });
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    const deleteReader = async (id: number) => {
        try {
            const confirmation = await modal.fire({
                title: 'Czy na pewno chcesz usunąć książkę?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tak',
                cancelButtonText: 'Nie',
            });

            if (!confirmation.isConfirmed) return;

            await axios
                .post('/api/readers/delete', {
                    body: {
                        id,
                    },
                })
                .then(async (res: SuccessResponse) => {
                    if (res.data.message == 'success') {
                        setDataChanged(!dataChanged);
                        await toast.fire({
                            icon: 'success',
                            title: 'Usunięto czytelnika',
                        });
                    } else {
                        await toast.fire({
                            icon: 'error',
                            title: 'Nie można usunąć czytelnika',
                        });
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="flex flex-col items-center text-white w-100 h-screen gap-5">
            <div className="flex gap-5 mt-5">
                <button onClick={addPopup} className="bg-[#100f14] border-2  border-[#57bd8a] outline-none rounded-lg text-2xl px-3 py-1 h-12 flex justify-center items-center hover:bg-[#57bd8a] transition duration-300 ease-in-out">
                    Dodaj
                </button>
                <input type="text" placeholder="Szukaj" onInput={(e) => setSearch(e.currentTarget.value)} value={search} className="w-25 text-white px-3 py-1 h-12 bg-[#100f14] outline-none border-2 border-[#57bd8a] rounded-lg text-2xl" />
            </div>

            {data.length !== 0 && (
                <div className="w-screen flex flex-col items-center backdrop-blur-[1.5px]">
                    <div className="flex justify-around w-screen bg-gray-700 bg-opacity-50 py-3">
                        <div className="w-72"></div>
                        <div className="text-3xl w-72">Imię</div>
                        <div className="text-3xl w-72">Nazwisko</div>
                        <div className="text-3xl w-72">Telefon</div>
                        <div className="text-3xl w-72">E-mail</div>
                    </div>
                    {data.length !== 0 &&
                        data.map((reader) => {
                            return (
                                <div key={v4()} className="py-3 flex justify-around items-center w-screen bg-transparent odd:bg-gray-700/50">
                                    <button className="bg-transparent border-2 border-red-500 outline-none rounded-lg text-lg px-3 hover:bg-red-500 transition duration-300 ease-in-out" onClick={() => deleteReader(reader.id_c)}>
                                        Usuń
                                    </button>
                                    <div className="text-lg w-72 ">{reader.imie}</div>
                                    <div className="text-lg w-72 ">{reader.nazwisko}</div>
                                    <div className="text-lg w-72 ">{reader.telefon}</div>
                                    <div className="text-lg w-72 ">{reader.email}</div>
                                </div>
                            );
                        })}
                </div>
            )}
            {data.length === 0 && <h1 className="text-6xl">Nie znaleziono czytelników</h1>}
        </div>
    );
}
