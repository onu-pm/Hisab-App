import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Globe,
  ArrowRight,
  Sparkles,
  Store,
  Building2,
  Users,
  Lock,
  ChevronRight,
  Zap,
  MapPin,
  FileCheck,
  RefreshCw,
  Plus,
  Laptop
} from 'lucide-react';
import { Language, Shop } from '../types';
import { getTranslation, SUPPORTED_LANGUAGES } from '../locales/i18n';
import { DEMO_SHOPS } from '../data/sampleShops';
import { OnboardingFlow } from './OnboardingFlow';

interface LoginScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (shop: Shop) => void;
  initialMode?: 'otp' | 'demo' | 'onboarding';
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  language,
  onLanguageChange,
  onLoginSuccess,
  initialMode = 'otp',
}) => {
  const t = getTranslation(language);

  const [activeMode, setActiveMode] = useState<'otp' | 'demo' | 'onboarding'>(initialMode);
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('9821');
  const [otpStep, setOtpStep] = useState<'enter_phone' | 'enter_otp'>('enter_phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);

  // If in full onboarding mode, render OnboardingFlow directly
  if (activeMode === 'onboarding') {
    return (
      <OnboardingFlow
        language={language}
        onLanguageChange={onLanguageChange}
        onComplete={(shop) => onLoginSuccess(shop)}
        onCancel={() => setActiveMode('otp')}
      />
    );
  }

  // OTP Countdown timer
  useEffect(() => {
    let interval: any;
    if (otpStep === 'enter_otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, timer]);

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError(language === 'hi' ? 'कृपया सही 10 अंकों का मोबाइल नंबर डालें' : 'Please enter valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      setIsLoading(false);
      setOtpStep('enter_otp');
      setTimer(30);
      setOtp(data.demoOtp || '9821');
    } catch (err) {
      setIsLoading(false);
      setOtpStep('enter_otp');
      setTimer(30);
      setOtp('9821');
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, language }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success && data.shop) {
        onLoginSuccess(data.shop);
      } else {
        setError(data.error || (language === 'hi' ? 'गलत OTP, कृपया 9821 डालें' : 'Invalid OTP. Please enter 9821'));
      }
    } catch (err) {
      setIsLoading(false);
      // Demo fallback
      const matched = DEMO_SHOPS.find((s) => s.phone.replace(/\D/g, '').includes(phone.slice(-6))) || DEMO_SHOPS[0];
      onLoginSuccess(matched);
    }
  };

  // Handle 1-Click Demo Login
  const handleDemoShopLogin = async (shop: Shop) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId: shop.id }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success && data.shop) {
        onLoginSuccess(data.shop);
      } else {
        onLoginSuccess(shop);
      }
    } catch (e) {
      setIsLoading(false);
      onLoginSuccess(shop);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
        
        {/* App Branding Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-xs">
              हि
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-slate-900 text-lg tracking-tight">
                  {t.appName}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{t.appTagline}</p>
            </div>
          </div>

          {/* Indian Language Switcher Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <select
              id="auth-lang-dropdown"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeLabel} ({lang.label})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mode Switcher Tabs (OTP Login, Demo Accounts, Onboarding Flow) */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold select-none">
          <button
            id="tab-auth-otp"
            onClick={() => {
              setActiveMode('otp');
              setError('');
            }}
            className={`py-2 px-1 rounded-xl text-center transition cursor-pointer flex items-center justify-center gap-1 ${
              activeMode === 'otp'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="truncate">{language === 'hi' ? 'मोबाइल OTP' : 'Phone OTP'}</span>
          </button>

          <button
            id="tab-auth-demo"
            onClick={() => {
              setActiveMode('demo');
              setError('');
            }}
            className={`py-2 px-1 rounded-xl text-center transition cursor-pointer flex items-center justify-center gap-1 ${
              activeMode === 'demo'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate">{language === 'hi' ? 'डेमो दुकान' : 'Demo Shops'}</span>
          </button>

          <button
            id="tab-auth-onboarding"
            onClick={() => {
              setActiveMode('onboarding');
              setError('');
            }}
            className={`py-2 px-1 rounded-xl text-center transition cursor-pointer flex items-center justify-center gap-1 ${
              activeMode === 'onboarding'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="truncate">{language === 'hi' ? 'ऑनबोर्डिंग' : 'Onboard'}</span>
          </button>
        </div>

        {/* MODE 1: PHONE NUMBER & OTP LOGIN */}
        {activeMode === 'otp' && (
          <div className="space-y-4">
            {otpStep === 'enter_phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">
                    {language === 'hi' ? 'दुकानदार मोबाइल लॉगिन' : 'Shopkeeper Mobile Login'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {language === 'hi'
                      ? 'अपना 10-अंकों का मोबाइल नंबर डालें। पासवर्ड याद रखने का झंझट नहीं।'
                      : 'Enter your 10-digit mobile number. Instant OTP verification.'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'hi' ? 'मोबाइल नंबर (Mobile Number)' : 'Mobile Number'}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-500 font-bold text-sm select-none">
                      🇮🇳 +91
                    </span>
                    <input
                      id="input-login-phone"
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl pl-18 pr-4 py-3 text-slate-900 font-bold text-base tracking-wider focus:outline-none transition"
                      autoFocus
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {language === 'hi'
                      ? 'डेमो के लिए 9876543210 पहले से भरा है'
                      : 'Pre-filled demo number for quick access'}
                  </p>
                </div>

                {error && <p className="text-xs font-bold text-rose-600">{error}</p>}

                <button
                  id="btn-get-otp"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{language === 'hi' ? 'OTP प्राप्त करें' : 'Get OTP'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base">
                      {language === 'hi' ? '4 अंकों का OTP डालें' : 'Enter 4-Digit OTP'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setOtpStep('enter_phone')}
                      className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
                    >
                      {language === 'hi' ? 'नंबर बदलें' : 'Change Phone'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    +91 {phone} {language === 'hi' ? 'पर OTP भेजा गया है' : 'verification code sent'}
                  </p>
                </div>

                {/* OTP Box */}
                <div className="space-y-2">
                  <input
                    id="input-login-otp"
                    type="text"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="9821"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl py-3 text-center text-slate-900 font-black text-2xl tracking-[0.6em] focus:outline-none transition shadow-inner"
                    autoFocus
                  />
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-center text-xs font-bold text-emerald-800">
                    ✨ {language === 'hi' ? 'डेमो OTP भर दिया गया है (9821)' : 'Demo OTP auto-filled (9821)'}
                  </div>
                </div>

                {error && <p className="text-xs font-bold text-rose-600 text-center">{error}</p>}

                <button
                  id="btn-verify-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{language === 'hi' ? 'सत्यापित करें व लॉगिन करें' : 'Verify & Enter Shop'}</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  {timer > 0 ? (
                    <span className="text-xs text-slate-500">
                      {language === 'hi' ? `दोबारा OTP भेजें (${timer}s)` : `Resend OTP in ${timer}s`}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setTimer(30);
                        setOtp('9821');
                      }}
                      className="text-xs text-slate-900 font-bold hover:underline cursor-pointer"
                    >
                      {language === 'hi' ? 'OTP दोबारा भेजें' : 'Resend OTP Now'}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* MODE 2: QUICK DEMO SHOPS SELECTOR */}
        {activeMode === 'demo' && (
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">
                {language === 'hi' ? 'किसी भी डेमो दुकान से तुरंत जुड़ें:' : 'Select a Demo Business Persona:'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'hi'
                  ? 'बिना OTP के सीधे क्लिक करके अलग-अलग रिटेल दुकानों का हिसाब देखें'
                  : 'Click any store to test with realistic catalog, bills, and customers'}
              </p>
            </div>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {DEMO_SHOPS.map((demoShop) => (
                <button
                  key={demoShop.id}
                  onClick={() => handleDemoShopLogin(demoShop)}
                  className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 p-3 rounded-2xl transition flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm shrink-0 shadow-2xs group-hover:bg-slate-900 group-hover:text-white transition">
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {demoShop.name.split('(')[0]}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate">
                        {demoShop.owner_name.split('(')[0]} • {demoShop.city}
                      </p>
                      <span className="inline-block text-[9px] bg-slate-200/80 text-slate-700 font-bold px-1.5 py-0.2 rounded mt-0.5">
                        {demoShop.category.split('(')[0]}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center text-emerald-700 font-bold text-xs gap-0.5">
                    <span>लॉगिन</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MODE 3: START COMPREHENSIVE ONBOARDING (DigiLocker + GST + Business Type) */}
        {activeMode === 'onboarding' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
                <span>{language === 'hi' ? 'भारत सरकार ई-केवाईसी एवं व्यापार ऑनबोर्डिंग' : 'Government e-KYC & Shop Onboarding'}</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                {language === 'hi'
                  ? 'डिजीलॉकर से सुरक्षित पहचान सत्यापन, GSTIN / उद्यम MSME / गुमाश्ता चेकिंग और दुकान की पूरी प्रोफाइल 2 मिनट में बनाएं।'
                  : 'Instant DigiLocker Aadhaar/PAN verification, auto GSTIN validation, Udyam MSME, and customized rules for Freelancers or Retail Shops.'}
              </p>
            </div>

            <button
              id="btn-launch-full-onboarding"
              onClick={() => setActiveMode('onboarding')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <span>{language === 'hi' ? '5-चरणीय ऑनबोर्डिंग शुरू करें' : 'Start 5-Step Onboarding'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Security & Trust Footer Badges */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-[11px] text-slate-600 select-none">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{language === 'hi' ? '100% सुरक्षित बहीखाता • मेड इन भारत' : '100% Secure Khata • Made for Bharat'}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">GST Ready</span>
        </div>

      </div>
    </div>
  );
};
