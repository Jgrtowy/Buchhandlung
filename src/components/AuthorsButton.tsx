'use client';

import { modal } from '~/utils/swal'

export default function AuthorsButton() {
    const classes = 'bg-[#100f14] border-2  border-[#57bd8a] outline-none rounded-lg text-2xl px-3 py-1 h-12 flex justify-center items-center hover:bg-[#57bd8a] transition duration-300 ease-in-out';

    const fireAuthorsModal = async () => {
        await modal.fire({
            title: 'Autorzy',
            html: `
                <div class="flex flex-col gap-2 items-center justify-center w-100 text-center">
                    <a href="https://github.com/jgrtowy" target="_blank" class="text-cyan-400 underline hover:brightness-75 transition duration-300 ease-in-out">Dawid Gul</a>
                    <a href="https://github.com/xvmari" target="_blank" class="text-pink-600 underline hover:brightness-75 transition duration-300 ease-in-out">Wiktoria Kozinoga</a>
                    <a href="https://github.com/elektrysiu" target="_blank" class="text-fuchsia-500 underline hover:brightness-75 transition duration-300 ease-in-out">Kamil Sierzputowski</a>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            showCancelButton: false,
        })
    }
    return (
        <button className={classes} onClick={() => fireAuthorsModal()}>
            {' '}
            Autorzy{' '}
        </button>
    );
}