import standardScss from 'stylelint-config-standard-scss';

export default {
  files: ['**/*.{css,scss}'],
  extends: [
    standardScss, // includes standard + SCSS rules
  ],
  plugins: ['stylelint-scss'],
  customSyntax: 'postcss-scss', // handles both .css and .scss correctly (use SCSS-compatible parser)
  rules: {
    "declaration-empty-line-before": null, // allow empty line before declarations
    "value-keyword-case": null, // allow both lowercase and uppercase keywords
    "color-hex-length": "long", // enforce long hex colors
  },
};
