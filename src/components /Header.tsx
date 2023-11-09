import Link from 'next/link';
import '~/styles/Header.css';

export default function Header() {
    return (
        <header>
            <Link href="/" className="a">
                {' '}
                Home{' '}
            </Link>
            <Link href="/books" className="a">
                {' '}
                Książki{' '}
            </Link>
            <Link href="/readers" className="a">
                {' '}
                Czytelnicy{' '}
            </Link>
            <Link href="/borrows" className="a">
                {' '}
                Wypożyczenia{' '}
            </Link>
        </header>
    );
}
