'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getStripe } from '@/lib/stripe';
import { useCart } from '../context/CartContext';

type Status = 'loading' | 'succeeded' | 'processing' | 'failed' | 'unknown';

function PurchaseCompleteContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const clientSecret = searchParams.get('payment_intent_client_secret');
  const redirectStatus = searchParams.get('redirect_status');

  useEffect(() => {
    if (!clientSecret) {
      setStatus('unknown');
      return;
    }

    async function verifyPayment() {
      const stripe = await getStripe();
      if (!stripe) {
        setStatus('unknown');
        return;
      }

      const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecret!);

      if (error) {
        setStatus('failed');
        setErrorMessage(error.message || 'Unable to verify payment status.');
        return;
      }

      switch (paymentIntent?.status) {
        case 'succeeded':
          clearCart();
          setStatus('succeeded');
          break;
        case 'processing':
          clearCart();
          setStatus('processing');
          break;
        default:
          setStatus('failed');
          setErrorMessage(`Payment status: ${paymentIntent?.status ?? redirectStatus ?? 'unknown'}.`);
      }
    }

    verifyPayment();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSecret]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-8 text-center shadow-xl">
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="animate-spin h-10 w-10 text-orange-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verifying Payment...</h1>
            <p className="text-slate-600 dark:text-slate-400">Please wait while we confirm your payment.</p>
          </>
        )}

        {status === 'succeeded' && (
          <>
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Payment Successful!</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              Your purchase has been completed successfully.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Download links have been sent to your email address.
            </p>
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Please check your inbox (and spam folder) for the download links. They are valid for 7 days.
              </p>
            </div>
            <Link
              href="/"
              className="mt-8 block w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-orange-500/30 text-center"
            >
              Back to Home
            </Link>
          </>
        )}

        {status === 'processing' && (
          <>
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Payment Processing</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              Your payment is being processed. This can take a moment.
            </p>
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                You will receive an email with your download links once the payment is confirmed.
              </p>
            </div>
            <Link
              href="/"
              className="mt-8 block w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-orange-500/30 text-center"
            >
              Back to Home
            </Link>
          </>
        )}

        {(status === 'failed' || status === 'unknown') && (
          <>
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {status === 'unknown' ? 'Page Not Found' : 'Payment Failed'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              {status === 'unknown'
                ? 'This page is only accessible after completing a payment.'
                : 'Your payment could not be completed.'}
            </p>
            {errorMessage && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">{errorMessage}</p>
            )}
            <Link
              href="/"
              className="mt-8 block w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-orange-500/30 text-center"
            >
              Back to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PurchaseCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-orange-600 border-t-transparent rounded-full" />
        </div>
      }
    >
      <PurchaseCompleteContent />
    </Suspense>
  );
}
