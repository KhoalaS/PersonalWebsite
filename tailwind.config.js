/** @type {import("tailwindcss").Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        terminess: ['Terminess', 'mono'],
        mssans: ['MS Sans Serif', 'serif'],
        mssansbold: ['MS Sans Serif Bold', 'serif']
      }
    }
  },
  plugins: []
}
