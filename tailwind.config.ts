import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
    content: ['./src/**/*.{tsx,ts}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)', ...fontFamily.sans],
            },
        },
    },
    plugins: [],
} satisfies Config;
