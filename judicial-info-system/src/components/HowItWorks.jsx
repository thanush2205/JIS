import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Register Your Account',
    desc: 'Sign up with your role - Judge, Lawyer, Police, Registrar, or Citizen.',
  },
  {
    number: '02',
    title: 'Verify Your Identity',
    desc: 'Complete secure verification to access role-specific features.',
  },
  {
    number: '03',
    title: 'Start Managing Cases',
    desc: 'Access your personalized dashboard and begin working efficiently.',
  },
  {
    number: '04',
    title: 'Track & Collaborate',
    desc: 'Real-time updates, collaboration tools, and comprehensive reporting.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get started in four simple steps and transform your judicial workflow
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 h-full">
                <div className="text-6xl font-bold text-red-500/30 mb-4">
                  {step.number}
                </div>
                <CheckCircle2 className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
