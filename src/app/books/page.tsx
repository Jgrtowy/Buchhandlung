'use client';
import type { ksiazki } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import '~/styles/nthList.css';
import { modal, toast } from '~/utils/swal';

interface BooksResponse {
    data: ksiazki[];
}

interface FormValues {
    title: string;
    author: string;
    genre: string;
    releaseDate: Date;
}

interface SuccessResponse {
    data: {
        message: SuccessMessage;
    };
}

type SuccessMessage = 'success' | 'error';

export default function Books() {
    const [data, setData] = useState<ksiazki[]>([]);

    const [search, setSearch] = useState('');
    const [dataChanged, setDataChanged] = useState<boolean>(false);
    useEffect(() => {
        const dataFetch = async () =>
            await axios
                .post(`/api/books/search`, {
                    body: {
                        search: search,
                    },
                })
                .then((res: BooksResponse) => setData(res.data));
        dataFetch().catch((error) => console.error(error));
    }, [search, dataChanged]);

    const addPopup = async () => {
        const form = await modal.fire({
            title: 'Dodaj książkę',
            html: `
            <form class="flex flex-col gap-3">
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Tytuł" type="text" data-form-type="other" name="title"/>
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Autor" type="text" data-form-type="other" name="author"/>
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Gatunek" type="text" data-form-type="other" name="genre"/>
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Data wydania" type="date" data-form-type="other" name="date"/>
            </form>
            `,
            confirmButtonText: 'Dodaj',
            preConfirm: () => {
                const form = document.querySelector('form')!;
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                const values = {
                    title: data.title,
                    author: data.author,
                    genre: data.genre,
                    releaseDate: data.date ?? new Date(),
                };
                return values;
            },
        });

        if (!form.isConfirmed) return;

        const { title, author, genre, releaseDate } = form.value as FormValues;

        try {
            await axios
                .post(`/api/books/add`, {
                    body: {
                        title: title,
                        author: author,
                        genre: genre,
                        releaseDate: releaseDate,
                    },
                })
                .then(async (res: SuccessResponse) => {
                    if (res.data.message === 'success') {
                        setDataChanged(!dataChanged);
                        await toast.fire({
                            icon: 'success',
                            title: 'Dodano książkę',
                        });
                    } else {
                        await toast.fire({
                            icon: 'error',
                            title: 'Nie udało się dodać książki',
                        });
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    const deleteBook = async (id: number) => {
        await axios
            .post('/api/books/delete', {
                body: {
                    id,
                },
            })
            .then(async (res: SuccessResponse) => {
                if (res.data.message === 'success') {
                    setDataChanged(!dataChanged);
                    await toast.fire({
                        icon: 'success',
                        title: 'Usunięto książkę',
                    });
                } else {
                    await toast.fire({
                        icon: 'error',
                        title: 'Nie udało się usunąć książki',
                    });
                }
            });
    };
    return (
        <div className="flex flex-col items-center text-white w-100 h-screen gap-5">
            <div className="flex gap-5 mt-5">
                <button onClick={addPopup} className="bg-[#100f14] border-2  border-[#57bd8a] outline-none rounded-lg text-2xl px-3 py-1 h-12 flex justify-center items-center hover:bg-[#57bd8a] transition duration-300 ease-in-out">
                    Dodaj
                </button>
                <input type="text" onInput={(e) => setSearch(e.currentTarget.value)} value={search} className="w-25 text-white px-3 py-1 h-12 bg-[#100f14] outline-none border-2 border-[#57bd8a] rounded-lg text-2xl" />
            </div>
            {data.length !== 0 && (
                <>
                    <div className="w-screen flex flex-col items-center backdrop-blur-[1.5px]">
                        <div className="flex justify-around w-screen bg-gray-700 bg-opacity-50 py-3">
                            <div className="w-72"></div>
                            <div className="text-3xl w-72">Tytuł</div>
                            <div className="text-3xl w-72">Autor</div>
                            <div className="text-3xl w-72">Gatunek</div>
                            <div className="text-3xl w-72">Data wydania</div>
                        </div>
                        {data.length !== 0 &&
                            data.map((book) => {
                                const releaseDate = book.data_wydania && new Date(book.data_wydania);
                                return (
                                    <div key={book.id_k} className="py-3 flex justify-around items-center w-screen list">
                                        <button className="bg-transparent border-2 border-red-500 outline-none rounded-lg text-lg px-3" onClick={() => deleteBook(book.id_k)}>
                                            Usuń
                                        </button>
                                        <div className="text-lg w-72 ">{book.tytul}</div>
                                        <div className="text-lg w-72 ">{book.autor}</div>
                                        <div className="text-lg w-72 ">{book.gatunek}</div>
                                        <div className="text-lg w-72 ">{releaseDate instanceof Date ? releaseDate.toLocaleDateString('en-GB') : 'N/A'}</div>
                                    </div>
                                );
                            })}
                    </div>
                </>
            )}
            {data.length === 0 && <h1 className="text-6xl mt-5">Nie znaleziono książek</h1>}
        </div>
    );
}
