/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "declaration-empty-line-before": null, // allow empty line before declarations
    "value-keyword-case": null, // allow both lowercase and uppercase keywords
  },
};
