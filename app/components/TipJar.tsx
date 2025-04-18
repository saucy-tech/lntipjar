'use client';

import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import ReactConfetti from 'react-confetti';

type TipJarState = 'select' | 'pay' | 'success';
type AmountOption = 21 | 404 | 1000 | 20000 | 'custom';

// Helper to check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

export default function TipJar() {
  const [state, setState] = useState<TipJarState>('select');
  const [selectedAmount, setSelectedAmount] = useState<AmountOption>(21);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [invoice, setInvoice] = useState<string>('');
  const [paymentHash, setPaymentHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState({
    width: 800,
    height: 800
  });
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState<boolean>(false);
  const [useMock, setUseMock] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check current mode on component mount
  useEffect(() => {
    const checkMode = async () => {
      try {
        const response = await axios.get('/api/mode');
        setUseMock(response.data.useMock);
      } catch (err) {
        console.error('Error checking mode:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkMode();
  }, []);

  useEffect(() => {
    // Set window size once component is mounted
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, []);

  const handleAmountSelect = (amount: AmountOption) => {
    setSelectedAmount(amount);
    if (amount !== 'custom') {
      setCustomAmount('');
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setCustomAmount(value);
    }
  };

  const getAmount = () => {
    if (selectedAmount === 'custom') {
      return customAmount ? parseInt(customAmount, 10) : 0;
    }
    return selectedAmount;
  };

  const generateInvoice = async () => {
    try {
      setError('');
      setIsGeneratingInvoice(true);
      const amount = getAmount();
      
      if (amount <= 0) {
        setError('Please enter a valid amount');
        setIsGeneratingInvoice(false);
        return;
      }
      
      const response = await axios.post('/api/invoice', {
        amount,
        memo: message || 'Lightning Tip Jar'
      });
      
      setInvoice(response.data.paymentRequest);
      setPaymentHash(response.data.paymentHash);
      setState('pay');
      startPolling(response.data.paymentHash);
    } catch (err: any) {
      console.error('Error generating invoice:', err);
      // Check for specific LNBits connection error
      if (err.response?.data?.error?.includes("Unable to connect") || err.response?.status === 520) {
        setError("The Lightning Network node is currently unavailable. Please try again later.");
      } else {
        setError(err.response?.data?.error || 'Failed to generate invoice. Please try again.');
      }
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const startPolling = (hash: string) => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
    }
    
    pollTimerRef.current = setInterval(async () => {
      try {
        const response = await axios.get(`/api/invoice?paymentHash=${hash}`);
        if (response.data.paid) {
          clearInterval(pollTimerRef.current as NodeJS.Timeout);
          setState('success');
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      }
    }, 3000);
  };

  const resetForm = () => {
    setState('select');
    setSelectedAmount(21);
    setCustomAmount('');
    setMessage('');
    setInvoice('');
    setPaymentHash('');
    setError('');
    setShowConfetti(false);
    
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invoice);
      alert('Invoice copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // This function simulates a payment in development mode
  const simulatePay = async () => {
    try {
      const response = await axios.get(`/api/invoice?paymentHash=${paymentHash}&simulate=true`);
      if (response.data.paid) {
        clearInterval(pollTimerRef.current as NodeJS.Timeout);
        setState('success');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (err) {
      console.error('Error simulating payment:', err);
    }
  };

  // Toggle between mock mode and real LNBits API (for development only)
  const toggleMockMode = async () => {
    try {
      const response = await axios.post('/api/mode', {
        useMock: !useMock
      });
      setUseMock(response.data.useMock);
      // Refresh page to ensure the backend sees the updated setting
      window.location.reload();
    } catch (err) {
      console.error('Error toggling mock mode:', err);
    }
  };

  if (isLoading && isDev) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          colors={['#facc15', '#8b5cf6', '#ec4899', '#10b981']}
        />
      )}
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 gradient-text">Lightning Tip Jar</h1>
        <p className="text-gray-300">Support with Bitcoin Lightning ⚡</p>
      </div>
      
      {isDev && (
        <div className="mb-4 text-xs text-center">
          <div className="p-2 bg-gray-800 rounded-md mb-2">
            <p className="text-gray-400">Development Mode</p>
            <p className="text-gray-300">Using {useMock ? 'mock invoices' : 'real LNBits API'}</p>
            <button 
              onClick={toggleMockMode}
              className="mt-2 px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600"
            >
              Switch to {useMock ? 'real LNBits API' : 'mock invoices'}
            </button>
          </div>
        </div>
      )}
      
      <div className="gradient-border p-6 rounded-lg">
        {state === 'select' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Select Amount (sats)</label>
              <div className="grid grid-cols-2 gap-3">
                {[21, 404, 1000, 20000].map((amount) => (
                  <button
                    key={amount}
                    className={`amount-btn p-2 rounded-md ${
                      selectedAmount === amount ? 'active' : ''
                    }`}
                    onClick={() => handleAmountSelect(amount as AmountOption)}
                  >
                    {amount} sats
                  </button>
                ))}
              </div>
              
              <div className="mt-3 flex items-center">
                <button
                  className={`amount-btn p-2 rounded-md mr-2 ${
                    selectedAmount === 'custom' ? 'active' : ''
                  }`}
                  onClick={() => handleAmountSelect('custom')}
                >
                  Custom
                </button>
                {selectedAmount === 'custom' && (
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter amount"
                    className="w-full p-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Message (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message with your tip"
                className="w-full p-2 bg-gray-800 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            {error && <p className="text-red-500 text-sm p-2 bg-red-500/10 rounded-md">{error}</p>}
            
            <button
              onClick={generateInvoice}
              disabled={isGeneratingInvoice}
              className={`lightning-btn w-full py-3 px-4 rounded-md text-black font-bold flex items-center justify-center ${
                isGeneratingInvoice ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isGeneratingInvoice ? 'Generating...' : 'Leave a Tip ⚡'}
            </button>

            {!useMock && (
              <p className="text-xs text-gray-400 text-center mt-2">
                Using LNBits at {process.env.APP_MODE === 'real' && !useMock ? 'phoenix.delineator.media' : 'mock mode'} 
                {isDev && 
                  <button
                    className="ml-2 text-xs text-purple-400 underline"
                    onClick={toggleMockMode}
                  >
                    Use {useMock ? 'real API' : 'mock mode'} instead
                  </button>
                }
              </p>
            )}
          </div>
        )}

        {state === 'pay' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-1">Pay with Lightning</h2>
              <p className="text-sm text-gray-300 mb-4">
                Scan the QR code or copy the invoice to pay {getAmount()} sats
              </p>
              
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <QRCodeSVG
                  value={invoice}
                  size={200}
                  level="L"
                  includeMargin={true}
                />
              </div>
              
              <div className="flex mb-4">
                <input
                  type="text"
                  value={invoice}
                  readOnly
                  className="w-full p-2 bg-gray-800 rounded-l-md text-xs font-mono focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-gray-700 px-3 rounded-r-md hover:bg-gray-600"
                >
                  Copy
                </button>
              </div>
              
              <p className="text-sm text-gray-400 mb-4">
                Waiting for payment... The page will update automatically when payment is received.
              </p>
              
              {isDev && (
                <button
                  onClick={simulatePay}
                  className="text-xs py-1 px-2 bg-gray-700 rounded text-gray-300 hover:bg-gray-600"
                >
                  [DEV] Simulate Payment
                </button>
              )}
            </div>
            
            <button
              onClick={resetForm}
              className="w-full py-2 px-4 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        )}

        {state === 'success' && (
          <div className="space-y-6 text-center">
            <div>
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2 gradient-text">Thank You!</h2>
              <p className="text-gray-300 mb-6">
                Your payment of {getAmount()} sats has been received.
              </p>
            </div>
            
            <button
              onClick={resetForm}
              className="lightning-btn w-full py-3 px-4 rounded-md text-black font-bold"
            >
              Send Another Tip ⚡
            </button>
          </div>
        )}
      </div>
    </div>
  );
}