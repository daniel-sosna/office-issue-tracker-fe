# 🧹 Code Quality & Linters Guide

This project uses **ESLint**, **Stylelint**, and **Prettier** to enforce consistent code quality and formatting across the entire codebase.
The tooling is automated through **Husky** and **lint-staged**, ensuring issues are caught before they reach the repository.

This document explains:

1. What each linter does
2. How to use the linters
3. How pre-commit hooks work

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

## 3. Pre-Commit Hook (Husky + lint-staged)

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
