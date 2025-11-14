import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Lock, Bell, Users, BarChart } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Case Management',
    desc: 'Comprehensive case tracking with real-time updates, status monitoring, and complete case history at your fingertips.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Search,
    title: 'Smart Search',
    desc: 'Advanced search capabilities to find cases, documents, and legal information instantly with intelligent filters.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Lock,
    title: 'Secure Platform',
    desc: 'Enterprise-grade security with end-to-end encryption, role-based access control, and complete audit trails.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Bell,
    title: 'Real-time Updates',
    desc: 'Instant notifications for case updates, hearings, deadlines, and important judicial decisions.',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Users,
    title: 'Multi-role Access',
    desc: 'Tailored dashboards for judges, lawyers, police, registrars, and citizens with role-specific features.',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: BarChart,
    title: 'Analytics & Reports',
    desc: 'Comprehensive reporting and analytics to track performance, trends, and key metrics across the system.',
    color: 'from-indigo-500 to-indigo-600',
  },
];

export default function InfoCards() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage judicial processes efficiently and transparently
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
