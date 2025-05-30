
import React, { useState } from 'react';
import Navbar from './Navbar';
import Chatbot from './Chatbot'; // Import the Chatbot

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; {new Date().getFullYear()} Laptop Store Deluxe. All rights reserved.</p>
      </footer>
      
      {/* Chatbot FAB and Window */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsChatbotOpen(prev => !prev)}
          className="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-light transition-transform hover:scale-110"
          aria-label={isChatbotOpen ? "Close chat" : "Open chat assistant"}
        >
          {isChatbotOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 12s4.03 8.25 9 8.25Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a.75.75 0 0 0 .75-.75V6.75a.75.75 0 0 0-1.5 0v5.25a.75.75 0 0 0 .75.75Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 .75.75Z" />
            </svg>
          )}
        </button>
      </div>
      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
    </div>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

export default Layout;
