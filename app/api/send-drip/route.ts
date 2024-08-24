// app/api/send-drip/route.ts
import { NextResponse } from "next/server";
import { ethers } from "ethers";
import axios from "axios";

export async function POST(request: Request) {
  const { address, token } = await request.json();

  if (!token) {
    return NextResponse.json(
      { success: false, message: "reCAPTCHA token is missing" },
      { status: 400 }
    );
  }

  // Verify reCAPTCHA token with Google
  const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

  try {
    const recaptchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      `secret=${recaptchaSecretKey}&response=${token}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("URL ");
    console.log("Recaptcha response: ", recaptchaResponse);
    if (!recaptchaResponse.data.success) {
      return NextResponse.json(
        { success: false, message: "Invalid reCAPTCHA" },
        { status: 400 }
      );
    }

    // reCAPTCHA verified successfully, proceed with the transaction
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      provider
    );

    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS as string,
      ["function sendDrip(address to) public"],
      wallet
    );

    const tx = await contract.sendDrip(address);
    await tx.wait();

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    console.error("Error during transaction or reCAPTCHA verification:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Transaction failed: " + errorMessage,
      },
      { status: 500 }
    );
  }
}
