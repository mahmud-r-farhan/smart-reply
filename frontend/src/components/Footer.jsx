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
       Privacy first: Your data stays secure
      </p>
    </motion.div>
  );
};

export default Footer;