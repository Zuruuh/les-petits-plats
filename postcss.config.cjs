// @ts-check

/**
 * @type {Partial<import('postcss-load-config').Config>} PostcssConfig
 */
const PostcssConfig = {
  plugins: [require('autoprefixer')()],
};

module.exports = PostcssConfig;
