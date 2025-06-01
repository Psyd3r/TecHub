
import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  delay?: number;
}

export const TextGenerateEffect = ({ words, className = "", delay = 0 }: TextGenerateEffectProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) => words.slice(0, latest));

  useEffect(() => {
    const timer = setTimeout(() => {
      const controls = animate(count, words.length, {
        type: "tween",
        duration: 2.5,
        ease: "easeInOut",
      });
      return controls.stop;
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [words, count, delay]);

  return (
    <motion.span className={className}>
      {displayText}
    </motion.span>
  );
};
