# AVGen - Poster Generator

AVGen is a modern web application built with React and TypeScript for generating professional posters with customizable content and background images. The application features advanced image processing capabilities, including multiple grayscale conversion methods and responsive design.

## Features

- **Content Customization**
  - Chapter name
  - Date and time selection
  - Location and language settings
  - Customizable text content

- **Background Image Processing**
  - Image upload and preview
  - Multiple grayscale conversion methods:
    - Luma (weighted RGB based on human perception)
    - Average (simple RGB average)
    - Luminosity (perceived brightness)
    - Lightness (based on max/min RGB values)
    - Custom (user-defined RGB weights)
  - Background opacity control
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
- Canvas API for image processing

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
│   ├── BackgroundForm.tsx
│   ├── ContentForm.tsx
│   ├── PosterForm.tsx
│   └── PosterPreview.tsx
├── utils/          # Utility functions
│   └── imageProcessing.ts
├── App.tsx         # Main application component
└── types.ts        # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- UI components from [Headless UI](https://headlessui.com/)
