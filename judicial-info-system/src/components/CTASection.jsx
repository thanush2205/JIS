import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-red-700">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Judicial Workflow?
          </h2>
          <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
            Join thousands of legal professionals already using our platform to deliver justice efficiently and transparently.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              onClick={() => navigate('/signup')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-red-600 px-8 py-4 rounded-xl text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-2"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-800 text-white px-8 py-4 rounded-xl text-lg font-semibold border-2 border-white/30 hover:bg-red-900 transition-all duration-300"
            >
              Sign In
            </motion.button>
          </div>
          <p className="text-red-100 text-sm mt-6">
            No credit card required • Free trial available • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
