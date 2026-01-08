import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface BackToListButtonProps {
  listPath: string;
  label?: string;
}

export default function BackToListButton({ listPath, label = "返回列表" }: BackToListButtonProps) {
  const [, navigate] = useLocation();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(listPath)}
      className="fixed bottom-8 right-8 z-40 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow duration-300"
      title={label}
    >
      <ArrowLeft size={24} />
    </motion.button>
  );
}
