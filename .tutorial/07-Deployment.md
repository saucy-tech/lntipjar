# Deploying Your Lightning Tip Jar

In this final section, we'll discuss how to deploy your Lightning Tip Jar to the web so that anyone can use it to send you tips.

## Preparing for Deployment

Before deploying, let's build the application to make sure it works:

```bash
npm run build
# or
yarn build
```

## Deployment Options

There are several ways to deploy your Next.js application. Here are the most common ones:

### 1. Vercel (Easiest)

[Vercel](https://vercel.com/) is the company behind Next.js and offers a seamless deployment experience:

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Sign up for a Vercel account
3. Click "Import Project" and select your repository
4. Add your environment variables (LNBITS_ADMIN_KEY, LNBITS_INVOICE_READ_KEY, LNBITS_URL)
5. Click "Deploy"

Vercel will automatically build and deploy your application. Any future pushes to your repository will trigger automatic redeployments.

### 2. Netlify

[Netlify](https://www.netlify.com/) is another excellent platform for hosting web applications:

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Sign up for a Netlify account
3. Click "New site from Git" and select your repository
4. Set the build command to `npm run build` or `yarn build`
5. Set the publish directory to `.next`
6. Add your environment variables
7. Click "Deploy site"

### 3. Self-Hosting

If you prefer to host the application yourself:

1. Build your application: `npm run build` or `yarn build`
2. Start the production server: `npm start` or `yarn start`
3. Use a reverse proxy like Nginx to expose your application to the internet
4. Consider using a process manager like PM2 to keep your application running

## Environment Variables in Production

Remember to set your environment variables in your production environment:

- LNBITS_ADMIN_KEY
- LNBITS_INVOICE_READ_KEY
- LNBITS_URL

Most hosting platforms provide a way to set environment variables through their dashboard.

## Custom Domain

For a professional touch, consider using a custom domain for your Lightning Tip Jar. Both Vercel and Netlify make it easy to connect a custom domain to your deployed site.

## Keeping Your LNBits Credentials Secure

Your LNBits API keys give access to your Lightning wallet, so it's important to keep them secure:

1. Never commit your `.env.local` file to a public repository
2. Use the secure environment variables feature of your hosting platform
3. Regularly rotate your API keys if you suspect they might have been compromised

## Testing Your Deployed Site

After deploying, test your site thoroughly:

1. Generate a small invoice and pay it to ensure everything works
2. Test on different devices and browsers
3. Ask a friend to send you a tip to make sure it works for others

## Sharing Your Lightning Tip Jar

Now that your Lightning Tip Jar is deployed, share it with the world:

- Add the link to your social media profiles
- Include it in your email signature
- Share it with friends and colleagues

## Extending Your Lightning Tip Jar

Here are some ideas for future enhancements:

1. **Customization Options**: Allow users to customize the tip jar with their own branding
2. **Tip History**: Add a feature to view past tips
3. **Multiple Payment Options**: Add support for on-chain Bitcoin payments
4. **Subscription Tips**: Implement recurring tips
5. **Auto-Conversion**: Convert received Bitcoin to fiat automatically

## Conclusion

Congratulations! You've built and deployed a fully functional Lightning Tip Jar. This project has covered:

1. Setting up a Next.js application
2. Building reusable UI components
3. Creating a user-friendly tip jar interface
4. Integrating with the Lightning Network via LNBits
5. Deploying your application to the web

You now have a practical understanding of how to build Lightning Network applications. The skills you've learned here can be applied to many other Bitcoin and Lightning projects.

Keep building and exploring the exciting world of Bitcoin's Lightning Network!

---

Thank you for following this tutorial. If you have any questions or feedback, please reach out to us at ATL BitLab.

⚡ Happy building! ⚡