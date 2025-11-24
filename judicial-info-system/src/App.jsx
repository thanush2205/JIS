import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import "./styles/LandingPage.css";

// icons
import {
  FaBalanceScale,
  FaGavel,
  FaFileAlt,
  FaUserTie,
  FaBell,
  FaShieldAlt,
  FaClipboardList,
  FaSearch,
  FaUsers,
  FaUniversity,
  FaChartBar,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

// Components / Pages
import LandingNavbar from "./components/LandingNavbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Registrar from "./pages/Registrar";
import Judge from "./pages/Judge";
import Lawyer from "./pages/Lawyer";
import Police from "./pages/Police";
import User from "./pages/User";
import PaymentSuccess from "./pages/PaymentSuccess";
// Use remote images to avoid missing local asset errors. You can replace with local files later.
const images = [
  'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=1600&q=80', // courthouse
  'https://images.unsplash.com/photo-1555374018-13a8994ab246?auto=format&fit=crop&w=1600&q=80',   // gavel
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80', // law books
];
const headlines = ["Judicial Transparency", "Access to Justice", "Digital Legal System"];
const services = [
  { icon: <FaSearch />, title: "Case Tracking", desc: "Track ongoing and past cases efficiently." },
  { icon: <FaFileAlt />, title: "Legal Documents", desc: "Access verified legal documents anytime." },
  { icon: <FaClipboardList />, title: "Online Filing", desc: "Submit petitions and filings digitally." },
  { icon: <FaUserTie />, title: "Lawyer Consultation", desc: "Connect with registered lawyers quickly." },
  { icon: <FaBell />, title: "Court Notifications", desc: "Get timely hearing & update alerts." },
  { icon: <FaShieldAlt />, title: "Document Verification", desc: "Verify documents securely and fast." },
  { icon: <FaBalanceScale />, title: "Legal Rights Info", desc: "Understand rights & procedures." },
  { icon: <FaGavel />, title: "Case Filing Guidance", desc: "Step-by-step help for filing cases." },
  { icon: <FaUsers />, title: "Public Forums", desc: "Discuss & share legal community posts." },
];

const sampleJudgements = [
  { court: "Supreme Court", summary: "Landmark judgement on digital privacy rights — Apr 2025." },
  { court: "High Court (Delhi)", summary: "Guidelines issued for cybercrime trials — Mar 2025." },
  { court: "Supreme Court", summary: "Fast-track courts expansion order — Feb 2025." },
  { court: "High Court (Karnataka)", summary: "Bail direction in high-profile financial case — Jan 2025." },
  { court: "Supreme Court", summary: "Important public interest litigation ruling — Dec 2024." },
  { court: "High Court of Delhi", summary: "Court directs government to streamline RTI processing and reduce delays." },
  { court: "Bombay High Court", summary: "Bail granted in financial fraud case due to insufficient primary evidence." },
  { court: "Madras High Court", summary: "Illegal lakeside construction declared unlawful and ordered to be demolished." },
  { court: "Kerala High Court", summary: "Eviction dispute settled; possession granted to landlord after six years." },
  { court: "Punjab & Haryana High Court", summary: "Police instructed to ensure whistleblower protection." },
  { court: "Telangana High Court", summary: "Cybercrime cell directed to file monthly reports on increasing cases." },
  { court: "Andhra Pradesh High Court", summary: "Compensation of ₹12 lakh awarded to family of accident victim." },
  { court: "Karnataka High Court", summary: "Municipality asked to improve waste management systems immediately." },
  { court: "Supreme Court", summary: "CBI takes over major bank loan fraud investigation." },
  { court: "Gujarat High Court", summary: "Suspension of school principal revoked; reinstatement ordered." },
  { court: "Rajasthan High Court", summary: "State directed to reassess land acquisition compensation for farmers." },
  { court: "Calcutta High Court", summary: "₹8 lakh compensation granted in medical negligence case." },
  { court: "Orissa High Court", summary: "Unauthorized sand mining banned with immediate effect." },
  { court: "Jharkhand High Court", summary: "Government asked to submit road infrastructure improvement plan." },
  { court: "Allahabad High Court", summary: "Plea to stay university exams rejected due to lack of grounds." },
  { court: "Patna High Court", summary: "Protection order issued in domestic violence case." },
  { court: "Jammu & Kashmir High Court", summary: "Vendor fined ₹3 lakh for service contract violations." },
  { court: "Meghalaya High Court", summary: "Sub-registrar offices instructed to clear property registrations within 14 days." },
  { court: "Supreme Court", summary: "Independent probe initiated into custodial death allegations." },
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((s) => (s + 1) % images.length), 4500);
    return () => clearInterval(t);
  }, []);

  const HomePage = () => (
    <>
      <LandingNavbar />
      {/* HERO / CAROUSEL */}
      <section className="hero-section">
  <div className="carousel-inner" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {images.map((img, idx) => (
            <div className="carousel-item" key={idx}>
              <img className="carousel-img" src={img} alt={`slide-${idx}`} />
              <div className="carousel-caption">
    <h2 className="carousel-brand" aria-label="System name">Judicial Information System</h2>
    <span className="carousel-slide-index" aria-label="Slide number">slide-{idx}</span>
    <h1 className="carousel-headline">{headlines[idx]}</h1>
    <p className="carousel-tagline">Empowering citizens through digital transformation and transparency.</p>
    <a className="btn-cta" href="/signup" aria-label="Get Started">Get Started</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>Our Services</h2>
        <div className="cards">
          {services.map((s, i) => (
            <div className="card" key={i}>
              <div className="card-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="statistics">
        <h2>Our Impact</h2>
        <div className="stats">
          <div className="stat"><h3>25,000+</h3><p>Cases Tracked</p></div>
          <div className="stat"><h3>1,200+</h3><p>Lawyers Registered</p></div>
          <div className="stat"><h3>50+</h3><p>Courts Served</p></div>
          <div className="stat"><h3>10,000+</h3><p>Documents Uploaded</p></div>
        </div>
      </section>

      {/* Recent Judgements */}
      <section className="judgements-section">
        <h2>Recent Judgements & Summaries</h2>
        <div className="judgement-box" role="region" aria-label="Recent judgements">
          {sampleJudgements.map((j, i) => (
            <div className="judgement-item" key={i}>
              <strong>{j.court}:</strong>
              <p>{j.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <h2>Subscribe for Updates</h2>
        <p>Get the latest judgements, announcements and system updates delivered to your inbox.</p>
        <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("Subscribed! (demo)"); }}>
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      {/* Footer inlined here */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-section">
            <h4>About System</h4>
            <p>The Judicial Information System provides a fast and transparent way to access legal services, case updates, and public resources.</p>
          </div>
          {/* Quick Links removed as requested */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="footer-contact-item"><FaEnvelope aria-hidden="true" /><p>support@judicialportal.gov.in</p></div>
            <div className="footer-contact-item"><FaPhone aria-hidden="true" /><p>+91 98765 43210</p></div>
            <div className="footer-contact-item"><FaMapMarkerAlt aria-hidden="true" /><p>Judicial Complex, New Delhi, India</p></div>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <p>Stay connected for latest legal updates</p>
            <div className="social-icons" aria-label="Follow us on social media">
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter / X"><FaTwitter /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="#" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © 2025 Judicial Information System — All Rights Reserved.
        </div>
      </footer>
    </>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/judge" element={<Judge />} />
        <Route path="/lawyer" element={<Lawyer />} />
        <Route path="/police" element={<Police />} />
        <Route path="/user" element={<User />} />
  <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
