# Steam Game Key Frontend

A React-based frontend application for managing Steam game keys.

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Connecting to the Backend](#connecting-to-the-backend)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Overview

This frontend application provides a user interface for the Steam Game Key Management System. It allows users to view, add, and manage Steam game keys through an intuitive web interface.

## Technologies Used

- React 18.3.1
- React DOM 18.3.1
- React Scripts 5.0.1
- CSS for styling
- Jest and React Testing Library for testing

## Getting Started

### Prerequisites

- Node.js (v16.x or later recommended)
- npm or yarn package manager

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/steamgk-frontend.git
   cd steamgk-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or if you use yarn
   yarn install
   ```

### Running the Application

Start the development server:
```bash
npm start
# or
yarn start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

```
steamgk-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── LandingPage.js
│   │   └── LandingPage.css
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

Key components:
- **LandingPage**: The initial landing page for the application
- **App**: The root component that renders the LandingPage

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner in interactive watch mode
- `npm run build`: Builds the app for production to the `build` folder
- `npm run eject`: Ejects from create-react-app configuration (one-way operation)

## Connecting to the Backend

To connect this frontend to the backend API:

1. Create a `.env` file in the root directory
2. Add the backend API URL:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
   Replace the URL with your actual backend URL.

3. Use this environment variable in your API calls:
   ```javascript
   const apiUrl = process.env.REACT_APP_API_URL;
   fetch(`${apiUrl}/endpoint`)
     .then(response => response.json())
     .then(data => console.log(data));
   ```

## Deployment

To build the app for production:

```bash
npm run build
```

This creates a `build` directory with production-ready files that can be deployed to any static hosting service.

### Deployment Options

- **Netlify**: Connect your GitHub repository or upload the build folder
- **Vercel**: Connect your GitHub repository for automatic deployments
- **GitHub Pages**: Deploy using the gh-pages package
- **AWS S3**: Upload the build folder to an S3 bucket configured for static website hosting

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request
