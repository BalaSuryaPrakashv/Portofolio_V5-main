import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CardProject from "../components/CardProject";
import Certificate from "../components/Certificate";
import AOS from "aos";
import "aos/dist/aos.css";
import { Code, Award, Briefcase, FileCheck } from "lucide-react";
import focusprismLogo from "../assets/focusprism-logo.jpeg";
import nxtlogicLogo from "../assets/nxtlogic-logo.jpeg";
import nxtlogicCertificate from "../assets/nxtlogic-certificate.jpeg";

const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-slate-300 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-white/5 
      hover:bg-white/10
      rounded-md
      border 
      border-white/10
      hover:border-white/20
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 }, overflow: "visible" }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

// ── Certificate Modal (same style/behavior as components/Certificate.jsx) ────
const CertificateModal = ({ open, onClose, imgSrc }) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="certificate-modal-title"
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 300,
      sx: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(5px)",
      },
    }}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: 0,
      padding: 0,
    }}
  >
    <Box
      sx={{
        position: "relative",
        width: "auto",
        maxWidth: "90vw",
        maxHeight: "90vh",
        m: 0,
        p: 0,
        outline: "none",
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 16,
          top: 16,
          color: "white",
          bgcolor: "rgba(0,0,0,0.6)",
          zIndex: 1,
          padding: 1,
          "&:hover": {
            bgcolor: "rgba(0,0,0,0.8)",
            transform: "scale(1.1)",
          },
        }}
        size="large"
      >
        <CloseIcon sx={{ fontSize: 24 }} />
      </IconButton>

      <img
        src={imgSrc}
        alt="Certificate Full View"
        style={{
          display: "block",
          maxWidth: "100%",
          maxHeight: "90vh",
          margin: "0 auto",
          objectFit: "contain",
        }}
      />
    </Box>
  </Modal>
);

// ── Internship data from CV ──────────────────────────────────────────────────
const internships = [
  {
    id: 2,
    role: "Executive Analyst",
    company: "Focusprism Private Limited",
    logo: focusprismLogo,
    location: "Hyderabad, Telangana, India",
    duration: "July 2026 – Present",
    type: "Full-time",
    bullets: [
      "Working on Clarity ERP and SAP for business data management and operational processes.",
      "Collecting, validating, and analyzing business data to ensure accuracy, completeness, and consistency.",
      "Monitoring data quality, identifying inconsistencies, and resolving data-related issues.",
      "Creating, maintaining, and enhancing dashboards and data visualizations using Excel, Power BI, Clarity ERP, and SAP.",
      "Preparing business reports and performance metrics to support operational decision-making.",
      "Collaborating with cross-functional teams to resolve data discrepancies and improve business workflows.",
    ],
    skills: ["Data Analysis", "Microsoft Excel", "Power BI", "SAP", "Clarity ERP"],
  },
  {
    id: 1,
    role: "Data Analyst Intern",
    company: "Nxtlogic Software Solutions",
    logo: nxtlogicLogo,
    location: "Gandhipuram, Coimbatore",
    duration: "July 2025 – Aug 2025",
    type: "Internship",
    certificateUrl: nxtlogicCertificate,
    bullets: [
      "Cleaned, preprocessed, and analyzed structured datasets to extract actionable business insights for real-world projects.",
      "Built and evaluated ML models (classification & regression), iteratively tuning parameters to improve prediction accuracy.",
      "Automated repetitive data workflows using Python scripts, reducing manual effort and improving team efficiency.",
      "Identified and resolved data quality issues including missing values, duplicates, and inconsistencies to enhance data reliability.",
    ],
    skills: ["Python", "Pandas", "Scikit-learn", "SQL", "EDA", "Data Cleaning", "ML Models", "Automation"],
  },
];


// ── Internship Card Component ────────────────────────────────────────────────
const InternshipCard = ({ internship, index }) => {
  const [certOpen, setCertOpen] = useState(false);

  return (
  <div
    data-aos="fade-up"
    data-aos-duration={800 + index * 200}
    className="relative group w-full"
  >
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-500" />

    <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm hover:border-white/20 transition-all duration-300 overflow-hidden">

      {/* Content */}
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
              {internship.logo ? (
                <img
                  src={internship.logo}
                  alt={`${internship.company} logo`}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">{internship.role}</h3>
              <p className="text-[#a855f7] font-semibold text-sm sm:text-base">{internship.company}</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{internship.location}</p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#6366f1]/20 text-[#a78bfa] border border-[#6366f1]/30">
              {internship.type}
            </span>
            <span className="text-gray-400 text-xs sm:text-sm">{internship.duration}</span>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-[#6366f1]/30 via-white/10 to-transparent mb-5" />

        <ul className="space-y-3 mb-6">
          {internship.bullets.map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex-shrink-0" />
              {point}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Skills Used</p>
            <div className="flex flex-wrap gap-2">
              {internship.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:border-[#6366f1]/50 hover:text-white transition-all duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {internship.certificateUrl && (
            <button
              onClick={() => setCertOpen(true)}
              className="
                flex items-center gap-2
                px-3.5 py-2
                text-sm font-medium
                text-[#a78bfa]
                bg-[#6366f1]/10
                hover:bg-[#6366f1]/20
                border border-[#6366f1]/30
                hover:border-[#6366f1]/50
                rounded-lg
                transition-all duration-200
                flex-shrink-0
              "
            >
              <FileCheck className="w-4 h-4" />
              View Certificate
            </button>
          )}
        </div>
      </div>
    </div>

    {internship.certificateUrl && (
      <CertificateModal
        open={certOpen}
        onClose={() => setCertOpen(false)}
        imgSrc={internship.certificateUrl}
      />
    )}
  </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      setProjects(data || []);
      localStorage.setItem("projects", JSON.stringify(data || []));
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  }, []);

  const fetchCertificates = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("issued_date", { ascending: false });
      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error("Error fetching certificates:", error.message);
    }
  }, []);

  useEffect(() => {
    const cachedProjects = localStorage.getItem("projects");
    if (cachedProjects) setProjects(JSON.parse(cachedProjects));
    fetchProjects();
    fetchCertificates();
  }, [fetchProjects, fetchCertificates]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

  return (
    <div
      className="md:px-[10%] px-[5%] w-full bg-[#030014] pt-4 pb-32"
      id="Portofolio"
    >
      {/* Section heading */}
      <div className="text-center pb-6" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          <span
            style={{
              color: "#6366f1",
              backgroundImage: "linear-gradient(45deg, #6366f1 10%, #a855f7 93%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Work Highlights
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through projects, certifications, and technical expertise.
          Each section represents a milestone in my continuous learning path.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.75rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  transform: "translateY(-2px)",
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(139, 92, 246, 0.2)",
                  "& .lucide": { color: "#a78bfa" },
                },
              },
              "& .MuiTabs-indicator": { height: 0 },
              "& .MuiTabs-flexContainer": { gap: "4px" },
            }}
          >
            <Tab icon={<Code className="mb-1 w-5 h-5 transition-all duration-300" />} label="Projects" {...a11yProps(0)} />
            <Tab icon={<Briefcase className="mb-1 w-5 h-5 transition-all duration-300" />} label="Experience" {...a11yProps(1)} />
            <Tab icon={<Award className="mb-1 w-5 h-5 transition-all duration-300" />} label="Certificates" {...a11yProps(2)} />
          </Tabs>
        </AppBar>

        <style>{`
          .react-swipeable-view-container { overflow: visible !important; }
          .react-swipeable-view-container > div { overflow: visible !important; }
        `}</style>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
          style={{ overflow: "visible" }}
          containerStyle={{ overflow: "visible" }}
          slideStyle={{ overflow: "visible" }}
          disabled={true}
        >
          {/* ── Projects Tab ── */}
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5 items-stretch w-full">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                    className="h-full"
                  >
                    <CardProject
                      Img={project.Img}
                      Title={project.Title}
                      Description={project.Description}
                      Link={project.Link}
                      Demo={project.Demo || project.demo}
                      id={project.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton onClick={() => setShowAllProjects(p => !p)} isShowingMore={showAllProjects} />
              </div>
            )}
          </TabPanel>

          {/* ── Internship Tab ── */}
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto max-w-4xl flex flex-col gap-6 pb-2">
              {internships.map((internship, index) => (
                <InternshipCard key={internship.id} internship={internship} index={index} />
              ))}

              <div className="text-center mt-4" data-aos="fade-up" data-aos-duration="1000">
                <p className="text-gray-500 text-sm italic">
                  Open to new opportunities & collaborations 🚀
                </p>
              </div>
            </div>
          </TabPanel>

          {/* ── Certificates Tab ── */}
          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                {displayedCertificates.map((cert, index) => (
                  <div
                    key={cert.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <Certificate ImgSertif={cert.image_url} />
                    <Box sx={{ mt: 1.5, px: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.9rem", color: "white" }}>
                        {cert.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                        {cert.issuer}{cert.issued_date && ` · ${new Date(cert.issued_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`}
                      </Typography>
                    </Box>
                  </div>
                ))}
              </div>
            </div>
            {certificates.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton onClick={() => setShowAllCertificates(p => !p)} isShowingMore={showAllCertificates} />
              </div>
            )}
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}
