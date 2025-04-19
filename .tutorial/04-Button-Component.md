# Building the Button Component

In this section, we'll create a reusable Button component for our Lightning Tip Jar. This component will be used throughout our application for various actions like submitting a tip, copying an invoice, and more.

## Why Create a Custom Button?

Instead of using plain HTML buttons, we're creating a custom component that:

1. Maintains consistent styling across our app
2. Supports different sizes and styles
3. Makes our code more readable and maintainable
4. Allows for extension with new features as needed

## Creating the Button Component

First, let's create a new file for our Button component:

1. Create a new folder called `components` inside the `app` directory
2. Inside the `components` folder, create a new file called `Button.tsx`

Now, add the following code to `app/components/Button.tsx`:

```tsx
'use client';

import React from 'react';
import cn from 'classnames';

type ButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl';
type ButtonFormat = 'primary' | 'secondary' | 'tertiary';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  format?: ButtonFormat;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Button({ 
  size = 'm', 
  format = 'primary', 
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  
  // Common classes for all buttons
  const baseClasses = 'rounded-md font-medium transition-all duration-300 flex items-center justify-center cursor-pointer';
  
  // Size-specific classes
  const sizeClasses = {
    xs: 'text-xs py-1 px-2',
    s: 'text-sm py-1.5 px-2.5',
    m: 'text-base py-2 px-4',
    l: 'text-lg py-3 px-5',
    xl: 'text-xl py-4 px-6',
  };
  
  // Format-specific classes
  const formatClasses = {
    primary: 'bg-indigo-500 bg-linear-to-r from-sky-500 to-indigo-500 text-white font-bold',
    secondary: 'border border-gray-600 text-gray-300 hover:bg-gray-800',
    tertiary: 'bg-gray-700 text-gray-300 hover:bg-gray-600',
  };
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Disabled class
  const disabledClass = props.disabled ? 'opacity-70 cursor-not-allowed' : '';
  
  // Combine all classes
  const buttonClasses = cn(
    baseClasses,
    sizeClasses[size],
    formatClasses[format],
    widthClass,
    disabledClass,
    className
  );
  
  return (
    <button 
      className={buttonClasses} 
      {...props}
    >
      {children}
    </button>
  );
}
```

## Understanding the Code

Let's break down what's happening in our Button component:

1. We start with `'use client';` to tell Next.js this is a client component that can use browser features
2. We import React and the `classnames` library (which helps us combine CSS classes conditionally)
3. We define TypeScript types for button sizes and formats
4. We create a ButtonProps interface that extends HTML button attributes and adds our custom props
5. We implement the Button component with defaults for size, format, etc.
6. We set up different classes for base styling, sizes, formats, width, and disabled state
7. We use the `cn()` function to combine all these classes
8. Finally, we return a button element with the combined classes and spread the remaining props

## Using the Button

Now that we have our Button component, let's test it by updating our home page. Edit `app/page.tsx`:

```tsx
import Button from './components/Button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <h1 className="text-3xl font-bold mb-4 gradient-text">Lightning Tip Jar</h1>
      <p className="mb-8">⚡ Support with Bitcoin Lightning</p>
      
      <div className="space-y-4 w-full max-w-xs">
        <Button format="primary" fullWidth>
          Primary Button
        </Button>
        
        <Button format="secondary" fullWidth>
          Secondary Button
        </Button>
        
        <Button format="tertiary" fullWidth>
          Tertiary Button
        </Button>
        
        <div className="grid grid-cols-3 gap-2">
          <Button size="s">Small</Button>
          <Button size="m">Medium</Button>
          <Button size="l">Large</Button>
        </div>
      </div>
      
      <footer className="mt-auto pt-8 text-center text-sm text-gray-500">
        <p>A Bitcoin Lightning Demo</p>
      </footer>
    </div>
  );
}
```

## Test Your Work

Save your files and make sure your development server is running (`yarn dev` or `npm run dev`).

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see different buttons with our custom styling:

- A full-width primary button with a beautiful gradient
- A full-width secondary button with a border
- A full-width tertiary button with a gray background
- A row of three buttons with different sizes

Play around with the different button props to see how they affect the appearance!

In the next section, we'll start building the main TipJar component for our application.