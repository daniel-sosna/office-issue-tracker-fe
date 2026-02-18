# Office Issue Tracker - Frontend

Office Issue Tracker is a web-application for reporting, tracking, and managing office-related issues. Users can also comment and vote on them to surface what matters most. It provides a user-friendly interface and integrates with the backend API.

You can find the backend for this project here: https://github.com/daniel-sosna/office-issue-tracker-be

## Prerequisites

- Node.js
- npm
- [Backend API](https://github.com/daniel-sosna/office-issue-tracker-be)

## Quick start

To run the frontend locally, follow these steps:

1. Prepare the environment:
    - Clone the repository and navigate to the project root
    - Copy `.env.example` to `.env`
    - Set up the [backend](https://github.com/daniel-sosna/office-issue-tracker-be?tab=readme-ov-file#quick-start)

1. Install dependencies:
    ```bash
    npm install
    ```

1. Start the development server:
    ```bash
    npm run dev
    ```

1. Open your browser and go to `http://localhost:5174` to see the application in action

## Available Scripts

In the project directory, you can run:

- `npm run dev` - Starts the development server
- `npm run build` - Compiles TypeScript and builds the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Check for ESLint errors in TypeScript/React files
- `npm run lint:fix` - Fix auto-fixable ESLint errors
- `npm run lint-styles` - Check for Stylelint errors in CSS/SCSS files
- `npm run lint-styles:fix` - Fix auto-fixable Stylelint errors
- `npm run format` - Check code formatting with Prettier
- `npm run format:fix` - Auto-format code with Prettier

## Features

- **Report Issues**: Create and submit office-related issues with detailed descriptions and attachments
- **Comment**: Collaborate by adding comments to issues
- **Vote on Issues**: Upvote issues to prioritise what matters most to you
- **Track Status**: Monitor issue status through a clear workflow (Open, In Progress, Closed, etc.)
- **Search & Filter**: Find issues quickly with filtering and search capabilities
- **User Management**: Manage personal information
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Built with accessibility in mind to ensure everyone can use the application

## Code Quality

We use _ESLint_, _Stylelint_, _Prettier_, and _Husky_ to enforce consistent coding standards.  
Full guide: [docs/code-quality.md](docs/code-quality.md)

## Troubleshooting

### Backend Connection Issues
- Ensure the backend API is running on `http://localhost:8080`
- Check that `VITE_API_BASE_URL` in `.env` points to the correct backend URL
- Clear browser cache and restart the development server

## Contributors

Built by the **we-need-teamname** team at Sourcery Academy _(Vilnius, 2025)_
