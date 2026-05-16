import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import footerLogoImage from "../assets/images/icons/mediglow_logo.png";
import authBadgeImage from "../assets/images/icons/auth.avif";

function Footer() {
  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate();

  const footerSections = [
    {
      id: "get-started",
      title: "Get Started",
      links: ["Consult", "Products", "Contact"],
    },
    {
      id: "about-us",
      title: "About Us",
      links: ["Who We Are", "FAQs", "Blog"],
    },
    {
      id: "partner-with-us",
      title: "Partner With Us",
      links: [
        "Sell on MediGlow",
        "Doctor Partner",
        "Pharmacy & Retail Partner",
        "UGC Partner Program",
      ],
    },
    {
      id: "legal",
      title: "Legal",
      links: ["Terms of Service", "Privacy Policy", "Shipping & Refunds"],
    },
  ];

  const toggleSection = (id) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <footer className="mt-2 bg-[#18191f] text-white">
      <div className="px-2 lg:px-8">
        {/* Desktop Layout (lg and above) */}
        <div className="hidden lg:block">
          {/* Top row: logos + social icons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-20">
              {/* Logo */}
              <div className="flex items-center h-24 overflow-hidden">
                <img
                  src={footerLogoImage}
                  alt="MediGlow Logo"
                  onClick={() => navigate("/")}
                  className="cursor-pointer 
               h-12 md:h-16 
               w-auto object-contain"
                />
              </div>
              <img
                src={authBadgeImage}
                alt="Authentic"
                className="h-20 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-6 text-white">
              <a href="#" className="transition hover:text-violet-300">
                <FaFacebookF className="h-6 w-7" strokeWidth={2.2} />
              </a>
              <a href="#" className="transition hover:text-violet-300">
                <FaWhatsapp className="h-6 w-7" strokeWidth={2.2} />
              </a>
              <a href="#" className="transition hover:text-violet-300">
                <FaInstagram className="h-6 w-7" strokeWidth={2.2} />
              </a>
              <a href="#" className="transition hover:text-violet-300">
                <FaYoutube className="h-6 w-7" strokeWidth={2.2} />
              </a>
              <a href="#" className="transition hover:text-violet-300">
                <FaLinkedinIn className="h-6 w-7" strokeWidth={2.2} />
              </a>
            </div>
          </div>

          {/* Five columns: four link sections + email subscription */}
          <div className="mt-5 grid grid-cols-5 gap-6">
            {/* Get Started */}
            <div>
              <h4 className="mb-4 text-xl font-semibold text-white">
                Get Started
              </h4>
              <ul className="space-y-3 text-base text-[#aab3d3]">
                <li className="cursor-pointer transition hover:text-white">
                  Consult
                </li>
                <li className="cursor-pointer transition hover:text-white">
                  Products
                </li>
                <li className="cursor-pointer transition hover:text-white">
                  Contact
                </li>
              </ul>
            </div>

            {/* About Us */}
            <div>
              <h4 className="mb-4 text-xl font-semibold text-white">
                About Us
              </h4>
              <ul className="space-y-3 text-base text-[#aab3d3]">
                <li className="cursor-pointer transition hover:text-white">
                  Who We Are
                </li>
                <li className="cursor-pointer transition hover:text-white">
                  FAQs
                </li>
                <li className="cursor-pointer transition hover:text-white">
                  Blog
                </li>
              </ul>
            </div>

            {/* Partner With Us */}
            <div>
              <h4 className="mb-4 text-xl font-semibold text-white">
                Partner With Us
              </h4>
              <ul className="space-y-3 text-base text-[#aab3d3]">
                <li className="cursor-pointer transition hover:text-white">
                  Sell on MediGlow
                </li>
                <li className="cursor-pointer transition hover:text-white">
                  Doctor Partner
                </li>
                <li className="cursor-pointer transition hover:text-white">
                  Pharmacy & Retail Partner
                </li>
                <li className="cursor-pointer transition hover:text-white">
                  UGC Partner Program
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4 text-xl font-semibold text-white">Legal</h4>
              <ul className="space-y-3 text-base text-[#aab3d3]">
                <li className="cursor-pointer transition hover:text-white">
                  Terms of Service
                </li>
                <li className="cursor-pointer transition hover:text-white">
                  Privacy Policy
                </li>
                <li className="cursor-pointer transition hover:text-white">
                  Shipping & Refunds
                </li>
              </ul>
            </div>

            {/* Email Subscription */}
            <div>
              <h4 className="mb-4 text-xl font-semibold leading-tight text-white">
                Our best skin & hair tips straight to your inbox!
              </h4>
              <div className="flex overflow-hidden rounded-xl bg-white">
                <input
                  type="email"
                  placeholder="Your email"
                  className="h-12 w-full bg-white px-3 text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
                />
                <button className="flex w-10 items-center justify-center text-[#207a6e] transition hover:bg-violet-50">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Layout (unchanged) */}
        <div className="lg:hidden px-2">

          {/* Accordion links */}
          <div className="mt-8 space-y-1">
            {footerSections.map((section) => {
              const isOpen = openSection === section.id;

              return (
                <div key={section.id}>
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between py-3 text-left"
                  >
                    <span className="text-[18px] font-semibold text-white sm:text-[22px]">
                      {section.title}
                    </span>
                    <Plus
                      className={`h-5 w-5 text-[#207a6e] transition-transform duration-300 sm:h-6 sm:w-6 ${isOpen ? "rotate-45" : "rotate-0"
                        }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${isOpen
                      ? "grid-rows-[1fr] pb-2 opacity-100"
                      : "grid-rows-[0fr] pb-0 opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="space-y-3 pb-3 text-[15px] text-[#aab3d3] sm:text-[18px]">
                        {section.links.map((link) => (
                          <li
                            key={link}
                            className="cursor-pointer transition hover:text-white"
                          >
                            {link}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subscribe */}
          <div className="mt-3">
            <h4 className="text-[16px] text-center font-semibold leading-snug text-white">
              Our best skin & hair tips straight to your inbox!
            </h4>
          </div>

          {/* Social icons */}
          <div className="mt-5 flex items-center justify-center gap-6 text-white sm:gap-8">
            <a href="#" className="transition hover:text-violet-300">
              <FaFacebookF
                className="h-5 w-5 md:h-8 md:w-8"
                strokeWidth={2.2}
              />
            </a>
            <a href="#" className="transition hover:text-violet-300">
              <FaWhatsapp className="h-5 w-5 md:h-8 md:w-8" strokeWidth={2.2} />
            </a>
            <a href="#" className="transition hover:text-violet-300">
              <FaInstagram
                className="h-5 w-5 md:h-8 md:w-8"
                strokeWidth={2.2}
              />
            </a>
            <a href="#" className="transition hover:text-violet-300">
              <FaYoutube className="h-5 w-5 md:h-8 md:w-8" strokeWidth={2.2} />
            </a>
            <a href="#" className="transition hover:text-violet-300">
              <FaLinkedinIn
                className="h-5 w-5 md:h-8 md:w-8"
                strokeWidth={2.2}
              />
            </a>
          </div>
        </div>

        {/* Bottom text */}
        <div className="mt-3 pt-2 md:mt-4">
          <p className="text-center md:text-start text-md leading-8 text-[#aab3d3] md:text-md md:leading-10">
            © 2026, MediGlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
