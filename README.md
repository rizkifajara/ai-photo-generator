# AI Photo Generator

This is a Next.js application that uses AI to generate images based on text prompts. The application features a neobrutalism design style and integrates with the FLUX.1-schnell model from Hugging Face for image generation.

## Features

- Text-to-image generation using AI
- Neobrutalism-inspired UI design
- Image download functionality
- Display of previously generated images
- Responsive design

## Technologies Used

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Hugging Face Inference API
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/ai-photo-generator.git
   cd ai-photo-generator
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your Hugging Face API key:
   ```
   HUGGINGFACE_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Enter a text prompt describing the image you want to generate.
2. Click the "Generate Image" button.
3. Wait for the AI to generate the image.
4. Once generated, you can download the image using the "Download Image" button.
5. Previously generated images will be displayed below.

## Customization

The project uses Tailwind CSS for styling. You can customize the neobrutalism style by modifying the `tailwind.config.ts` file and the CSS variables in `globals.css`.

## Deployment

This project is ready to be deployed on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy your application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Hugging Face](https://huggingface.co/) for providing the AI model
- [Neobrutalism.dev](https://www.neobrutalism.dev/) for design inspiration
- [Vercel](https://vercel.com) for hosting and deployment
