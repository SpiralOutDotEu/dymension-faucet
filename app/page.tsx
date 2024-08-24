import Image from "next/image";
import FaucetForm from "./components/FaucetForm";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <FaucetForm />
    </main>
  );
}
