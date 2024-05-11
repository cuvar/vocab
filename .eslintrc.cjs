/** @type {import("eslint").Linter.Config} */
const config = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: true,
    },
    plugins: ["@typescript-eslint", "testing-library", "eslint-plugin-jsdoc"],
    extends: [
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
    ],
    ignorePatterns: [
        "theme.config.js",
        "postcss.config.js",
        "next.config.mjs",
    ],
    rules: {
        // These opinionated rules are enabled in stylistic-type-checked above.
        // Feel free to reconfigure them to your own preference.
        "@typescript-eslint/array-type": "off",
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/no-unnecessary-type-assertion": "off",

        "@typescript-eslint/consistent-type-imports": [
            "warn",
            {
                prefer: "type-imports",
                fixStyle: "inline-type-imports",
            },
        ],
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        "jsdoc/check-access": 1,
        "jsdoc/check-alignment": 1,
        "jsdoc/check-param-names": 1,
        "jsdoc/check-property-names": 1,
        "jsdoc/check-tag-names": 1,
        "jsdoc/check-types": 1,
        "jsdoc/check-values": 1,
        "jsdoc/empty-tags": 1,
        "jsdoc/implements-on-classes": 1,
        "jsdoc/multiline-blocks": 1,
        "jsdoc/no-multi-asterisks": 1,
        "jsdoc/no-undefined-types": 1,
        "jsdoc/require-jsdoc": 1,
        "jsdoc/require-param": 1,
        "jsdoc/require-param-description": 1,
        "jsdoc/require-param-name": 1,
        "jsdoc/require-param-type": 1,
        "jsdoc/require-property": 1,
        "jsdoc/require-property-description": 1,
        "jsdoc/require-property-name": 1,
        "jsdoc/require-property-type": 1,
        "jsdoc/require-returns": 1,
        "jsdoc/require-returns-check": 1,
        "jsdoc/require-returns-description": 1,
        "jsdoc/require-returns-type": 1,
        "jsdoc/require-yields": 1,
        "jsdoc/require-yields-check": 1,
        "jsdoc/tag-lines": 1,
        "jsdoc/valid-types": 1
    },
    overrides: [
        // Only uses Testing Library lint rules in test files
        {
            "files": [
                "**/__tests__/**/*.[jt]s?(x)",
                "**/?(*.)+(spec|test).[jt]s?(x)"
            ],
            "extends": ["plugin:testing-library/react"]
        },
        {
            "files": [
                "**/*.[jt]sx"
            ],
            plugins: ["eslint-plugin-jsdoc"],
            rules: {
                "jsdoc/require-jsdoc": 0,
            },
        }
    ]
};

module.exports = config;
