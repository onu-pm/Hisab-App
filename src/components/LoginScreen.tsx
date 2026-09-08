import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Globe,
  ArrowRight,
  Store,
  ChevronRight,
  Zap,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { Language, Shop, UserProfile } from '../types';
import { getTranslation, SUPPORTED_LANGUAGES } from '../locales/i18n';
import { DEMO_SHOPS } from '../data/sampleShops';
import { OnboardingFlow } from './OnboardingFlow';

interface LoginScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (shop: Shop, user?: UserProfile) => void;
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
      <div className="w-full flex-1 flex flex-col items-center justify-center p-3 sm:p-4">
        <OnboardingFlow
          language={language}
          onLanguageChange={onLanguageChange}
          onComplete={(shop) => onLoginSuccess(shop)}
          onCancel={() => setActiveMode('otp')}
        />
      </div>
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

  // Handle Instant Test Login
  const handleTestLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/test-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success && data.shop) {
        if (data.token) localStorage.setItem('hisab_auth_token', data.token);
        if (data.user?.id) localStorage.setItem('hisab_user_id', data.user.id);
        onLoginSuccess(data.shop, data.user);
      } else {
        setError(language === 'hi' ? 'लॉगिन में त्रुटि हुई, पुनः प्रयास करें' : 'Test login failed. Please retry.');
      }
    } catch (err) {
      setIsLoading(false);
      onLoginSuccess(DEMO_SHOPS[0]);
    }
  };

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
        if (data.token) localStorage.setItem('hisab_auth_token', data.token);
        if (data.user?.id) localStorage.setItem('hisab_user_id', data.user.id);
        onLoginSuccess(data.shop, data.user);
      } else {
        setError(data.error || (language === 'hi' ? 'गलत OTP, कृपया 9821 डालें' : 'Invalid OTP. Please enter 9821'));
      }
    } catch (err) {
      setIsLoading(false);
      const matched = DEMO_SHOPS.find((s) => s.phone.replace(/\D/g, '').includes(phone.slice(-6))) || DEMO_SHOPS[0];
      onLoginSuccess(matched);
    }
  };

  // Handle 1-Click Demo Shop Login
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
    } catch (err) {
      setIsLoading(false);
      onLoginSuccess(shop);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 sm:space-y-5">
        
        {/* App Branding Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-xs shrink-0">
              हि
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight truncate">
                  {t.appName}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{t.appTagline}</p>
            </div>
          </div>

          {/* Indian Language Switcher Dropdown */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl shrink-0">
            <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              id="auth-lang-dropdown"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeLabel}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 🧪 REAL TEST LOGIN CARD FOR USER */}
        <div className="bg-emerald-50/90 border-2 border-emerald-500/30 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                {language === 'hi' ? 'रियल टेस्ट लॉगिन' : 'Real Test Login'}
              </span>
            </div>
            <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
              1-Click Fast Access
            </span>
          </div>

          <div className="space-y-0.5 text-xs text-emerald-900">
            <p className="font-extrabold truncate">thepomonu@gmail.com</p>
            <p className="text-[11px] text-emerald-800 truncate">+91 9876543210 • Ramesh Kumar Gupta</p>
            <p className="text-[10px] text-emerald-700">
              {language === 'hi' ? 'बैकएंड डेटाबेस में सुरक्षित मर्चेंट अकाउंट से सीधा प्रवेश।' : 'Connected with backend database & merchant profile.'}
            </p>
          </div>

          <button
            id="btn-instant-test-login"
            type="button"
            onClick={handleTestLogin}
            disabled={isLoading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current text-yellow-300" />
                <span>{language === 'hi' ? '1-क्लिक टेस्ट लॉगिन करें' : 'Login as Test User'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
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
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
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
            <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{language === 'hi' ? 'दुकानें' : 'Shops'}</span>
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
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{language === 'hi' ? 'ऑनबोर्डिंग' : 'Onboard'}</span>
          </button>
        </div>

        {/* MODE 1: PHONE NUMBER & OTP LOGIN */}
        {activeMode === 'otp' && (
          <div className="space-y-3.5">
            {otpStep === 'enter_phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {language === 'hi' ? 'दुकानदार मोबाइल लॉगिन' : 'Shopkeeper Mobile Login'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-normal">
                    {language === 'hi'
                      ? 'अपना 10-अंकों का मोबाइल नंबर डालें। पासवर्ड याद रखने का झंझट नहीं।'
                      : 'Enter 10-digit mobile number for instant OTP verification.'}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'hi' ? 'मोबाइल नंबर (Mobile Number)' : 'Mobile Number'}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center gap-1 text-slate-500 font-bold text-xs pointer-events-none">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      id="input-login-phone"
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl text-slate-900 font-mono font-bold text-sm focus:outline-none transition"
                      required
                    />
                  </div>
                </div>

                {error && <p className="text-xs font-bold text-rose-600">{error}</p>}

                <button
                  id="btn-send-otp"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{language === 'hi' ? 'OTP प्राप्त करें' : 'Get OTP on Mobile'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
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
                    +91 {phone} {language === 'hi' ? 'पर भेजा गया' : 'code sent'}
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
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl py-2.5 text-center text-slate-900 font-black text-2xl tracking-[0.4em] focus:outline-none transition shadow-inner"
                    autoFocus
                  />
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-center text-xs font-bold text-emerald-800">
                    ✨ {language === 'hi' ? 'परीक्षण OTP: 9821' : 'Test OTP: 9821'}
                  </div>
                </div>

                {error && <p className="text-xs font-bold text-rose-600 text-center">{error}</p>}

                <button
                  id="btn-verify-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
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
                      {language === 'hi' ? `दोबारा OTP (${timer}s)` : `Resend in ${timer}s`}
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
          <div className="space-y-2.5">
            <div className="space-y-0.5">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                {language === 'hi' ? 'डेमो दुकान चुनें:' : 'Select a Business Persona:'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'hi'
                  ? 'बिना OTP के सीधे क्लिक करके अलग-अलग रिटेल दुकानों का हिसाब देखें'
                  : 'Click any store to test with realistic catalog, bills, and customers'}
              </p>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {DEMO_SHOPS.map((demoShop) => (
                <button
                  key={demoShop.id}
                  onClick={() => handleDemoShopLogin(demoShop)}
                  className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 p-2.5 rounded-2xl transition flex items-center justify-between gap-2.5 group cursor-pointer"
                >
                  <div className="min-w-0 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-xs shrink-0 shadow-2xs group-hover:bg-slate-900 group-hover:text-white transition">
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {demoShop.name.split('(')[0]}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate">
                        {demoShop.owner_name.split('(')[0]} • {demoShop.city}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center text-emerald-700 font-bold text-xs">
                    <span>{language === 'hi' ? 'लॉगिन' : 'Enter'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Security & Trust Footer Badges */}
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center justify-between text-[11px] text-slate-600 select-none">
          <div className="flex items-center gap-1.5 min-w-0">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="truncate">{language === 'hi' ? '100% सुरक्षित बहीखाता • मेड इन भारत' : '100% Secure Khata • Made for Bharat'}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">GST Ready</span>
        </div>

      </div>
    </div>
  );
};
