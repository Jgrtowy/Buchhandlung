/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';
import type { czytelnicy } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import '~/styles/nthList.css';
import { modal, toast } from '~/utils/swal';

export default function Books() {
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
                .then((res) => setData(res.data));
        dataFetch().catch((error) => console.error(error));
    }, [search, dataChanged]);

    const addPopup = async () => {
        const form = await modal.fire({
            title: 'Dodaj książkę',
            html: `
            <form class="flex flex-col gap-3">
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Imię" type="text" data-form-type="other" name="firstname"/>
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Nazwisko" type="text" data-form-type="other" name="surname"/>
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="E-mail" type="text" data-form-type="other" name="email"/>
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Telefon" type="date" data-form-type="other" name="phone"/>
            </form>
            `,
            confirmButtonText: 'Dodaj',
            preConfirm: () => {
                const form = document.querySelector('form') as HTMLFormElement;
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                const values = {
                    firstname: data.firstname,
                    surname: data.surname,
                    email: data.email,
                    phone: data.phone,
                };
                return values;
            },
        });

        if (!form.isConfirmed) return;

        const { firstname, surname, email, phone } = form.value;

        try {
            await axios
                .post(`/api/readers/add`, {
                    body: { firstname, surname, email, phone },
                })
                .then(async () => {
                    setDataChanged(!dataChanged);
                    await toast.fire({
                        icon: 'success',
                        title: 'Dodano książkę',
                    });
                });
        } catch (error) {
            console.error(error);
        }
    };

    const deleteReader = async (id: number) => {
        await axios
            .post('/api/readers/delete', {
                body: {
                    id,
                },
            })
            .then(() => {
                setDataChanged(!dataChanged);
            });
    };
    return (
        <div className="flex flex-col items-center text-white w-100 h-screen gap-5">
            <div className="flex gap-5 mt-5">
                <button onClick={addPopup} className="bg-[#100f14] border-2  border-[#57bd8a] outline-none rounded-lg text-2xl px-3 py-1 h-12">
                    Dodaj
                </button>
                <input type="text" onInput={(e) => setSearch(e.currentTarget.value)} value={search} className="w-25 text-white px-3 py-1 h-12 bg-[#100f14] outline-none border-2 border-[#57bd8a] rounded-lg text-2xl" />
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
                                <div key={reader.id_c} className="py-3 flex justify-around items-center w-screen list">
                                    <button className="bg-transparent border-2 border-red-500 outline-none rounded-lg text-lg px-3" onClick={() => deleteReader(reader.id_c)}>
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
            {data.length === 0 && <h1 className="text-6xl">Nie znaleziono książek</h1>}
        </div>
    );
}
