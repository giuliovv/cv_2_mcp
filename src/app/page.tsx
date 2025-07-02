"use client";

import CVUploader from "./components/CVUploader";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <CVUploader />
    </main>
  );
}
