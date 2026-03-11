/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'official-blue': '#003366',
                'official-grey': '#f4f7f6',
            }
        },
    },
    plugins: [],
}
