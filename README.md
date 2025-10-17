# AV Generator

AV Generator is a tool for generating announcement posters for 'Cube of Truth' events. It is intended for organizers of chapters of Anonymous for the Voiceless around the world. Images can be downloaded or shared directly to social media.

The content is customizable. Data can be filled in manually or imported from a Facebook event page or from the Animal Rights Calendar.

Two images with different localizations can be generated at once; it's often useful to address both the English-speaking and local audience.

It's possible to use a custom background and adjust it with basic image processing.

## Features

- **Content Customization**

  - Chapter name
  - Date and time selection
  - Location address
  - Localization of the date and time format

- **Background Image Processing** (only in [#pro](https://generator.cubeoftruth.com/#pro) mode)

  - Image upload and preview
  - Multiple grayscale conversion methods
  - Background opacity control
  - Background blur
  - Image positioning and zoom

- **Responsive Design**
  - Fixed aspect ratio (3:4) for consistent poster dimensions
  - Rem-based sizing for reliable scaling; output resolution is independent of preview size
  - Responsive layout that maintains proportions; easy to use on phones

## Technologies Used

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Headless UI
- html2canvas-pro
- Zustand
- Zod

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
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
├── constants/      # App constants (assets, dimensions, localization, etc.)
├── hooks/          # React hooks
├── pages/          # Route pages
├── utils/          # Utility functions
├── App.tsx         # Main application component
├── index.css       # Global styles
├── main.tsx        # Entry point
└── types.ts        # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- UI components from [Headless UI](https://headlessui.com/)
- State managed with [Zustand](https://zustand.com/)
