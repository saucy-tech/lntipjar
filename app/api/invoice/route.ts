import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Get API keys from environment variables
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
    if (!LNBITS_INVOICE_READ_KEY || LNBITS_INVOICE_READ_KEY === '') {
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
            'X-Api-Key': LNBITS_INVOICE_READ_KEY,
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
    } catch (apiError) {
      console.error('LNBits API error:', apiError instanceof Error ? apiError.message : 'Unknown error');
      return NextResponse.json(
        { error: 'Unable to connect to the Lightning Network. Please try again later.' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error creating invoice:', error instanceof Error ? error.message : 'Unknown error');
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
    } catch (apiError) {
      console.error('LNBits API error when checking payment:', apiError instanceof Error ? apiError.message : 'Unknown error');
      
      // For payment status checks, we return a "not paid" status rather than an error
      // This allows the UI to continue polling without showing an error
      return NextResponse.json({ 
        paid: false,
        error: 'Unable to verify payment status. Will try again.'
      });
    }
  } catch (error) {
    console.error('Error checking invoice status:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { paid: false },
      { status: 200 } // Return 200 to avoid breaking the polling loop
    );
  }
}