module.exports = {
  extends: ["airbnb-base", "prettier"],
  env: { node: true, es6: true },
  rules: {
    quotes: ["warn", "single", { allowTemplateLiterals: true }],
    "no-param-reassign": 0,
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "prettier/prettier": ["error", { trailingComma: "es5", singleQuote: true, printWidth: 120 }],
  },
  plugins: ["prettier"],
};
