# Lightning Tip Jar

A simple web application that allows users to leave tips using the Bitcoin Lightning Network.

## Features

- Select from preset tip amounts (21, 404, 1000, or 20000 sats) or enter a custom amount
- Add an optional message with your tip
- QR code generation for Lightning Network invoices
- Real-time payment detection
- Celebration animation when payment is received
- Modern, dark-mode UI with gradient accents

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- LNBits API for Lightning Network integration

## Setup

1. Clone the repository
   ```
   git clone https://github.com/ATLBitLab/lntipjar.git
   cd lntipjar
   ```

2. Install dependencies
   ```
   yarn install
   ```

3. Create a `.env.local` file with your LNBits credentials
   ```
   LNBITS_ADMIN_KEY=your-admin-key
   LNBITS_INVOICE_READ_KEY=your-invoice-read-key
   LNBITS_URL=https://legend.lnbits.com
   
   # Set to 'true' to use real LNBits API in development
   USE_REAL_LNBITS=false
   ```

   To get your LNBits API keys:
   - Create an account at [LNBits](https://legend.lnbits.com/) or use your own LNBits instance
   - Create a new wallet
   - Go to API info to get your admin key and invoice/read key

4. Run the development server
   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development vs Production Mode

In development mode (`yarn dev`), the application uses mock invoices by default to allow for testing without a real LNBits instance. You can toggle this behavior by:

1. Setting `USE_REAL_LNBITS=true` in your `.env.local` file
2. The UI will indicate when you're in development mode and whether you're using mock invoices or the real LNBits API
3. Use the "[DEV] Simulate Payment" button to test the payment flow

In production mode (`yarn build` followed by `yarn start`), the application always uses the real LNBits API.

## Deployment

The application can be deployed to Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## License

[MIT License](LICENSE)

---

⚡ Built by ATL Bitcoin Lab