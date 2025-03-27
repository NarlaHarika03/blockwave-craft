
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { ChevronDown, Plus, Pickaxe, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchChain, mineBlock, Block as BlockType } from '@/lib/api';
import Block from '@/components/Block';
import Header from '@/components/Header';
import TransactionModal from '@/components/TransactionModal';

const Index = () => {
  const [chain, setChain] = useState<BlockType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMining, setIsMining] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  
  const fetchBlockchainData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchChain();
      setChain(data.chain);
    } catch (error) {
      console.error("Failed to fetch blockchain:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockchainData();
    
    // Refresh blockchain data every 10 seconds
    const intervalId = setInterval(fetchBlockchainData, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleMine = async () => {
    try {
      setIsMining(true);
      await mineBlock();
      await fetchBlockchainData();
    } catch (error) {
      console.error("Mining failed:", error);
    } finally {
      setIsMining(false);
    }
  };

  const handleTransactionComplete = async () => {
    await fetchBlockchainData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background">
      <Header />
      
      <main className="container px-4 py-6 max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 py-16"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Blockchain Explorer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              A beautiful interface to interact with your blockchain. Mine new blocks and create transactions.
            </p>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleMine} 
              disabled={isMining}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              size="lg"
            >
              <Pickaxe className="h-5 w-5" />
              {isMining ? "Mining..." : "Mine New Block"}
            </Button>
            
            <Button 
              onClick={() => setIsTransactionModalOpen(true)}
              variant="outline"
              className="gap-2 border-primary/20 bg-white/50 backdrop-blur-sm"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              Create Transaction
            </Button>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.5 }}
            className="mt-16 flex justify-center"
          >
            <a 
              href="#chain" 
              className="flex flex-col items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>View Blockchain</span>
              <ChevronDown className="h-4 w-4 mt-1 animate-pulse" />
            </a>
          </motion.div>
        </motion.section>
        
        {/* Blockchain Section */}
        <section id="chain" className="py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              <h2 className="text-2xl font-bold tracking-tight">Blockchain</h2>
            </div>
            <div className="text-sm text-muted-foreground">
              {chain.length} blocks
            </div>
          </div>
          
          {isLoading && chain.length === 0 ? (
            <div className="text-center py-20">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-muted h-12 w-12 mb-4"></div>
                <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            </div>
          ) : chain.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No blocks found in the blockchain.</p>
              <Button onClick={handleMine} className="mt-4">Mine Genesis Block</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {chain.slice().reverse().map((block, index) => (
                <Block key={block.index} block={block} index={index} />
              ))}
            </div>
          )}
        </section>
        
        {/* About Section */}
        <section id="about" className="py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-4">About BlockWave</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            BlockWave is a beautiful blockchain interface designed with simplicity and elegance in mind.
            It allows you to interact with your blockchain, mine new blocks, and create transactions
            with a clean and intuitive user experience.
          </p>
        </section>
      </main>
      
      <TransactionModal 
        open={isTransactionModalOpen}
        onOpenChange={setIsTransactionModalOpen}
        onTransactionComplete={handleTransactionComplete}
      />
    </div>
  );
};

export default Index;
