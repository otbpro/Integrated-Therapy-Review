/**
 * DEPRECATED: This file is no longer used.
 * 
 * The project uses a standard HTML/CSS/JS checkout instead of Next.js/React.
 * See ../checkout.html for the active checkout implementation.
 * 
 * This file is kept for reference only.
 * The checkout system is now:
 * - File: checkout.html
 * - Payment: Flutterwave integration
 * - Cart: localStorage-based
 * - Currency: GBP
 */

/* Previous Next.js implementation below - DEPRECATED */
/*
'use client';  // ← important: this enables client-side interactivity

import React, { useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

export default function CheckoutPage() {
  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Consultation');
  const [amount, setAmount] = useState(150000); // in smallest unit, e.g. 150000 = UGX 150,000

  const config = {
    public_key: 'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X', // ← replace with yours (or env var)
    tx_ref: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9), // unique ref
    amount: amount / 100, // Flutterwave expects main unit (e.g. 1500 for UGX 150,000? Wait → check docs)
    currency: 'UGX', // Uganda Shillings – perfect for Kampala
    payment_options: 'card,mobilemoneyuganda,ussd,banktransfer', // relevant for UG
    redirect_url: 'https://yourdomain.com/payment/success', // or use callback below
    customer: {
      email,
      phone_number: phone,
      name: patientName,
    },
    customizations: {
      title: 'MediCare Payment',
      description: `Payment for ${service}`,
      logo: 'https://your-logo-url.com/medical-logo.png', // optional
    },
    meta: {
      patient_id: 'PAT-12345', // your internal reference
      service_type: service,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const onPaymentSuccess = (response: any) => {
    console.log('Payment successful!', response);
    // Verify on backend → call your /api/verify-payment endpoint
    // Show success message, save order, redirect, etc.
    alert('Thank you! Payment received. Order processing...');
    closePaymentModal(); // close popup
  };

  const onPaymentClose = () => {
    console.log('Payment modal closed');
    // Optional: handle cancellation
  };
*/


  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-900 antialiased">
      <div className="max-w-4xl mx-auto px-4 py-12 md:px-8">
        <h1 className="text-4xl font-bold text-center mb-2">Secure Medical Payment</h1>
        <p className="text-center text-gray-600 mb-10">
          Complete your payment securely via Flutterwave
        </p>

        <div className="bg-white shadow-xl rounded-2xl p-8 md:p-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!patientName || !email || !phone) {
                alert('Please fill all required fields');
                return;
              }
              handleFlutterPayment({
                callback: onPaymentSuccess,
                onclose: onPaymentClose,
              });
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Patient Full Name *</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+256..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Service / Procedure</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Consultation - UGX 150,000</option>
                <option>Lab Test Package - UGX 320,000</option>
                <option>Follow-up Visit - UGX 80,000</option>
                <option>Medication Delivery - UGX 450,000</option>
              </select>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span>UGX {amount.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition duration-200 text-lg shadow-md"
            >
              Pay Now with Flutterwave
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Secured by Flutterwave • We accept Visa, Mastercard, Mobile Money & Bank Transfer
          </p>
        </div>
      </div>
    </div>
  );
}