import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Star,
  Sparkles,
  Heart,
  HandHeart,
  Annoyed,
  Laugh,
  SmilePlus,
  Crosshair,
  Eye,
  Lightbulb,
} from "lucide-react";
import LoadingScreen from "./LoadingScreen";
import "./App.css";

/** Custom mosque silhouette SVG — not in Lucide */
function MosqueIcon({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Central dome */}
      <path d="M8 14 Q12 6 16 14" />
      {/* Left minaret */}
      <rect x="3" y="10" width="2.5" height="10" rx="0.5" />
      <path d="M3.25 10 Q4.25 7 5.25 10" />
      {/* Right minaret */}
      <rect x="18.5" y="10" width="2.5" height="10" rx="0.5" />
      <path d="M18.75 10 Q19.75 7 20.75 10" />
      {/* Base */}
      <rect x="6" y="14" width="12" height="6" rx="0.5" />
      {/* Door */}
      <path d="M10 20 Q12 16 14 20" />
    </svg>
  );
}

/** Custom crescent-star for Islamic divider */
function CrescentStarIcon({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.2 0 4.24-.72 5.9-1.94C15.68 18.92 14 16.14 14 13c0-4.42 3.58-8 8-8 .55 0 1.09.06 1.61.16C21.84 3.18 17.26 1 12 2z"
        opacity="0.9"
      />
      <path d="M19 4l.72 1.45L21.2 6l-1.48.55L19 8l-.72-1.45L16.8 6l1.48-.55z" />
    </svg>
  );
}

/** Custom sheep icon for floating decor */
function SheepIconSmall({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse
        cx="12"
        cy="13"
        rx="7"
        ry="5"
        fill="currentColor"
        opacity="0.1"
        stroke="currentColor"
      />
      <circle
        cx="8"
        cy="11"
        r="2"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
      />
      <circle
        cx="12"
        cy="10"
        r="2.5"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
      />
      <circle
        cx="16"
        cy="11"
        r="2"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
      />
      <ellipse
        cx="18"
        cy="10"
        rx="2.5"
        ry="2"
        fill="currentColor"
        opacity="0.1"
        stroke="currentColor"
      />
      <circle cx="19" cy="9.5" r="0.5" fill="currentColor" />
      <line x1="9" y1="17" x2="9" y2="21" />
      <line x1="15" y1="17" x2="15" y2="21" />
    </svg>
  );
}

const snarkMessages: { icon: React.ReactNode; text: string }[] = [
  { icon: <Annoyed size={16} />, text: "٤٠٤:ما لقينا قروش" },
  { icon: <SheepIconSmall size={16} />, text: "خطأ ٤٠٤: التبرع ما وصل" },
  { icon: <SmilePlus size={16} />, text: "الرصيد ما بكفي يا زول" },
  { icon: <HandHeart size={16} />, text: "العملية وقفت: دايرة كرم شوية" },
  { icon: <Laugh size={16} />, text: "البوابة قالت: محاولة ظريفة" },
  { icon: <SheepIconSmall size={16} />, text: "٤٠٤: محفظة الخروف فاضية" },
  { icon: <Lightbulb size={16} />, text: "النظام بنصحك تضغط زر التبرع" },
  { icon: <Star size={16} />, text: "الرصيد مختفي، البركة في الطريق" },
  { icon: <Eye size={16} />, text: "تنبيه: عايز تستلم قبل ما تدفع؟" },
  { icon: <Crosshair size={16} />, text: "آخر محاولاتك قربت تخلص" },
];

function App() {
  const [loading, setLoading] = useState(() => {
    return sessionStorage.getItem("hasSeenLoading") !== "true";
  });
  const [snarkIndex, setSnarkIndex] = useState(-1);
  const [nahClickCount, setNahClickCount] = useState(0);
  const [glitchKey, setGlitchKey] = useState(0);
  const [nahStyle, setNahStyle] = useState<React.CSSProperties>({
    left: "50%",
    top: "0",
    transform: "translateX(-50%)",
  });
  const nahWrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLoadingComplete = useCallback(() => {
    sessionStorage.setItem("hasSeenLoading", "true");
    setLoading(false);
  }, []);

  const handleNahInteraction = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const wrapper = nahWrapperRef.current;
      if (!wrapper) return;

      const nextCount = nahClickCount + 1;
      setNahClickCount(nextCount);
      setGlitchKey((prev) => prev + 1);

      const randomX = Math.round(Math.random() * 330 - 110);
      const randomY = Math.round(Math.random() * 110 - 50);

      setNahStyle({
        left: `calc(50% + ${randomX}px)`,
        top: `${randomY}px`,
        transform: "translateX(-50%)",
      });

      setSnarkIndex((prev) => {
        let next = Math.floor(Math.random() * snarkMessages.length);
        while (next === prev && snarkMessages.length > 1) {
          next = Math.floor(Math.random() * snarkMessages.length);
        }
        return next;
      });

      if (nextCount >= 5) {
        window.setTimeout(() => navigate("/donate"), 450);
      }
    },
    [nahClickCount, navigate],
  );

  // Reset nah button position if user resizes
  useEffect(() => {
    const handleResize = () => {
      setNahStyle({
        left: "50%",
        top: "0",
        transform: "translateX(-50%)",
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="greeting-page">
      {/* Background */}
      <div className="hero-backdrop">
        <img src="/eid_hero_bg.png" alt="" />
      </div>

      {/* Floating decorations — Lucide icons */}
      <div className="floating-decor">
        <span>
          <Moon size={20} />
        </span>
        <span>
          <Star size={14} />
        </span>
        <span>
          <SheepIconSmall size={20} />
        </span>
        <span>
          <MosqueIcon size={18} />
        </span>
        <span>
          <Sparkles size={14} />
        </span>
      </div>

      {/* Main content */}
      <main className="greeting-content">
        {/* Mosque header */}
        <div className="mosque-header">
          <img src="/mosque_silhouette.png" alt="مسجد" />
        </div>

        {/* Sheep */}
        <div className="sheep-illustration">
          <img src="/eid_sheep.png" alt="خروف العيد" />
        </div>

        {/* Greeting */}
        <h1 className="greeting-title">
          عيد أضحى مبارك
          <Star className="title-icon" size={28} fill="currentColor" />
        </h1>

        <p className="greeting-verse">
          ﴿ لَن تَنَالُوا الْبِرَّ حَتَّىٰ تُنفِقُوا مِمَّا تُحِبُّونَ ﴾
        </p>

        <p className="greeting-message">
          هذا الموقع مقدم لكم من الأمانة الماليه.
          <br />
          كل عام وأنتم بخير بمناسبة عيد الأضحى المبارك. أعاده الله عليكم وعلى
          الأمة الإسلامية بالخير واليمن والبركات. نسأل الله أن يتقبل منا ومنكم
          صالح الأعمال.
        </p>

        {/* Divider — custom crescent-star SVG */}
        <div className="divider">
          <span className="divider-line" />
          <span className="divider-icon">
            <CrescentStarIcon size={24} />
          </span>
          <span className="divider-line" />
        </div>

        {/* Donation section */}
        <section className="donation-section" id="donate-section">
          <h2 className="donation-heading">
            <HandHeart size={22} className="heading-icon" />
            ساهم في فرحة العيد
          </h2>
          <p className="donation-subtext">
            تبرعك يساعد في إدخال الفرحة على قلوب المحتاجين
          </p>

          <div className="btn-group">
            {/* Real donate button */}
            <button
              type="button"
              className="btn-donate"
              id="btn-donate-now"
              onClick={() => navigate("/donate")}
            >
              <Heart
                size={20}
                className="btn-donate-icon"
                fill="currentColor"
              />
              تبرع الآن
            </button>

            {/* Trickster button */}
            <div className="btn-nah-wrapper" ref={nahWrapperRef}>
              <button
                key={glitchKey}
                type="button"
                className={`btn-nah${glitchKey > 0 ? " btn-nah--glitch" : ""}`}
                id="btn-no-donate"
                style={nahStyle}
                onClick={handleNahInteraction}
              >
                أستلم تبرع
                <HandHeart size={16} />
              </button>
            </div>
          </div>

          {/* Snark message */}
          {snarkIndex >= 0 && (
            <p className="snark-message" key={snarkIndex}>
              <span className="snark-icon">
                {snarkMessages[snarkIndex].icon}
              </span>
              {snarkMessages[snarkIndex].text}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
