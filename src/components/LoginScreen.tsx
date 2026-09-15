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
  UserPlus,
  LogIn,
  Building2,
  MapPin,
  FileCheck,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { Language, Shop, UserProfile, BusinessType } from '../types';
import { getTranslation, SUPPORTED_LANGUAGES } from '../locales/i18n';
import { DEMO_SHOPS } from '../data/sampleShops';
import { INDIAN_STATES_GST } from '../data/gstData';
import { OnboardingFlow } from './OnboardingFlow';

interface LoginScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (shop: Shop, user?: UserProfile) => void;
  initialMode?: 'signin' | 'signup' | 'demo' | 'onboarding';
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  language,
  onLanguageChange,
  onLoginSuccess,
  initialMode = 'signin',
}) => {
  const t = getTranslation(language);

  // Core Authentication Mode: 'signin' | 'signup' | 'demo' | 'onboarding'
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'demo' | 'onboarding'>(initialMode);

  // Sign In State (Mobile + OTP)
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('9821');
  const [otpStep, setOtpStep] = useState<'enter_phone' | 'enter_otp'>('enter_phone');
  const [timer, setTimer] = useState(30);

  // Sign Up State (New Merchant Registration)
  const [signupForm, setSignupForm] = useState({
    ownerName: '',
    phone: '',
    email: '',
    shopName: '',
    state: '07 - Delhi',
    city: '',
    gstNumber: '',
    businessType: 'composite_scheme' as BusinessType,
    category: 'Retail & Daily Needs',
    acceptTerms: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // OTP Countdown timer
  useEffect(() => {
    let interval: any;
    if (otpStep === 'enter_otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, timer]);

  // If in full onboarding mode, render OnboardingFlow directly
  if (activeTab === 'onboarding') {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-3 sm:p-4">
        <OnboardingFlow
          language={language}
          onLanguageChange={onLanguageChange}
          onComplete={(shop) => onLoginSuccess(shop)}
          onCancel={() => setActiveTab('signin')}
        />
      </div>
    );
  }

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

  // Handle Send OTP for Sign In
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

      if (res.ok) {
        setOtp(data.demoOtp || '9821');
        setOtpStep('enter_otp');
        setTimer(30);
      } else {
        setError(data.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      setOtp('9821');
      setOtpStep('enter_otp');
      setTimer(30);
    }
  };

  // Handle Verify OTP for Sign In
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError(language === 'hi' ? 'कृपया 4 अंकों का OTP डालें' : 'Please enter 4-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          otp,
          language,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (res.ok && data.success && data.shop) {
        if (data.token) localStorage.setItem('hisab_auth_token', data.token);
        if (data.user?.id) localStorage.setItem('hisab_user_id', data.user.id);
        onLoginSuccess(data.shop, data.user);
      } else {
        setError(data.error || 'Invalid OTP. Please enter 9821.');
      }
    } catch (err) {
      setIsLoading(false);
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const matched = DEMO_SHOPS.find((s) => s.phone.replace(/\D/g, '').slice(-10) === cleanPhone) || DEMO_SHOPS[0];
      onLoginSuccess(matched);
    }
  };

  // Handle New Merchant Sign Up
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.ownerName.trim()) {
      setError('Please enter merchant / owner full name');
      return;
    }
    const cleanPhone = signupForm.phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    if (!signupForm.acceptTerms) {
      setError('Please accept Terms of Service & GST compliance rules');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupForm.ownerName.trim(),
          phone: cleanPhone,
          email: signupForm.email.trim(),
          shopName: signupForm.shopName.trim() || `${signupForm.ownerName.trim()}'s Business`,
          state: signupForm.state,
          city: signupForm.city.trim() || 'New Delhi',
          gstNumber: signupForm.gstNumber.trim().toUpperCase(),
          businessType: signupForm.businessType,
          category: signupForm.category,
          language,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (res.ok && data.success && data.shop) {
        setSuccessMsg('Account created successfully! Redirecting...');
        if (data.token) localStorage.setItem('hisab_auth_token', data.token);
        if (data.user?.id) localStorage.setItem('hisab_user_id', data.user.id);
        setTimeout(() => {
          onLoginSuccess(data.shop, data.user);
        }, 300);
      } else {
        setError(data.error || 'Registration failed. Please check details and try again.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Network connection error. Please try again.');
    }
  };

  // Handle Demo Shop 1-Click Login
  const handleDemoShopLogin = (demoShop: Shop) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(demoShop);
    }, 200);
  };

  // Popular languages for quick-access buttons
  const POPULAR_LANGS: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'hinglish', label: 'Hinglish' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'mr', label: 'मराठी' },
  ];

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-3 sm:p-5 selection:bg-slate-900 selection:text-white">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
        
        {/* TOP BRANDING & PRIMARY LANGUAGE SELECTOR */}
        <div className="border-b border-slate-100 pb-3 space-y-2.5">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-xs shrink-0">
                हि
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight truncate">
                    {t.appName || 'Hisab App'}
                  </h1>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded shrink-0">
                    GST Ready
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                  {t.appTagline || 'Auto-Invoice Capture, Customer Khata & GST'}
                </p>
              </div>
            </div>

            {/* Language Dropdown Selector */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl shrink-0">
              <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <select
                id="auth-lang-dropdown"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
                title="Select preferred language (English first)"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.code === 'en' ? 'English (Default)' : `${lang.nativeLabel} (${lang.code.toUpperCase()})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Language Switcher Bar: English First, then Indian Languages */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar select-none">
            <span className="text-[10px] font-bold text-slate-400 pl-1 pr-1 shrink-0 uppercase tracking-wider">
              Language:
            </span>
            {POPULAR_LANGS.map((pl) => {
              const isSelected = language === pl.code;
              return (
                <button
                  key={pl.code}
                  type="button"
                  onClick={() => onLanguageChange(pl.code)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  {pl.label}
                  {pl.code === 'en' && <span className="ml-1 text-[9px] opacity-75 font-normal">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* PRIMARY AUTH SEGMENTED CONTROL: SIGN IN vs SIGN UP */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold select-none">
          <button
            id="tab-auth-signin"
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setError('');
              setSuccessMsg('');
            }}
            className={`py-2.5 px-2 rounded-xl text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'signin'
                ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t.signIn || 'Sign In'}</span>
          </button>

          <button
            id="tab-auth-signup"
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setError('');
              setSuccessMsg('');
            }}
            className={`py-2.5 px-2 rounded-xl text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'signup'
                ? 'bg-white text-emerald-900 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.signUp || 'Sign Up (New Shop)'}</span>
          </button>
        </div>

        {/* ERROR / SUCCESS ALERTS */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700">
            ⚠️ {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 1: SIGN IN (EXISTING MERCHANT LOGIN) */}
        {/* ========================================================= */}
        {activeTab === 'signin' && (
          <div className="space-y-4">
            {/* 1-CLICK TEST LOGIN CARD */}
            <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-[11px] font-black text-emerald-950 uppercase tracking-wider">
                    Quick Test Account
                  </span>
                </div>
                <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                  1-Click Access
                </span>
              </div>

              <div className="text-xs text-emerald-900 space-y-0.5">
                <p className="font-extrabold truncate">thepomonu@gmail.com</p>
                <p className="text-[11px] text-emerald-800 truncate">Ramesh Kumar Gupta • M/s Gupta Kirana Store</p>
                <p className="text-[10px] text-emerald-700">
                  Pre-configured with realistic invoices, customer khata, and GST reports.
                </p>
              </div>

              <button
                id="btn-quick-test-login"
                type="button"
                onClick={handleTestLogin}
                disabled={isLoading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
                    <span>Sign In as Test User</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* MOBILE OTP LOGIN FORM */}
            {otpStep === 'enter_phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {t.phoneLoginTitle || 'Sign in with Mobile Number'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {t.phoneLoginDesc || 'Enter 10-digit mobile number. We will send a 4-digit code.'}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {t.enterMobileNumber || 'Mobile Number'}
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
                      className="w-full pl-16 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl text-slate-900 font-mono font-bold text-sm focus:outline-none transition"
                      required
                    />
                  </div>
                </div>

                <button
                  id="btn-send-otp"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{t.getOtp || 'Get OTP on Mobile'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {t.enterOtp || 'Enter 4-Digit OTP'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setOtpStep('enter_phone')}
                      className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
                    >
                      Change Number
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Code sent to +91 {phone}
                  </p>
                </div>

                {/* OTP Box */}
                <div className="space-y-1.5">
                  <input
                    id="input-login-otp"
                    type="text"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="9821"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl py-2 text-center text-slate-900 font-black text-xl tracking-[0.4em] focus:outline-none transition shadow-inner"
                    autoFocus
                  />
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-1.5 text-center text-xs font-bold text-emerald-800">
                    ✨ Test verification code: <span className="underline font-mono font-black">9821</span>
                  </div>
                </div>

                <button
                  id="btn-verify-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.verifyAndLogin || 'Verify & Continue'}</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  {timer > 0 ? (
                    <span className="text-xs text-slate-400">
                      Resend OTP in {timer}s
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
                      {t.resendOtp || 'Resend OTP Now'}
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* Quick Demo Business Switcher Link */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('demo')}
                className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Store className="w-3.5 h-3.5 text-emerald-700" />
                <span>Explore Demo Kirana / Retail Shops</span>
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className="text-emerald-700 hover:text-emerald-800 font-extrabold cursor-pointer"
              >
                Sign Up Free →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: SIGN UP (NEW MERCHANT & SHOP REGISTRATION) */}
        {/* ========================================================= */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3">
            <div className="space-y-0.5">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                {t.createAccount || 'Create Merchant Account'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Register your business for digital khata, GST invoicing, and AI bill capture.
              </p>
            </div>

            {/* Merchant Name & Phone (Side-by-side or stacked on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">
                  {t.ownerName || 'Merchant / Owner Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={signupForm.ownerName}
                  onChange={(e) => setSignupForm({ ...signupForm, ownerName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl text-slate-900 text-xs font-bold focus:outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">
                  {t.enterMobileNumber || 'Mobile Number (+91)'} *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-slate-500 font-bold text-xs pointer-events-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="9876543210"
                    className="w-full pl-11 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl text-slate-900 font-mono text-xs font-bold focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Business / Shop Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">
                {t.businessName || 'Business / Shop Name'} *
              </label>
              <input
                type="text"
                required
                value={signupForm.shopName}
                onChange={(e) => setSignupForm({ ...signupForm, shopName: e.target.value })}
                placeholder="e.g. Gupta Kirana & General Store"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl text-slate-900 text-xs font-bold focus:outline-none transition"
              />
            </div>

            {/* State & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">
                  {t.selectState || 'State / Place of Supply'} *
                </label>
                <select
                  value={signupForm.state}
                  onChange={(e) => setSignupForm({ ...signupForm, state: e.target.value })}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl text-slate-900 text-xs font-bold focus:outline-none transition cursor-pointer"
                >
                  {INDIAN_STATES_GST.map((s) => (
                    <option key={s.code} value={`${s.code} - ${s.name}`}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">
                  City / Town *
                </label>
                <input
                  type="text"
                  required
                  value={signupForm.city}
                  onChange={(e) => setSignupForm({ ...signupForm, city: e.target.value })}
                  placeholder="e.g. Kanpur, New Delhi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl text-slate-900 text-xs font-bold focus:outline-none transition"
                />
              </div>
            </div>

            {/* Business Type / Tax Scheme */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">
                {t.businessType || 'GST / Tax Scheme'}
              </label>
              <select
                value={signupForm.businessType}
                onChange={(e) => setSignupForm({ ...signupForm, businessType: e.target.value as BusinessType })}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl text-slate-900 text-xs font-bold focus:outline-none transition cursor-pointer"
              >
                <option value="composite_scheme">Composition Scheme (1% Flat Tax)</option>
                <option value="gst_registered">Regular GST Registered (ITC Eligible)</option>
                <option value="unregistered_retail">Small Kirana / Exempt (&lt; ₹40 Lakhs turnover)</option>
                <option value="freelancer_professional">Service Provider / Freelancer</option>
              </select>
            </div>

            {/* Optional GSTIN & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">
                  GSTIN (Optional)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={signupForm.gstNumber}
                  onChange={(e) => setSignupForm({ ...signupForm, gstNumber: e.target.value.toUpperCase() })}
                  placeholder="09AAAAA0000A1Z5"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl text-slate-900 font-mono text-xs font-bold uppercase focus:outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">
                  {t.emailAddress || 'Email (Optional)'}
                </label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  placeholder="owner@mybusiness.in"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl text-slate-900 text-xs focus:outline-none transition"
                />
              </div>
            </div>

            {/* Terms & Agreement */}
            <label className="flex items-start gap-2 pt-1 text-[11px] text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={signupForm.acceptTerms}
                onChange={(e) => setSignupForm({ ...signupForm, acceptTerms: e.target.checked })}
                className="mt-0.5 rounded text-emerald-700 focus:ring-0 cursor-pointer"
              />
              <span>
                I agree to the Terms of Service, Indian GST compliance rules, and digital book-keeping guidelines.
              </span>
            </label>

            {/* Submit Button */}
            <button
              id="btn-submit-signup"
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-extrabold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Start Managing Books</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Launch Full 5-Step e-KYC Onboarding Option */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('onboarding')}
                className="text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Launch 5-Step e-KYC Onboarding</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className="text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
              >
                {t.alreadyHaveAccount || 'Sign In'} →
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: DEMO SHOPS SELECTOR */}
        {/* ========================================================= */}
        {activeTab === 'demo' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                Select Pre-Configured Store:
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {DEMO_SHOPS.map((demoShop) => (
                <button
                  key={demoShop.id}
                  onClick={() => handleDemoShopLogin(demoShop)}
                  className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 p-2.5 rounded-2xl transition flex items-center justify-between gap-2 group cursor-pointer"
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
                        {demoShop.owner_name} • {demoShop.city}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center text-emerald-700 font-bold text-xs">
                    <span>Enter</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TRUST & SECURITY BADGES */}
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center justify-between text-[11px] text-slate-600 select-none">
          <div className="flex items-center gap-1.5 min-w-0">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="truncate">100% Encrypted & Safe • Made for Indian Merchants</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">v2.0</span>
        </div>

      </div>
    </div>
  );
};
