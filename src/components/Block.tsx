
import React from 'react';
import { motion } from 'framer-motion';
import { Block as BlockType } from '@/lib/api';
import { Shield, Database, ArrowRight } from 'lucide-react';

interface BlockProps {
  block: BlockType;
  index: number;
}

const Block: React.FC<BlockProps> = ({ block, index }) => {
  const formattedTime = new Date(block.timestamp * 1000).toLocaleString();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="glass-card rounded-2xl p-6 mb-4 transform transition-all hover:shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Block #{block.index}</h3>
        </div>
        <div className="text-sm text-muted-foreground">{formattedTime}</div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-primary/70" />
          <span className="text-sm font-medium">Proof of Work:</span>
          <span className="text-sm font-mono">{block.proof}</span>
        </div>
        
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <ArrowRight className="h-4 w-4 text-primary/70" />
            <span className="text-sm font-medium">Prev Hash:</span>
          </div>
          <p className="hash-text bg-muted/50 p-2 rounded-md">{block.previous_hash}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Transactions ({block.transactions.length})</h4>
          <div className="max-h-48 overflow-y-auto rounded-md bg-muted/50 p-2">
            {block.transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No transactions</p>
            ) : (
              block.transactions.map((tx, idx) => (
                <div key={idx} className="text-xs mb-2 p-2 bg-white/50 rounded-md last:mb-0">
                  <div className="grid grid-cols-[auto_1fr] gap-x-2">
                    <span className="font-medium">From:</span>
                    <span className="font-mono truncate">{tx.sender || 'System'}</span>
                    
                    <span className="font-medium">To:</span>
                    <span className="font-mono truncate">{tx.recipient || 'System'}</span>
                    
                    <span className="font-medium">Amount:</span>
                    <span>{tx.amount}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Block;
