import  { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-8 text-center"
    >
      <p className="text-slate-500 text-sm">
       Privacy first: Your data stays secure | <a href="https://ravlo.vercel.app" target="_blank" className="underline decoration-wavy decoration-indigo-500">Ravlo's First Open-Source Edition</a>
      </p>
    </motion.div>
  );
};

export default Footer;