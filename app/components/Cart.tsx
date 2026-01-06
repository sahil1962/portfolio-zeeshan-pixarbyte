'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';

export default function Cart() {
  const { cart, removeFromCart, getCartTotal, getCartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  if (getCartCount() === 0 && !isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-orange-600 hover:bg-orange-700 text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110"
          aria-label="Shopping cart"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {getCartCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-8 w-96 max-w-[calc(100vw-4rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-40 max-h-150 flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Shopping Cart ({getCartCount()})
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p>Your cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm pr-2">
                      {item.title}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors shrink-0"
                      aria-label="Remove from cart"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {item.pages} pages
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-slate-900 dark:text-white">Total:</span>
                <span className="text-orange-600 dark:text-orange-400">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowCheckout(true);
                  setIsOpen(false);
                }}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-orange-500/30"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </>
  );
}
