import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// This should be in environment variables in a production app
const LNBITS_ADMIN_KEY = process.env.LNBITS_ADMIN_KEY || 'your-admin-key';
const LNBITS_INVOICE_READ_KEY = process.env.LNBITS_INVOICE_READ_KEY || 'your-invoice-read-key';
const LNBITS_URL = process.env.LNBITS_URL || 'https://legend.lnbits.com';

// Check if we're in mock mode - use this to force real LNBits API even in dev environment
const USE_MOCK = process.env.USE_REAL_LNBITS !== 'true' && process.env.NODE_ENV !== 'production';

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

    const satsAmount = Number(amount);
    const description = memo || 'Lightning Tip Jar';

    // Use mock invoices if in mock mode
    if (USE_MOCK) {
      console.log('Using mock invoice');
      const mockPaymentHash = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const mockInvoice = `lnbc${satsAmount}n1pj8d56epp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdq0g3h8pjnek6k9wngj0mg97k3cmada8g5jq4dejry7jlmha8n06m6m9us9q8puqqqqgqqqqqqqqqqqqqqqqzqj2v33cd2wukmj4tmsp5w4v65x6llc3jj3qtzs2c9ej98qwm7pqqqssqzg572ccp7hf95h3ncyfxs9944g8m93bxk3q5nmjj8f4nr5mqkx5rrsdnkgswff8mh9k6645qfmx5nj4vgqklfzvdze4qrlrls4cqqmvwyvl`;
      
      return NextResponse.json({
        paymentHash: mockPaymentHash,
        paymentRequest: mockInvoice,
      });
    }

    // For production or when USE_REAL_LNBITS is true, use the actual LNBits API
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

      // Check if the response contains the expected error
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
      
      // Check for specific LNBits connection error
      if (apiError.response?.data?.detail?.includes("Unable to connect")) {
        return NextResponse.json(
          { error: "The Lightning Network node is currently unavailable. Please try again later." },
          { status: 503 }
        );
      }
      
      if (apiError.response) {
        return NextResponse.json(
          { error: `LNBits API error: ${apiError.response.status} - ${apiError.response.statusText}` },
          { status: apiError.response.status }
        );
      } else {
        return NextResponse.json(
          { error: `Error connecting to LNBits: ${apiError.message}` },
          { status: 500 }
        );
      }
    }
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice. Please check your LNBits configuration and try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentHash = searchParams.get('paymentHash');
    const simulateParam = searchParams.get('simulate');

    if (!paymentHash) {
      return NextResponse.json(
        { error: 'Payment hash is required' },
        { status: 400 }
      );
    }

    // If it's a mock payment hash or simulate param is present, simulate payment
    if (paymentHash.startsWith('mock_') || simulateParam === 'true') {
      console.log('Processing mock payment');
      // Always mark as paid when simulate=true is passed
      const shouldBePaid = simulateParam === 'true' ? true : Math.random() > 0.5;
      
      return NextResponse.json({ 
        paid: shouldBePaid,
        preimage: shouldBePaid ? 'mock_preimage_' + Date.now() : null,
        details: {
          checking_id: paymentHash,
          pending: false,
          amount: 100,
          fee: 0,
          memo: 'Lightning Tip Jar',
          time: Date.now() / 1000,
          bolt11: 'lnbc...',
          preimage: shouldBePaid ? 'mock_preimage_' + Date.now() : null,
          payment_hash: paymentHash,
          expiry: Date.now() / 1000 + 3600,
          extra: {},
          wallet_id: 'mock_wallet',
          webhook: null,
          webhook_status: null
        }
      });
    }

    // If not in mock mode, check the actual payment status
    if (!USE_MOCK) {
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

        // Check if the response contains the expected error
        if (response.data?.detail?.includes("Unable to connect")) {
          return NextResponse.json(
            { error: "The Lightning Network node is currently unavailable. Please try again later." },
            { status: 503 }
          );
        }

        const isPaid = response.data.paid;

        return NextResponse.json({ 
          paid: isPaid,
          preimage: response.data.preimage || null,
          details: response.data
        });
      } catch (apiError: any) {
        console.error('LNBits API error when checking payment:', apiError.message);
        
        // Check for specific LNBits connection error
        if (apiError.response?.data?.detail?.includes("Unable to connect")) {
          return NextResponse.json(
            { error: "The Lightning Network node is currently unavailable. Please try again later." },
            { status: 503 }
          );
        }
        
        if (apiError.response) {
          return NextResponse.json(
            { error: `LNBits API error: ${apiError.response.status} - ${apiError.response.statusText}` },
            { status: apiError.response.status }
          );
        } else {
          return NextResponse.json(
            { error: `Error connecting to LNBits: ${apiError.message}` },
            { status: 500 }
          );
        }
      }
    } else {
      // In mock mode, randomly mark payments as paid
      const shouldBePaid = Math.random() > 0.5;
      return NextResponse.json({ 
        paid: shouldBePaid,
        preimage: shouldBePaid ? 'mock_preimage_' + Date.now() : null,
        details: {
          checking_id: paymentHash,
          pending: false,
          amount: 100,
          fee: 0,
          memo: 'Lightning Tip Jar',
          time: Date.now() / 1000,
          bolt11: 'lnbc...',
          preimage: shouldBePaid ? 'mock_preimage_' + Date.now() : null,
          payment_hash: paymentHash,
          expiry: Date.now() / 1000 + 3600,
          extra: {},
          wallet_id: 'mock_wallet',
          webhook: null,
          webhook_status: null
        }
      });
    }
  } catch (error: any) {
    console.error('Error checking invoice status:', error);
    return NextResponse.json(
      { error: 'Failed to check invoice status. Please try again.' },
      { status: 500 }
    );
  }
}