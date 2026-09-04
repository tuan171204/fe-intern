/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            colors: {
                'primary-main': '#00A8A4',
                'primary-dark': '#006678',

                txt: {
                    primary: '#0D0F35',
                    secondary: '#71738B',
                    tertiary: '#BCBCC8',
                    disabled: '#BCBCC8',
                },
                bg: {
                    primary: '#FFFFFF',
                    secondary: '#F4F4F6',
                    tertiary: '#0D0F35',
                },
            },

            fontSize: {
                'h1': ['96px', { lineHeight: '104px' }],
                'h2': ['60px', { lineHeight: '68px' }],
                'h3': ['48px', { lineHeight: '56px' }],
                'h4': ['34px', { lineHeight: '42px' }],
            }
        }
    }
}