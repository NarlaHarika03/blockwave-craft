
import React from 'react';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full py-6 px-8 flex justify-between items-center glass-panel rounded-b-3xl mb-8 sticky top-0 z-50"
    >
      <div className="flex items-center space-x-3">
        <Database className="h-8 w-8" />
        <h1 className="text-2xl font-bold tracking-tight">BlockWave</h1>
      </div>
      
      <div className="hidden md:flex items-center space-x-6">
        <a href="#chain" className="text-sm font-medium transition-all hover:text-primary/80">
          Blockchain
        </a>
        <a href="#about" className="text-sm font-medium transition-all hover:text-primary/80">
          About
        </a>
      </div>
    </motion.header>
  );
};

export default Header;
