# 🧹 Code Quality & Linters Guide

This project uses **ESLint**, **Stylelint**, and **Prettier** to enforce consistent code quality and formatting across the entire codebase.
The tooling is automated through **Husky** and **lint-staged**, ensuring issues are caught before they reach the repository.

This document explains:

1. What each linter does
2. How to use the linters
3. How to configure IDE support (VSCode & IntelliJ Ultimate)
4. How pre-commit hooks work
5. Recommended development workflow

## 1. Linters Overview

### **ESLint**

- Used for: **TypeScript / React (TS/TSX)**
- Purpose: Detects incorrect code patterns, enforces style rules, catches bugs early (unused vars, unreachable code, missing dependencies, etc.)

### **Stylelint**

- Used for: **CSS / SCSS**
- Purpose: Ensures consistent styling rules, prevents common mistakes in stylesheets (invalid properties, unknown rules, duplicate selectors, etc.)

### **Prettier**

- Used for: **Code formatting**
- Purpose: Automatically formats files to a consistent style.
- _Important: Prettier is **not** a linter; it handles only formatting._

### **.editorconfig**

Defines editor-agnostic rules such as:

- Indentation size
- Line endings
- Charset
- Final newline
- Quote style

## 2. CLI Commands

All commands operate on the `./src` folder.

### Linting

| Action             | Command                   |
| ------------------ | ------------------------- |
| Check TS/TSX files | `npm run lint`            |
| Auto-fix TS/TSX    | `npm run lint:fix`        |
| Check CSS/SCSS     | `npm run lint-styles`     |
| Auto-fix CSS/SCSS  | `npm run lint-styles:fix` |

### Formatting

| Action           | Command              |
| ---------------- | -------------------- |
| Check formatting | `npm run format`     |
| Auto-format      | `npm run format:fix` |

### Notes

- All linters/formatters use caching for performance (`node_modules/.cache/...`).
- If you see unexpected results, clear caches with:

  ```
  rm -rf node_modules/.cache
  ```

## 3. IDE Integration

### ✔ VSCode Setup

1. Install recommended extensions:
   - **ESLint** _(dbaeumer.vscode-eslint)_ - to highlight linting issues
   - **Stylelint** _(stylelint.vscode-stylelint)_ - to highlight style issues
   - **Prettier** _(esbenp.prettier-vscode)_ - to format code on save

   \* Instead of Prettier, you can use **EditorConfig** _(EditorConfig.EditorConfig)_, however it has limited supported properties (only indentation, line endings, and final newline)

1. Ensure auto-formatting is enabled:
   - Create or open VSCode workplace settings file (`.vscode/settings.json`)
   - Add the following configuration to enable Prettier as default formatter and format on save:

     ```
     {
       "editor.defaultFormatter": "esbenp.prettier-vscode",
       "editor.formatOnSave": true
     }
     ```

   - If you want ESLint and Stylelint to auto-fix issues on save as well, extend the configuration like this:

     ```
     {
       "editor.defaultFormatter": "esbenp.prettier-vscode",
       "editor.formatOnSave": true,
       "editor.codeActionsOnSave": {
         "source.fixAll.eslint": "explicit",
         "source.fixAll.stylelint": "explicit"
       }
     }
     ```

1. VSCode will automatically read project's ESLint, Stylelint, and Prettier configurations.

### ✔ IntelliJ IDEA Ultimate Setup

IntelliJ should support everything natively, but to ensure proper integration, follow these steps:

1. **Enable ESLint integration**

   `Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint`

   Select: **Manual ESLint configuration**

   Set:
   - **ESLint package**: `node_modules/eslint`
   - **Configuration file**: `eslint.config.js`
   - **Working directories**: project's root folder
   - **Run for files**: `src/**/*.{ts,tsx}`
   - _(Optional) Check: **Run eslint --fix on save**_

1. **Enable Stylelint**

   `Settings → Languages & Frameworks → Style Sheets → Stylelint`

   Set:
   - **Stylelint package**: `node_modules/stylelint`
   - **Configuration file**: `stylelint.config.js`
   - **Run for files**: `src/**/*.{css,scss}`
   - _(Optional) Check: **Run stylelint --fix on save**_

1. **Enable Prettier**

   `Settings → Languages & Frameworks → JavaScript → Prettier`

   Select: **Manual Prettier configuration**

   Set:
   - **Prettier package**: `node_modules/prettier`
   - **Configuration file**: `.prettierrc`
   - **Run for files**: `src/**/*`
   - Check: **Run on 'Reformat Code' action** and **Run on save**

1. **EditorConfig** support enabled by default.

   Check at: `Settings → Editor → Code Style → Enable EditorConfig`

## 4. Pre-Commit Hook (Husky + lint-staged)

The project uses Husky to run tasks **before every commit**.

### How it works:

1. On `npm install`, Husky gets activated via `"prepare": "husky"` in `package.json`.
1. Husky reads the `.husky/pre-commit` script.
1. `lint-staged` runs only on staged files:

   ```json
   "lint-staged": {
     "src/**/*": [
       "prettier --write ..."
     ],
     "src/**/*.{ts,tsx}": [
       "eslint ..."
     ],
     "src/**/*.{css,scss}": [
       "stylelint --fix ..."
     ]
   }
   ```

1. If any linter fails, the commit is canceled.

### Why we use pre-commit hook?

- This prevents invalid or unformatted code from entering the repository.
- Keeps diffs cleaner.
- Avoids unnecessary formatting noise in PRs.

## 5. Recommended Development Workflow

### **1. Write code normally**

Your IDE should already:

- Format code on save
- (Optional) Run ESLint/Stylelint automatically

### **2. You can manually run linting and formatting locally**

- Check for issues:

  ```
  npm run lint
  npm run lint-styles
  npm run format
  ```

- Fix issues automatically:

  ```
  npm run lint:fix
  npm run lint-styles:fix
  npm run format:fix
  ```

### **3. Commit**

Husky will automatically do the following on staged files in `./src`:

- Format with Prettier
- Lint with ESLint for TS/TSX
- Lint with Stylelint for CSS/SCSS

If something fails, correct it and commit again.

### **4. Push**

Then Bitbucket Pipeline will run:

- Install dependencies
- ESLint
- Stylelint
- Prettier
- Security scan

This ensures PRs pass quality checks before merging.
