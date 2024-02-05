import stylistic from "@stylistic/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import zin from "@zinkawaii/eslint-config";

export default [
    {
        files: [
            "**/*.{js,ts}"
        ],
        languageOptions: {
            parser: typescriptParser
        },
        plugins: {
            stylistic: stylistic
        },
        rules: {
            ...zin.recommended,
            ...zin.standard,
            ...zin.stylistic,
            "no-dupe-class-members": "off",
            "prefer-rest-params": "off"
        }
    }
];