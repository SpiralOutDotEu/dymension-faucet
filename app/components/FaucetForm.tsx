"use client";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Box,
  AlertTitle,
} from "@mui/material";
import { FaFaucet } from "react-icons/fa";
import { MdOutlineRocketLaunch } from "react-icons/md";
import ReCAPTCHA from "react-google-recaptcha";

const FaucetForm: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleRecaptchaChange = (token: string | null) => {
    if (token) {
      setRecaptchaToken(token);
    } else {
      setError("Failed to verify reCAPTCHA. Please try again.");
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/send-drip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, token: recaptchaToken }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(
          "Transaction successful! Check your wallet for tokens. Please come back tomorrow to request again."
        );
      } else {
        setError(data.message || "Transaction failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddChain = () => {
    // Network details
    const chainId = "0xC82";
    const chainName = "Dymension League - Apollo";
    const rpcUrl = "https://rpc-apollo.dymension-league.xyz/";
    const blockExplorerUrl = null;
    const nativeCurrency = { name: "DYML", symbol: "DYML", decimals: 18 };

    // @ts-ignore
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId,
          chainName,
          rpcUrls: [rpcUrl],
          blockExplorerUrls: null,
          nativeCurrency,
        },
      ],
    });
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="flex justify-center items-center mb-6">
        <FaFaucet size={80} className="mr-4 text-blue-500" />
        <MdOutlineRocketLaunch size={80} className="text-red-500" />
      </div>

      <Container maxWidth="sm" className="p-5 bg-white rounded shadow-md">
        <Typography
          variant="h5"
          component="h1"
          className="text-center mb-4 text-black font-bold"
        >
          Dymension League - Apollo Testnet Faucet
        </Typography>
        <Typography className="text-center mb-6 text-gray-600">
          This faucet allows you to request testnet tokens for the Dymension
          League Apollo Testnet once every 24 hours. Please enter your Ethereum
          address and complete the reCAPTCHA to receive tokens.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Ethereum Address. 0x..."
            variant="outlined"
            fullWidth
            value={address}
            onChange={handleAddressChange}
            required
            className="mb-4"
          />

          <Box display="flex" justifyContent="center" mb={2}>
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
              onChange={handleRecaptchaChange}
            />
          </Box>

          {error && (
            <Alert severity="error" className="mb-4" variant="outlined">
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" className="mb-4" variant="filled">
              <AlertTitle>Success</AlertTitle>
              {success}
            </Alert>
          )}

          {!success && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || !address || !recaptchaToken}
              className="mb-4"
            >
              {loading ? "Sending..." : "Drip"}
            </Button>
          )}
        </form>

        <Box className="text-center mt-6">
          <Button variant="outlined" color="secondary" onClick={handleAddChain}>
            Add Network to MetaMask
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default FaucetForm;
