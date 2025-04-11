# AVGen - Poster Generator

AVGen is a modern web application built with React and TypeScript for generating professional posters with customizable content and background images. The application features advanced image processing capabilities, including multiple grayscale conversion methods and responsive design.

## Features

- **Content Customization**

  - Chapter name
  - Date and time selection
  - Location address
  - Localization settings

- **Background Image Processing**

  - Image upload and preview
  - Multiple grayscale conversion methods
  - Background opacity control
  - Background blur
  - Image positioning and zoom

- **Responsive Design**
  - Fixed aspect ratio (3:4) for consistent poster dimensions
  - Rem-based sizing for reliable scaling
  - Responsive layout that maintains proportions

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Headless UI
- html2canvas-pro
- zustand
- zod

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/drahoslove/avgen.git
   cd avgen
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── assets/         # Static assets (logos, images)
├── components/     # React components
├── utils/          # Utility functions
├── hooks/          # React hooks
├── App.tsx         # Main application component
└── types.ts        # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- UI components from [Headless UI](https://headlessui.com/)
- State managed with [Zustand](https://zustand.com/)
