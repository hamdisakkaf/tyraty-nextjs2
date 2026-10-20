/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // نضع الخط العربي أولاً ثم الإنجليزي ليتعرف المتصفح عليهما
        sans: ['Al-Jazeera-Arabic', 'Montserrat', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#9C4836', // اللون الأساسي (للأزرار والعناصر البارزة)
          dark: '#2B2B2B',    // الخلفية الرئيسية
          light: '#F4F1EA',   // النصوص أو الخلفيات الفرعية/البوردات
        },
      },
    },
  },
  plugins: [],
}