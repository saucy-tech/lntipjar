'use client';

import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import ReactConfetti from 'react-confetti';
import Button from './Button';

type TipJarState = 'select' | 'pay' | 'success';
type AmountOption = 21 | 404 | 1000 | 20000 | 'custom';

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
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy');
  
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

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
      // Friendly error message regardless of error type
      setError("Sorry, we couldn't connect to the Lightning Network at this time. Please try again later.");
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
        // We don't show errors during polling as it might be temporary
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
    setCopyButtonText('Copy');
    
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invoice);
      setCopyButtonText('Copied!');
      // Reset back to "Copy" after 3 seconds
      setTimeout(() => setCopyButtonText('Copy'), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopyButtonText('Error');
      setTimeout(() => setCopyButtonText('Copy'), 3000);
    }
  };

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
      
      <div className="gradient-border rounded-lg p-6">
        {state === 'select' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Select Amount (sats)</label>
              <div className="grid grid-cols-2 gap-3">
                {[21, 404, 1000, 20000].map((amount) => (
                  <Button
                    key={amount}
                    size="m"
                    format={selectedAmount === amount ? 'primary' : 'tertiary'}
                    onClick={() => handleAmountSelect(amount as AmountOption)}
                    className="py-2"
                  >
                    {amount} sats
                  </Button>
                ))}
              </div>
              
              <div className="mt-3 flex items-center">
                <Button
                  size="m"
                  format={selectedAmount === 'custom' ? 'primary' : 'tertiary'}
                  onClick={() => handleAmountSelect('custom')}
                  className="mr-2 py-2"
                >
                  Custom
                </Button>
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
            
            {error && (
              <div className="bg-red-500/10 rounded-md p-3">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}
            
            <Button
              format="primary"
              size="l"
              fullWidth
              onClick={generateInvoice}
              disabled={isGeneratingInvoice}
            >
              {isGeneratingInvoice ? 'Generating...' : 'Leave a Tip ⚡'}
            </Button>
          </div>
        )}

        {state === 'pay' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-1">Pay with Lightning</h2>
              <p className="text-sm text-gray-300 mb-4">
                Scan the QR code or copy the invoice to pay {getAmount()} sats
              </p>
              
              <div className="bg-white p-6 rounded-lg inline-block mb-4">
                <QRCodeSVG
                  value={invoice}
                  size={200}
                  level="L"
                />
              </div>
              
              <div className="flex mb-4">
                <input
                  type="text"
                  value={invoice}
                  readOnly
                  className="w-full p-2 bg-gray-800 rounded-l-md text-xs font-mono focus:outline-none"
                />
                <Button
                  format="tertiary"
                  size="m"
                  onClick={copyToClipboard}
                  className="rounded-l-none rounded-r-md w-[120px]"
                >
                  {copyButtonText}
                </Button>
              </div>
              
              <p className="text-sm text-gray-400 mb-4">
                Waiting for payment... The page will update automatically when payment is received.
              </p>
            </div>
            
            <Button
              format="secondary"
              size="m"
              fullWidth
              onClick={resetForm}
            >
              Cancel
            </Button>
          </div>
        )}

        {state === 'success' && (
          <div className="space-y-6 text-center">
            <div>
              <div className="text-7xl mx-auto mb-4">
               🤘
              </div>
              <h2 className="text-xl font-bold mb-2 gradient-text">Thank You!</h2>
              <p className="text-gray-300 mb-6">
                Your payment of {getAmount()} sats has been received.
              </p>
            </div>
            
            <Button
              format="primary"
              size="l"
              fullWidth
              onClick={resetForm}
            >
              Send Another Tip ⚡
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}