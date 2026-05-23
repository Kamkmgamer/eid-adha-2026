import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  HandHeart,
  Copy,
  Check,
  Smartphone,
  ListOrdered,
  CircleCheck,
} from "lucide-react";
import "./DonatePage.css";

interface Account {
  label: string;
  number: string;
  name: string;
}

interface PaymentMethod {
  id: string;
  title: string;
  titleAr: string;
  logoSrc: string;
  accounts: Account[];
  appUrl: string;
  instructions: string[];
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "bankak",
    title: "Bankak",
    titleAr: "بنكك",
    logoSrc: "/بنكك.png",
    accounts: [
      {
        label: "رقم الحساب",
        number: "1554770",
        name: "عفاف محمد عباس موسى",
      },
    ],
    appUrl: "bankak://",
    instructions: [
      "انسخ رقم الحساب أعلاه",
      "افتح تطبيق بنكك",
      'اختر "تحويل" من القائمة الرئيسية',
      "الصق رقم الحساب وأدخل المبلغ",
      "أكد التحويل",
    ],
  },
  {
    id: "fawry",
    title: "Fawry",
    titleAr: "فوري",
    logoSrc: "/فوري.png",
    accounts: [
      {
        label: "رقم الحساب",
        number: "51845741",
        name: "نون احمد محمد",
      },
    ],
    appUrl: "fawry://",
    instructions: [
      "انسخ رقم الحساب أعلاه",
      "افتح تطبيق فوري",
      'اختر "تحويل إلى حساب"',
      "الصق رقم الحساب وحدد المبلغ",
      "أكد عملية التحويل",
    ],
  },
];

function DonatePage() {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [toastExiting, setToastExiting] = useState(false);

  const showToast = useCallback((message: string) => {
    setToastExiting(false);
    setToast(message);
  }, []);

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast("تم نسخ رقم الحساب");
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedId(id);
      showToast("تم نسخ رقم الحساب");
      setTimeout(() => setCopiedId(null), 2500);
    }
  }, [showToast]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToastExiting(true);
      setTimeout(() => {
        setToast(null);
        setToastExiting(false);
      }, 300);
    }, 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="donate-page">
      {/* Header */}
      <header className="donate-header">
        <button
          type="button"
          className="donate-back"
          onClick={() => navigate("/")}
        >
          <ArrowRight size={16} />
          رجوع
        </button>

        <div className="donate-header-icon">
          <HandHeart size={40} strokeWidth={1.5} />
        </div>
        <h1>طرق التبرع</h1>
        <p>انسخ رقم الحساب ثم افتح التطبيق لإتمام التحويل</p>
        <div className="shares-info">
          <p>
            <strong>قيمة السهم: 1000 جنيه</strong><br />
            (السهمين بـ 2000 جنيه، وهكذا...)
          </p>
        </div>
      </header>

      {/* Payment methods */}
      <div className="payment-methods">
        {paymentMethods.map((method) => (
          <article key={method.id} className="payment-card">
            {/* Card header — real logo images */}
            <div className="payment-card-header">
              <div className="payment-logo">
                <img
                  src={method.logoSrc}
                  alt={`${method.titleAr} logo`}
                  className="payment-logo-img"
                />
              </div>
              <div>
                <div className="payment-card-title">{method.titleAr}</div>
                <div className="payment-card-subtitle">{method.title}</div>
              </div>
            </div>

            {/* Accounts */}
            {method.accounts.map((account, idx) => {
              const accountId = `${method.id}-${idx}`;
              const isCopied = copiedId === accountId;
              return (
                <div key={accountId} className="account-row">
                  <div className="account-info">
                    <span className="account-label">{account.label}</span>
                    <span className="account-number">{account.number}</span>
                    <span className="account-name">{account.name}</span>
                  </div>
                  <button
                    type="button"
                    className={`btn-copy${isCopied ? " copied" : ""}`}
                    onClick={() => copyToClipboard(account.number, accountId)}
                  >
                    {isCopied ? (
                      <>
                        <Check size={14} />
                        تم
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        نسخ
                      </>
                    )}
                  </button>
                </div>
              );
            })}

            {/* App links */}
            <div className="app-store-links">
              <a
                href={method.appUrl}
                className="app-store-link"
                aria-label={`افتح تطبيق ${method.titleAr}`}
              >
                <Smartphone size={14} />
                فتح تطبيق {method.titleAr}
              </a>
            </div>

            {/* Instructions */}
            <div className="instructions-note">
              <h3>
                <ListOrdered size={16} />
                طريقة التحويل
              </h3>
              <ol>
                {method.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </article>
        ))}
      </div>

      {/* Footer */}
      <footer className="donate-footer">
        <p className="donate-dua">جزاكم الله خيراً وبارك الله فيكم</p>
        <p className="donate-footer-sub">
          <HandHeart size={14} className="footer-icon" />
          تقبل الله منا ومنكم صالح الأعمال
        </p>
      </footer>

      {/* Toast */}
      {toast && (
        <div className={`toast${toastExiting ? " toast-exit" : ""}`}>
          <CircleCheck size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}

export default DonatePage;
