'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import PaymentForm from './PaymentForm';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'email' | 'otp' | 'payment' | 'success';

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, getCartTotal, clearCart } = useCart();

  // Multi-step flow state
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [cartHash, setCartHash] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryAfter, setRetryAfter] = useState(0);

  // Countdown timer for rate limiting
  useEffect(() => {
    if (retryAfter > 0) {
      const timer = setInterval(() => {
        setRetryAfter((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [retryAfter]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStep('email');
      setEmail('');
      setOtp('');
      setCartHash('');
      setClientSecret('');
      setError('');
      setRetryAfter(0);
    }
  }, [isOpen]);

  // Step 1: Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          cartTotal: getCartTotal(),
          items: cart.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            key: item.id, // Use id as key for R2
          })),
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        // Rate limited
        const match = data.error.match(/(\d+) seconds/);
        if (match) {
          setRetryAfter(parseInt(match[1]));
        }
        setError(data.error);
      } else if (!response.ok) {
        setError(data.error || 'Failed to send verification code');
      } else {
        setCartHash(data.cartHash);
        setStep('otp');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          cartHash,
          items: cart.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            key: item.id,
          })),
          total: getCartTotal(),
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        const match = data.error.match(/(\d+) seconds/);
        if (match) {
          setRetryAfter(parseInt(match[1]));
        }
        setError(data.error);
      } else if (!response.ok) {
        setError(data.error || 'Verification failed');
      } else {
        setClientSecret(data.clientSecret);
        setStep('payment');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Payment success callback
  const handlePaymentSuccess = () => {
    setStep('success');
    // Clear cart and close modal after 4 seconds
    setTimeout(() => {
      clearCart();
      onClose();
    }, 4000);
  };

  // Step 3: Payment error callback
  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (!isOpen) return null;

  const stripePromise = getStripe();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Success Step */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Payment Successful!
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              Your purchase has been completed successfully.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Download links have been sent to{' '}
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                {email}
              </span>
            </p>
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Please check your email inbox (and spam folder) for the download
                links. They are valid for 7 days.
              </p>
            </div>
          </div>
        )}

        {/* Other Steps */}
        {step !== 'success' && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Checkout
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {step === 'email' && 'Step 1: Verify your email'}
                  {step === 'otp' && 'Step 2: Enter verification code'}
                  {step === 'payment' && 'Step 3: Complete payment'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Order Summary */}
              <div className="mb-6 bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                  Order Summary
                </h4>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        {item.title}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold">
                    <span className="text-slate-900 dark:text-white">Total</span>
                    <span className="text-orange-600 dark:text-orange-400">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {error}
                  </p>
                  {retryAfter > 0 && (
                    <p className="text-xs text-red-600 dark:text-red-500 mt-2">
                      Retry in {retryAfter} seconds...
                    </p>
                  )}
                </div>
              )}

              {/* Step 1: Email */}
              {step === 'email' && (
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-900 dark:text-white"
                      placeholder="your@email.com"
                      disabled={isLoading || retryAfter > 0}
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      We&apos;ll send a verification code to this email
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || retryAfter > 0 || !email}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-orange-500/30"
                  >
                    {isLoading ? 'Sending...' : 'Send Verification Code'}
                  </button>
                </form>
              )}

              {/* Step 2: OTP */}
              {step === 'otp' && (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="text-center mb-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      We sent a 6-digit code to{' '}
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        {email}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep('email')}
                      className="text-sm text-orange-600 dark:text-orange-400 hover:underline mt-1"
                    >
                      Change email
                    </button>
                  </div>

                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Verification Code *
                    </label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                      }
                      required
                      maxLength={6}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-900 dark:text-white text-center text-2xl letter-spacing-wide font-mono"
                      placeholder="000000"
                      disabled={isLoading || retryAfter > 0}
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                      Code expires in 10 minutes
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || retryAfter > 0 || otp.length !== 6}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-orange-500/30"
                  >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </button>
                </form>
              )}

              {/* Step 3: Payment */}
              {step === 'payment' && clientSecret && stripePromise && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret
                    // appearance: {
                    //   theme: 'stripe',
                    //   variables: {
                    //     colorPrimary: '#2563eb',
                    //     colorBackground: '#ffffff',
                    //     colorText: '#1e293b',
                    //     colorDanger: '#ef4444',
                    //     fontFamily: 'system-ui, sans-serif',
                    //     spacingUnit: '4px',
                    //     borderRadius: '8px',
                    //   },
                    // },
                    // loader: 'auto',
                  }}
                >
                  <PaymentForm
                    email={email}
                    total={getCartTotal()}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
