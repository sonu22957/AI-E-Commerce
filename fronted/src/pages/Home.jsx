import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import AIRecommendation from "../components/ai/AIRecommendation";
import { FiArrowRight, FiShoppingBag, FiStar, FiZap, FiCpu, FiTrendingUp, FiShield, FiHeart } from "react-icons/fi";

/**
 * Premium Home Page
 * -----------------
 * A stunning, dynamic landing page with modern aesthetics:
 * - Animated gradients
 * - Glassmorphism UI elements
 * - Floating product cards
 * - Rich typography
 */
export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors overflow-hidden">
      <Navbar />

      <main className="flex-1 w-full">
        {/* ── Premium Hero Section ── */}
        <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/20 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/20 blur-[150px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
            <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-pink-500/20 blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
              
              {/* Left: Copy */}
              <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-8 animate-fade-in-up">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                  </span>
                  SmartCart AI 2.0 is Live
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
                  Next-gen shopping <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                    powered by AI
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
                  Experience retail reimagined. Our intelligent AI assistant curates the perfect items just for you, finding the best deals in real-time.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/products">
                    <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-xl flex items-center justify-center gap-2 group">
                      Explore Products
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link to="/ai-assistant">
                    <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-xl shadow-indigo-500/10 border border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2 group">
                      <FiCpu className="text-indigo-500" />
                      Try AI Assistant
                    </button>
                  </Link>
                </div>
                
                <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500 h-5 w-5" /> Free Shipping
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500 h-5 w-5" /> 24/7 AI Support
                  </div>
                </div>
              </div>

              {/* Right: Floating Interactive Showcase */}
              <div className="lg:col-span-6 relative h-[500px] lg:h-[600px] perspective-1000">
                {/* Center glowing orb */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                
                {/* Floating Card 1 */}
                <div 
                  className="absolute top-[10%] right-[15%] w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 z-20"
                  style={{ transform: `translateY(${scrollY * -0.1}px) rotate(5deg)` }}
                >
                  <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-2xl mb-3 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&q=80" className="w-full h-full object-cover" alt="Macbook" />
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 p-1.5 rounded-full text-pink-500">
                      <FiHeart className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">MacBook Pro M3</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><FiStar className="text-yellow-400 fill-current h-3 w-3" /> 4.9 (12k+)</p>
                    </div>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">₹1,99,900</p>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div 
                  className="absolute bottom-[20%] left-[5%] w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 z-30"
                  style={{ transform: `translateY(${scrollY * -0.2}px) rotate(-3deg)` }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                      AI
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">AI Recommendation</p>
                      <p className="text-xs text-indigo-500 font-medium">98% Match for you</p>
                    </div>
                  </div>
                  <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden flex">
                    <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80" className="w-1/3 object-cover" alt="Watch" />
                    <div className="p-3 flex-1 flex flex-col justify-center">
                      <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">Apple Watch Ultra 2</p>
                      <p className="text-[10px] text-gray-500 mt-1">Based on your tech views</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 3 (Small bubble) */}
                <div 
                  className="absolute top-[40%] left-[20%] px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl z-10 flex items-center gap-2"
                  style={{ transform: `translateY(${scrollY * -0.05}px)` }}
                >
                  <FiTrendingUp className="h-5 w-5" />
                  <span className="font-bold text-sm">Trending Now</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Premium Features Section ── */}
        <section className="py-24 bg-white dark:bg-[#0f0f13] relative z-10 border-t border-gray-100 dark:border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase mb-3">
                Why Choose Us
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                A shopping experience built for the future.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FiZap className="h-8 w-8 text-yellow-500" />,
                  title: "Lightning Fast",
                  desc: "Optimized architecture ensures zero lag. Browse, search, and checkout in the blink of an eye.",
                  bg: "bg-yellow-50 dark:bg-yellow-900/10"
                },
                {
                  icon: <FiCpu className="h-8 w-8 text-indigo-500" />,
                  title: "AI Curated",
                  desc: "Our machine learning models understand your taste, showing you exactly what you want before you know it.",
                  bg: "bg-indigo-50 dark:bg-indigo-900/10"
                },
                {
                  icon: <FiShield className="h-8 w-8 text-emerald-500" />,
                  title: "Bank-Grade Security",
                  desc: "Your data is encrypted end-to-end. We ensure your shopping experience is 100% safe and secure.",
                  bg: "bg-emerald-50 dark:bg-emerald-900/10"
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-2xl transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI Recommendations Section ── */}
        <section className="py-24 bg-gray-50 dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                  Curated Just For You
                </h2>
                <p className="text-gray-500 dark:text-gray-400">Products hand-picked by our AI</p>
              </div>
              <Link to="/products" className="hidden sm:flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">
                View All <FiArrowRight />
              </Link>
            </div>
            
            <AIRecommendation />
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-white mb-6">Ready to upgrade your shopping?</h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">Join thousands of smart shoppers using our AI-powered platform to find the best deals today.</p>
            <Link to="/products">
              <button className="px-10 py-5 rounded-full bg-white text-indigo-600 font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-2xl flex items-center justify-center gap-2 mx-auto">
                Start Shopping Now <FiArrowRight />
              </button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Simple icon for the hero section
function FiCheckCircle(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
