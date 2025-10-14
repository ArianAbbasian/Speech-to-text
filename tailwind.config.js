// tailwind.config.js
module.exports = {
  darkMode: 'class', // استفاده از کلاس برای دارک مود
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        // می‌تونی رنگ‌های سفارشی برای دارک مود اضافه کنی
      },
    },
  },
  plugins: [],
}