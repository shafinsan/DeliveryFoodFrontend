import React from "react";
import { motion } from "framer-motion";
import {
  FaTwitter,
  FaYoutube,
  FaFacebookF,
  FaInstagram,
  FaArrowRight,
  FaEnvelope,
} from "react-icons/fa";

const fadeInUp = {
  hide: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hide: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0F172A] text-gray-300 overflow-hidden pt-16 pb-8 md:pt-20 md:pb-10">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hide"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16"
        >
          {/* Column 1: Brand - Centered on mobile, Left on Desktop */}
          <motion.div variants={fadeInUp} className="flex flex-col items-center sm:items-start space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-black text-xl">F</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tighter">
                Foodie's<span className="text-blue-500">Delight</span>
              </h2>
            </div>
            <p className="text-gray-400 text-center sm:text-left leading-relaxed max-w-xs text-sm md:text-base">
              Crafting premium culinary experiences since 2023. We bring the
              world's best flavors straight to your doorstep.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<FaTwitter />} href="#" />
              <SocialIcon icon={<FaYoutube />} href="#" />
              <SocialIcon icon={<FaFacebookF />} href="#" />
              <SocialIcon icon={<FaInstagram />} href="#" />
            </div>
          </motion.div>

          {/* Column 2: Navigation - Hidden/Stacked on mobile */}
          <motion.div variants={fadeInUp} className="hidden sm:block space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest border-l-4 border-blue-600 pl-3">
              Platform
            </h4>
            <ul className="space-y-4">
              <FooterLink label="Our Menu" />
              <FooterLink label="Featured Chefs" />
              <FooterLink label="Ordering Policy" />
              <FooterLink label="Gift Cards" />
            </ul>
          </motion.div>

          {/* Column 3: Company */}
          <motion.div variants={fadeInUp} className="space-y-6 text-center sm:text-left">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest border-blue-600 sm:border-l-4 sm:pl-3">
              Company
            </h4>
            <ul className="flex flex-col items-center sm:items-start space-y-4">
              <FooterLink label="About Us" />
              <FooterLink label="Careers" isNew />
              <FooterLink label="Contact Support" />
              <FooterLink label="Partner with Us" />
            </ul>
          </motion.div>

          {/* Column 4: Newsletter */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest text-center sm:text-left border-blue-600 sm:border-l-4 sm:pl-3">
              Newsletter
            </h4>
            <div className="relative group mx-auto sm:mx-0 max-w-sm">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-gray-800/30 border border-gray-700 rounded-2xl py-3.5 pl-11 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm text-white"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-blue-600 text-white rounded-xl active:scale-90 transition-transform">
                <FaArrowRight size={12} />
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/50 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] md:text-sm text-gray-500 text-center">
            © {currentYear} Foodie's Delight. Built by <span className="text-blue-500">YourDevName</span>
          </p>

          <div className="flex gap-6 md:gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <a href="#" className="hover:text-blue-500">Privacy</a>
            <a href="#" className="hover:text-blue-500">Terms</a>
            <a href="#" className="hover:text-blue-500">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }) => (
  <motion.a
    href={href}
    whileHover={{ y: -4 }}
    className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gray-800/50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
  >
    {icon}
  </motion.a>
);

const FooterLink = ({ label, isNew = false }) => (
  <li className="flex items-center gap-2 group cursor-pointer w-fit">
    <a className="relative text-sm text-gray-400 group-hover:text-white transition-colors duration-300">
      {label}
      <span className="absolute left-0 bottom-[-2px] w-0 h-[1.5px] bg-blue-500 transition-all duration-300 group-hover:w-full" />
    </a>
    {isNew && (
      <span className="text-[9px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded-full font-bold">
        Hiring
      </span>
    )}
  </li>
);

export default Footer;