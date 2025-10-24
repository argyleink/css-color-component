// PostCSS config to inline Open Props used in component CSS
module.exports = {
  plugins: [
    require('postcss-jit-props')(require('open-props')),
    require('autoprefixer')()
  ]
}
