import React, { useEffect, useMemo } from "react";
import Slider from "react-slick";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Icons
import {
  FaStar,
  FaArrowRight,
  FaClock,
  FaLeaf,
  FaTruckFast,
  FaPlay,
  FaMobileScreenButton,
} from "react-icons/fa6";
import {
  PiChefHatFill,
  PiQuotesFill,
  PiArrowCircleRightFill,
} from "react-icons/pi";
import { MdVerified, MdOutlineSecurity } from "react-icons/md";

// Assets
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const floating3D = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, -5, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.05,
    y: -10,
    transition: { type: "spring", stiffness: 400 },
  },
};

// --- MOCK DATA ---
const MOCK_CATEGORIES = [
  {
    name: "Italian",
    img: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?q=80&w=400",
  },
  {
    name: "Japanese",
    img: "https://images.unsplash.com/photo-1583953623787-ada99d338235?q=80&w=400",
  },
  {
    name: "Burgers",
    img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400",
  },
  {
    name: "Desserts",
    img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400",
  },
];

const MOCK_FOODS = [
  {
    id: 1,
    name: "Truffle Ribeye Steak",
    price: 45.99,
    cat: "Premium",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVZmMl1PIXbRvsqjFYwn1ziTYAYQyaFH4t1A&s",
  },
  {
    id: 2,
    name: "Signature Sushi Platter",
    price: 32.5,
    cat: "Japanese",
    img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600",
  },
  {
    id: 3,
    name: "Avocado Zest Pasta",
    price: 18.0,
    cat: "Vegan",
    img: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=600",
  },
  {
    id: 4,
    name: "Black Gold Burger",
    price: 24.99,
    cat: "Burgers",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600",
  },
];

const Home = () => {
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, centerMode: true, centerPadding: "20px" },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-slate-900 overflow-x-hidden">
      {/* 1. EPIC HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 lg:pt-0">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[100px]" />

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="space-y-8 relative z-10"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white shadow-xl shadow-blue-100/50 rounded-full border border-blue-50 text-blue-600 font-black text-xs uppercase tracking-widest">
              <FaClock className="animate-spin-slow" /> Rapid Delivery: 24/7
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
              Eat like a <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent italic">
                Connoisseur.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-lg font-medium leading-relaxed">
              Ditch the ordinary. We curate Michelin-star flavors from top-tier
              chefs and bring them to your sanctuary in minutes.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <button className="group px-10 py-6 bg-slate-950 text-white rounded-[2rem] font-black text-lg flex items-center gap-4 hover:bg-blue-600 transition-all duration-500 shadow-2xl shadow-blue-200">
                Order Now{" "}
                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="px-10 py-6 bg-white text-slate-900 border border-slate-200 rounded-[2rem] font-bold text-lg flex items-center gap-3 hover:bg-slate-50 transition-all shadow-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FaPlay size={12} />
                </div>
                Watch Story
              </button>
            </div>
          </motion.div>

          {/* 3D Visual Center */}
          <div className="relative h-[600px] flex items-center justify-center">
            <motion.div
              variants={floating3D}
              animate="animate"
              className="relative z-20"
            >
              <div className="relative rounded-[4rem] overflow-hidden border-[15px] border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] transform -rotate-3 hover:rotate-0 transition-transform duration-700">
                <img
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800"
                  className="w-[450px] h-[550px] object-cover"
                  alt="Pro Burger"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </motion.div>

            {/* Floating Glassmorphism Stat */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-10 -right-4 z-30 bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-2xl flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                <MdVerified />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800">4.9/5</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Customer Satisfaction
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION (TRUST BUILDER) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            ["50k+", "Happy Foodies"],
            ["120+", "Elite Chefs"],
            ["30min", "Avg. Delivery"],
            ["99.9%", "Secure Pay"],
          ].map(([val, label], idx) => (
            <div key={idx} className="space-y-1">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">
                {val}
              </h2>
              <p className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHY US (3D CARDS) */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-5xl font-black tracking-tight text-slate-900">
              Why Foodies Love Us
            </h2>
            <p className="text-slate-500 font-medium">
              We've re-engineered the food experience from the ground up.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<FaLeaf />}
              title="Eco-Premium"
              desc="100% organic sourcing from farms that practice carbon-neutral harvesting."
              img="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800"
            />
            <FeatureCard
              icon={<FaTruckFast />}
              title="Sonic Delivery"
              desc="AI-powered routing ensures your meal arrives within 30 minutes, or it's on us."
              img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHVovkKkPt0bXt87RXO5m4szkpznlf85f2hg&s"
            />
            <FeatureCard
              icon={<PiChefHatFill />}
              title="Artisan Craft"
              desc="Every dish is quality-checked by our culinary directors before leaving the kitchen."
              img="https://www.thefoodsafetycompany.ie/wp-content/uploads/artisan-food-1.jpg"
            />
          </div>
        </div>
      </section>

      {/* 4. FEATURED MENU SLIDER */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
              <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em]">
                Curation
              </span>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
                This Week's Signature
              </h2>
            </div>
            <button className="flex items-center gap-3 font-black text-sm uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
              Explore Full Menu <PiArrowCircleRightFill size={24} />
            </button>
          </div>

          <div className="slider-container -mx-4">
            <Slider {...sliderSettings}>
              {MOCK_FOODS.map((f) => (
                <FoodCard key={f.id} data={f} />
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* 5. APP PROMO (GLASSMORPHISM) */}
      <section className="py-24 container mx-auto px-6">
        <div className="bg-slate-950 rounded-[4rem] p-12 md:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-[100px]" />

          <div className="lg:w-1/2 space-y-8 relative z-10">
            <h2 className="text-5xl md:text-6xl font-black text-white leading-none">
              Your Cravings, <br /> One Tap Away.
            </h2>
            <p className="text-slate-400 text-lg">
              Get the app to unlock exclusive weekly drops and real-time chef
              tracking.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-500 hover:text-white transition-all">
                <FaMobileScreenButton /> App Store
              </button>
              <button className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black border border-slate-700 hover:border-slate-500 transition-all">
                Google Play
              </button>
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center">
            <motion.img
              animate={{ y: [0, -30, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=400"
              className="w-72 h-[500px] object-cover rounded-[3rem] border-[10px] border-slate-800 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-32">
        <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <PiQuotesFill className="text-blue-600 text-6xl" />
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
              What our <br /> community says.
            </h2>
          </div>
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
            <TestimonialCard
              user="Samsul Arefin"
              text="The quality of ingredients is incomparable. It's like having a private chef on speed dial."
            />
            <TestimonialCard
              user="Elias Jaber"
              text="30 minutes delivery for a 5-course quality meal? My mind is blown every time."
            />
          </div>
        </div>
      </section>
    </main>
  );
};

// --- HELPER COMPONENTS ---

const FeatureCard = ({ icon, title, desc, img }) => (
  <motion.div
    variants={cardHover}
    initial="rest"
    whileHover="hover"
    className="group relative h-[450px] rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200"
  >
    <img
      src={img}
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
      alt={title}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
    <div className="absolute inset-0 p-10 flex flex-col justify-end">
      <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl mb-6 shadow-xl shadow-blue-500/30">
        {icon}
      </div>
      <h3 className="text-3xl font-black text-white mb-2">{title}</h3>
      <p className="text-slate-300 font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {desc}
      </p>
    </div>
  </motion.div>
);

const FoodCard = ({ data }) => (
  <div className="px-4 py-8">
    <div className="bg-white rounded-[3.5rem] p-5 border border-slate-100 shadow-xl hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] transition-all duration-500 group cursor-pointer">
      <div className="relative h-72 rounded-[2.8rem] overflow-hidden mb-6">
        <img
          src={data.img}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          alt={data.name}
          onError={(e) =>
            (e.target.src =
              "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?q=80&w=1000")
          }
        />
        <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl text-[10px] font-black text-blue-600 shadow-lg uppercase tracking-[0.2em] z-20">
          {data.cat}
        </div>
      </div>
      <div className="space-y-3 px-3">
        <h3 className="font-black text-slate-800 text-2xl truncate">
          {data.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="font-black text-blue-600 text-3xl">${data.price}</p>
          <div className="flex items-center gap-2 text-yellow-400 font-black">
            <FaStar /> <span className="text-slate-400 text-sm">4.9</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TestimonialCard = ({ user, text }) => (
  <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-100 border border-slate-50 space-y-6">
    <p className="text-slate-500 text-lg font-medium leading-relaxed italic">
      "{text}"
    </p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
        <img src={`https://i.pravatar.cc/150?u=${user}`} alt={user} />
      </div>
      <div>
        <p className="font-black text-slate-900">{user}</p>
        <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">
          Verified Foodie
        </p>
      </div>
    </div>
  </div>
);

export default Home;
