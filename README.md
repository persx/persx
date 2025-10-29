# persx.ai

A modern Next.js website for persx.ai featuring a clean, responsive design with multiple pages including blog, news, about, and contact sections.

## Features

- Modern, responsive UI built with Next.js 14 and Tailwind CSS
- TypeScript for type safety
- Multiple pages with sample content:
  - Homepage with hero section and features
  - Blog page with article listings
  - News page with company updates
  - About page with mission and team
  - Contact page with form and information
- Dark mode support
- Fully optimized for production deployment

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd persx
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## Deployment

### Deploy to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com).

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Vercel will automatically detect Next.js and configure the build settings
6. Click "Deploy"

Your site will be live in minutes! Vercel provides:
- Automatic deployments on every push
- Preview deployments for pull requests
- Custom domain support
- SSL certificates
- CDN distribution

### Deploy to GitHub Pages (Alternative)

While Vercel is recommended for Next.js apps, you can also use other deployment platforms like:
- Netlify
- AWS Amplify
- Railway
- Digital Ocean App Platform

## Project Structure

```
persx/
├── app/
│   ├── about/
│   │   └── page.tsx
│   ├── blog/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── news/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── Header.tsx
├── public/
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Customization

### Update Site Content

- **Homepage**: Edit `app/page.tsx`
- **Blog**: Edit `app/blog/page.tsx`
- **News**: Edit `app/news/page.tsx`
- **About**: Edit `app/about/page.tsx`
- **Contact**: Edit `app/contact/page.tsx`
- **Navigation**: Edit `components/Header.tsx`

### Styling

The site uses Tailwind CSS for styling. Global styles are in `app/globals.css`.

### Colors and Theme

Modify the color scheme in `tailwind.config.ts` or update CSS variables in `app/globals.css`.

## Technologies Used

- [Next.js 14](https://nextjs.org/) - React framework
- [React 18](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [ESLint](https://eslint.org/) - Code linting

## License

This project is licensed under the ISC License.

## Support

For questions or support, contact us at hello@persx.ai
