'use client';

import { useState, FormEvent } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';

interface PaymentFormProps {
  email: string;
  total: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function PaymentForm({
  email,
  total,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/purchase-complete`,
          receipt_email: email,
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('Payment error:', error);
        onError(error.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      // Check various success statuses
      if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
        // The Stripe webhook handles sending the email
        // See: app/api/checkout/webhook/route.ts
        onSuccess();
      } else if (paymentIntent) {
        // Handle other statuses
        if (paymentIntent.status === 'requires_action') {
          onError('Additional authentication required. Please try again.');
        } else {
          onError(`Payment status: ${paymentIntent.status}. Please contact support.`);
        }
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Payment exception:', err);
      onError('An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
          Payment Details
        </h4>
        <div className="stripe-payment-element">
          <PaymentElement />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </>
        ) : (
          `Pay $${total.toFixed(2)}`
        )}
      </button>

    </form>
  );
}
