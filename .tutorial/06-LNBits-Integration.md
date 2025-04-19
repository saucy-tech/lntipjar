# LNBits Integration

In this section, we'll connect our Next.js application to LNBits using API routes. This will allow us to generate Lightning invoices and check their payment status.

## What is LNBits?

LNBits is a free and open-source Lightning Network account system that makes it easy to create and manage multiple Lightning wallets. It provides a simple API that we can use to generate invoices and check payments.

For this tutorial, your instructor has already set up LNBits and will provide you with the URL and API keys.

## Setting Up Environment Variables

First, let's set up our environment variables to store the LNBits credentials.

1. Create a file named `.env.local` in the root of your project:

```
LNBITS_ADMIN_KEY=your_admin_key
LNBITS_INVOICE_READ_KEY=your_invoice_read_key
LNBITS_URL=your_lnbits_url
```

Replace `your_admin_key`, `your_invoice_read_key`, and `your_lnbits_url` with the values provided by your instructor.

These environment variables will be accessible from our API routes but not from client-side code (for security reasons).

## Creating the API Routes

Next.js allows us to create API endpoints easily using API routes. Let's create the routes we need for our Lightning Tip Jar.

### Invoice Generation Route

Create a new file `app/api/invoice/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Get API keys from environment variables
const LNBITS_ADMIN_KEY = process.env.LNBITS_ADMIN_KEY || '';
const LNBITS_INVOICE_READ_KEY = process.env.LNBITS_INVOICE_READ_KEY || '';
const LNBITS_URL = process.env.LNBITS_URL || 'https://legend.lnbits.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, memo } = body;
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Please provide a positive number.' },
        { status: 400 }
      );
    }

    // Check if API keys are configured
    if (!LNBITS_ADMIN_KEY || LNBITS_ADMIN_KEY === '') {
      return NextResponse.json(
        { error: 'Missing LNBits API credentials. Please configure your environment variables.' },
        { status: 500 }
      );
    }

    const satsAmount = Number(amount);
    const description = memo || 'Lightning Tip Jar';
    
    try {
      const response = await axios.post(
        `${LNBITS_URL}/api/v1/payments`,
        {
          out: false,
          amount: satsAmount,
          memo: description,
        },
        {
          headers: {
            'X-Api-Key': LNBITS_ADMIN_KEY,
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      // Check if the response contains a connection error
      if (response.data?.detail?.includes("Unable to connect")) {
        return NextResponse.json(
          { error: "The Lightning Network node is currently unavailable. Please try again later." },
          { status: 503 }
        );
      }

      return NextResponse.json({
        paymentHash: response.data.payment_hash,
        paymentRequest: response.data.payment_request,
      });
    } catch (apiError: any) {
      console.error('LNBits API error:', apiError.message);
      return NextResponse.json(
        { error: 'Unable to connect to the Lightning Network. Please try again later.' },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentHash = searchParams.get('paymentHash');

    if (!paymentHash) {
      return NextResponse.json(
        { error: 'Payment hash is required' },
        { status: 400 }
      );
    }

    // Check if API keys are configured
    if (!LNBITS_INVOICE_READ_KEY || LNBITS_INVOICE_READ_KEY === '') {
      return NextResponse.json(
        { error: 'Missing LNBits API credentials. Please configure your environment variables.' },
        { status: 500 }
      );
    }

    try {
      const response = await axios.get(
        `${LNBITS_URL}/api/v1/payments/${paymentHash}`,
        {
          headers: {
            'X-Api-Key': LNBITS_INVOICE_READ_KEY,
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      const isPaid = response.data.paid;

      return NextResponse.json({ 
        paid: isPaid,
        preimage: response.data.preimage || null,
        details: response.data
      });
    } catch (apiError: any) {
      console.error('LNBits API error when checking payment:', apiError.message);
      
      // For payment status checks, we return a "not paid" status rather than an error
      // This allows the UI to continue polling without showing an error
      return NextResponse.json({ 
        paid: false,
        error: 'Unable to verify payment status. Will try again.'
      });
    }
  } catch (error: any) {
    console.error('Error checking invoice status:', error);
    return NextResponse.json(
      { paid: false },
      { status: 200 } // Return 200 to avoid breaking the polling loop
    );
  }
}
```

## Understanding the API Routes

Let's break down what each API route does:

### POST /api/invoice

This route generates a new Lightning invoice:

1. It accepts a POST request with `amount` and `memo` in the body
2. It validates that the amount is a positive number
3. It checks if LNBits API keys are configured
4. It makes a request to the LNBits API to create a new invoice
5. It returns the payment hash and payment request (the Lightning invoice)

### GET /api/invoice

This route checks the payment status of an invoice:

1. It accepts a GET request with a `paymentHash` query parameter
2. It validates that the payment hash is provided
3. It checks if LNBits API keys are configured
4. It makes a request to the LNBits API to check the payment status
5. It returns a boolean indicating if the invoice is paid

## Testing the Integration

Now that we have set up our API routes, we can test our Lightning Tip Jar application.

1. Make sure your `.env.local` file is configured with the correct LNBits credentials
2. Run your development server: `yarn dev` or `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000) in your browser
4. Try the following workflow:
   - Select an amount and optionally add a message
   - Click "Leave a Tip" to generate an invoice
   - Use a Lightning wallet to scan the QR code and make a payment
   - Watch as the app automatically detects the payment and shows the success screen with confetti!

## Troubleshooting

If you encounter issues:

1. **Invalid API Keys**: Check that your LNBits credentials are correct in `.env.local`
2. **API Connection Issues**: Make sure the LNBits URL is accessible from your development environment
3. **Invoice Not Detected as Paid**: The payment status polling may take a few seconds to detect the payment

## What's Next?

Congratulations! You've built a functioning Lightning Tip Jar that can:
- Generate Lightning invoices
- Display QR codes for payments
- Poll for payment status
- Show success feedback with confetti

In the next section, we'll discuss how to deploy your Lightning Tip Jar to the web.