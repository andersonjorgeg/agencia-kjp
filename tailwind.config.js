/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./producao-musical.html", "./script.js"],
    theme: {
        extend: {
            colors: {
                'primary': '#1E90FF',
                'background-light': '#f8f8f5',
                'background-dark': '#0F0F0F',
                'neutral-dark': '#1a1a1a',
            },
            fontFamily: {
                'display': ['Plus Jakarta Sans', 'sans-serif'],
            },
            borderRadius: {
                'DEFAULT': '0.25rem',
                'lg': '0.5rem',
                'xl': '0.75rem',
                'full': '9999px',
            },
        },
    },
    plugins: [],
}
