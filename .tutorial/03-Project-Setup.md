# Project Setup

In this section, we'll set up our Next.js project and do some initial cleanup to prepare for building our Lightning Tip Jar.

## Installing Next.js

Let's start by creating a new Next.js project. Open your terminal and run the following command:

```bash
npx create-next-app@latest lntipjar
```

During the setup, you'll be asked a few questions:

- **Would you like to use TypeScript?** Yes
- **Would you like to use ESLint?** Yes
- **Would you like to use Tailwind CSS?** Yes
- **Would you like to use `src/` directory?** No
- **Would you like to use App Router?** Yes
- **Would you like to customize the default import alias (@/*)?** No

Once the installation is complete, navigate to your project folder:

```bash
cd lntipjar
```

## Cleaning Up

Before we start building, let's clean up some of the default files that we don't need.

### Simplifying the Home Page

Open `app/page.tsx` and replace everything with this simpler version:

```tsx
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Lightning Tip Jar</h1>
      <p className="mb-8">⚡ Support with Bitcoin Lightning</p>
      
      <footer className="mt-auto pt-8 text-center text-sm text-gray-500">
        <p>A Bitcoin Lightning Demo</p>
      </footer>
    </div>
  );
}
```

### Updating Global Styles

Now, let's set up our dark theme with gradient styles. Open `app/globals.css` and replace its contents with:

```css
@import "tailwindcss";

:root {
  --background: #0a0a0a;
  --foreground: #ededed;
  --accent: #3b82f6;
  --secondary: #8b5cf6;
  --gradient-start: #3b82f6;
  --gradient-end: #8b5cf6;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

html {
  @apply bg-black;
}

body {
  background: linear-gradient(to bottom, #0a0a0a, #10102a);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
  min-height: 100vh;
}

.gradient-text {
  background: linear-gradient(90deg, var(--accent), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-border {
  position: relative;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
}

.gradient-border::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 0.5rem;
  padding: 2px;
  background: linear-gradient(90deg, var(--accent), var(--secondary));
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

```

### Installing Additional Dependencies

We'll need a few additional packages for our project. Run the following command in your terminal:

```bash
npm install axios classnames confetti-react qrcode.react
# or if you're using yarn
yarn add axios classnames confetti-react qrcode.react
```

### Setting Up Layout

Let's update our layout file to use a nice font. Open `app/layout.tsx` and replace its contents with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lightning Tip Jar | ATL BitLab",
  description: "Leave us a tip in bitcoin -- or deploy this code to run your own lightning tip jar!",
  icons: {
    icon: "/atl-bitlab-favicon.png",
    apple: "/atl-bitlab-favicon.png",
  },
  openGraph: {
    title: "Lightning Tip Jar | ATL BitLab",
    description: "Leave us a tip in bitcoin -- or deploy this code to run your own lightning tip jar!",
    images: ['/lightning-tip-jar.jpg'],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lightning Tip Jar | ATL BitLab",
    description: "Leave us a tip in bitcoin -- or deploy this code to run your own lightning tip jar!",
    images: ['/lightning-tip-jar.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

## Adding Custom Assets

For our Lightning Tip Jar, we'll want to add some custom assets to the `public` folder:

1. Create the following files in your `public` folder:
   - `atl-bitlab-favicon.png` - A custom favicon for your site
   - `lightning-tip-jar.jpg` - An image for social media sharing

These files will be used in the metadata we've added to our layout file. The metadata configuration we've set up includes:

- Basic information: title and description
- Favicon for browsers and mobile devices
- Open Graph tags for nice previews when shared on social media
- Twitter card metadata for Twitter sharing

## Testing Our Setup

Let's make sure everything is working. Run the development server:

```bash
npm run dev
# or if you're using yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see a simple page with dark styling that says "Lightning Tip Jar" and "Support with Bitcoin Lightning".

In the next section, we'll start building our UI components.