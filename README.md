# persx.ai

A modern Next.js website for persx.ai - AI Strategist for Personalization & Experimentation. Features a 4-step roadmap form that generates personalized experience optimization strategies.

## Features

- **4-Step Roadmap Form**: Interactive multi-step form collecting:
  - Industry selection
  - Business goals
  - Martech stack integration
  - Custom requirements
- **Personalized Output**: Generates custom previews including:
  - 3 ideal customer personas
  - 4-stage customer journey
  - 6 high-impact test ideas
- **Supabase Integration**: Form submissions stored in Supabase database
- **Email Capture**: Collects emails for full 90-day roadmap delivery
- Modern, responsive UI built with Next.js 14 and Tailwind CSS
- TypeScript for type safety
- Multiple pages with sample content:
  - Homepage with personalization focus
  - Start page with roadmap form
  - Blog page with article listings
  - News page with company updates
  - About page with mission and team
  - Contact page with form and information
- Martech integration showcase (Optimizely, Segment, Salesforce, Marketo, Microsoft Dynamics)
- Dark mode support
- Fully optimized for production deployment

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Supabase account (for database functionality)

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

3. Set up Supabase database:
   - Follow the detailed guide in `SUPABASE_SETUP.md`
   - Create a Supabase project
   - Run the schema from `supabase-schema.sql`
   - Copy `.env.example` to `.env.local` and add your credentials

4. Run the development server:
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
│   ├── api/
│   │   └── submit-roadmap/
│   │       └── route.ts        # Supabase integration
│   ├── blog/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── news/
│   │   └── page.tsx
│   ├── start/
│   │   └── page.tsx            # 4-step roadmap form
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── Header.tsx
├── lib/
│   └── supabase.ts             # Supabase client config
├── public/
├── .env.example                # Environment variables template
├── next.config.mjs
├── supabase-schema.sql         # Database schema
├── SUPABASE_SETUP.md           # Database setup guide
├── ROADMAP_FORM_GUIDE.md       # Form feature documentation
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
- [Supabase](https://supabase.com/) - PostgreSQL database and backend
- [ESLint](https://eslint.org/) - Code linting

## Documentation

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete guide to setting up the Supabase database
- **[ROADMAP_FORM_GUIDE.md](./ROADMAP_FORM_GUIDE.md)** - Documentation for the roadmap form feature
- **[supabase-schema.sql](./supabase-schema.sql)** - Database schema for roadmap submissions

## License

This project is licensed under the ISC License.

## Support

For questions or support, contact us at hello@persx.ai
