import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Features from '@/components/techs/Features';
import Ai from '@/components/techs/Ai';

export default function TechsPage() {
  return (
    <main className="min-h-screen">
      {/* <N /> */}
      
      {/* Features Section (The Techs component we just built) */}
        <Features />
        <Ai/>
      {/* Artificial Intelligence Section */}
      {/* <AISection />/ */}

    </main>
  );
}