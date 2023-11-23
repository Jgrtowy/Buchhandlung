import Link from 'next/link';
import '~/styles/Header.css';
import AuthorsButton from './AuthorsButton';

export default function Header() {
    const classes = 'bg-[#100f14] border-2  border-[#57bd8a] outline-none rounded-lg text-2xl px-3 py-1 h-12 flex justify-center items-center hover:bg-[#57bd8a] transition duration-300 ease-in-out';

    return (
        <header className='gap-5'>
            <Link href="/" className={classes}>
                {' '}
                Home{' '}
            </Link>
            <Link href="/books" className={classes}>
                {' '}
                Książki{' '}
            </Link>
            <Link href="/readers" className={classes}>
                {' '}
                Czytelnicy{' '}
            </Link>
            <Link href="/borrows" className={classes}>
                {' '}
                Wypożyczenia{' '}
            </Link>
            <AuthorsButton />
        </header>
    );
}
