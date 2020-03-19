const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    isProd ? require('autoprefixer') : null,
  ].filter(Boolean),
}
