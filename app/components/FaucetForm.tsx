"use client";
import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { FaFaucet, FaRocket } from 'react-icons/fa';
import ReCAPTCHA from 'react-google-recaptcha';

const FaucetForm: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleRecaptchaChange = (token: string | null) => {
    if (token) {
      setRecaptchaToken(token);
    } else {
      setError('Failed to verify reCAPTCHA. Please try again.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/send-drip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, token: recaptchaToken }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Transaction successful! Check your wallet for tokens.');
      } else {
        setError(data.message || 'Transaction failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="mt-10 p-5 bg-white rounded shadow-md">
      <div className="flex justify-center mb-4">
        <FaFaucet size={40} className="mr-2 text-blue-500" />
        <FaRocket size={40} className="text-red-500" />
      </div>
      <Typography variant="h5" component="h1" className="text-center mb-4 text-black font-bold m-6 p-6">
        Dymension League - Apollo Testnet Faucet
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Ethereum Address. 0x..."
          variant="outlined"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="mb-4"
        />
        {/* reCAPTCHA widget */}
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
          onChange={handleRecaptchaChange}
          className='m-4'
        />
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">{success}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Drip'}
        </Button>
      </form>
    </Container>
  );
};

export default FaucetForm;
