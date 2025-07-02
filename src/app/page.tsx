"use client";
import { useState } from "react";
import { db } from "../firebaseClient";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import CVUploader from "./components/CVUploader";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <CVUploader />
    </main>
  );
}
