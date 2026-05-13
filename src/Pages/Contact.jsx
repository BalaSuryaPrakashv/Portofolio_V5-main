import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Comentar from "../components/Commentar";
import SocialLinks from '../components/SocialLinks';  
import AOS from "aos";
import "aos/dist/aos.css";

const ContactPage = () => {
  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  return (
    <div className="px-[5%] sm:px-[5%] lg:px-[10%]">
      <div className="text-center lg:mt-[5%] mt-10 mb-2 sm:px-0 px-[5%]">
        <h2
          data-aos="fade-down"
          data-aos-duration="1000"
          className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
        >
          <span style={{
            color: "#6366f1",
            backgroundImage: "linear-gradient(45deg, #6366f1 10%, #a855f7 93%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Contact Me
          </span>
        </h2>
        <p
          data-aos="fade-up"
          data-aos-duration="1100"
          className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2"
        >
          Have a question? Send me a message, and I'll get back to you right away
        </p>
      </div>

      {/* Comment Box */}
      <div className="h-auto py-10 flex items-center justify-center" id="Contact">
        <div className="container px-[1%] w-full">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-3 py-3 md:p-10 md:py-8 shadow-2xl transform transition-all duration-500 hover:shadow-[#6366f1]/10">
            <Comentar />
          </div>
        </div>
      </div>

    <div id="Connect">
      <SocialLinks />
    </div>

    </div>
  );
};

export default ContactPage;