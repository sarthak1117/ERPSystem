import scrollbar from 'tailwind-scrollbar';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          "dark-purple": "#0B1A51",
          'light-white': 'rgba(255,255,255,0.18)',
        },
        scrollbar: ['rounded'],
      },
    },
    plugins: [
        scrollbar,
        forms,
    ],
  };
  
//   /** @type {import('tailwindcss').Config} */
// export default {
//     content: [
//       "./index.html",
//       "./src/**/*.{js,ts,jsx,tsx}",
//       'node_modules/flowbite-react/lib/esm/**/*.js',
//     ],
//     theme: {
//       extend: {},
//     },
//     // eslint-disable-next-line no-undef
//     plugins: [require('flowbite/plugin'), require('tailwind-scrollbar'),],
//   }