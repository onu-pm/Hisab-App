import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Globe,
  ArrowRight,
  Sparkles,
  Lock,
  X,
  Store,
  Zap,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { getTranslation } from '../locales/i18n';
import { Language, Shop } from '../types';
import { DEMO_SHOPS } from '../data/sampleShops';

interface PhoneAuthModalProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (shop: Shop) => void;
  onClose?: () => void;
  onLogout?: () => void;
  currentShop?: Shop | null;
  allShops?: Shop[];
  onOpenAddNewShop?: () => void;
}

export const PhoneAuthModal: React.FC<PhoneAuthModalProps> = ({
  language,
  onLanguageChange,
  onLoginSuccess,
  onClose,
  onLogout,
  currentShop,
  allShops = DEMO_SHOPS,
  onOpenAddNewShop,
}) => {
  const t = getTranslation(language);

  const [activeTab, setActiveTab] = useState<'otp' | 'switch_demo'>('otp');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('9821');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError(language === 'hi' ? 'कृपया सही 10 अंकों का मोबाइल नंबर डालें' : 'Please enter valid 10-digit phone number');
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
      setStep('otp');
      setOtp(data.demoOtp || '9821');
    } catch (err) {
      setIsLoading(false);
      setStep('otp');
      setOtp('9821');
    }
  };

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
        setError(data.error || (language === 'hi' ? 'गलत OTP, 9821 डालें' : 'Invalid OTP. Enter 9821'));
      }
    } catch (err) {
      setIsLoading(false);
      const matched = DEMO_SHOPS.find((s) => s.phone.replace(/\D/g, '').includes(phone.slice(-6))) || DEMO_SHOPS[0];
      onLoginSuccess(matched);
    }
  };

  const handleSelectShop = async (shop: Shop) => {
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-xs">
              हि
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">{t.appName}</h2>
              <p className="text-[11px] text-slate-500">{t.appTagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Language Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  language === 'hi'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  language === 'en'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tab switch inside modal */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('otp')}
            className={`py-1.5 rounded-lg text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'otp'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'फोन OTP लॉगिन' : 'Phone OTP'}</span>
          </button>
          <button
            onClick={() => setActiveTab('switch_demo')}
            className={`py-1.5 rounded-lg text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'switch_demo'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'hi' ? 'दुकान बदलें (डेमो)' : 'Switch Shop'}</span>
          </button>
        </div>

        {/* Step Content */}
        {activeTab === 'otp' && (
          <>
            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {language === 'hi' ? 'मोबाइल नंबर द्वारा लॉगिन' : 'Login via Phone Number'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {language === 'hi'
                      ? 'अपना 10-अंकों का मोबाइल नंबर दर्ज करें'
                      : 'Enter your 10-digit registered phone number'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{t.enterMobileNumber}</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400 font-bold text-sm select-none">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl pl-18 pr-4 py-2.5 text-slate-900 font-bold text-sm tracking-wider focus:outline-none transition"
                    />
                  </div>
                </div>

                {error && <p className="text-xs font-bold text-rose-600">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t.getOtp}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm">{t.enterOtp}</h3>
                  <p className="text-xs text-slate-500">
                    +91 {phone} {language === 'hi' ? 'पर OTP भेजा गया है' : 'verification code sent'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <input
                    type="text"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="9821"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl py-2.5 text-center text-slate-900 font-black text-xl tracking-[0.5em] focus:outline-none transition"
                  />
                  <p className="text-[11px] text-emerald-700 font-medium text-center">
                    ✨ {language === 'hi' ? 'डेमो OTP भर दिया गया है (9821)' : 'Demo OTP auto-filled (9821)'}
                  </p>
                </div>

                {error && <p className="text-xs font-bold text-rose-600 text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.verifyAndLogin}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800 py-1 cursor-pointer"
                >
                  ← {language === 'hi' ? 'नंबर बदलें' : 'Change Phone'}
                </button>
              </form>
            )}
          </>
        )}

        {/* Tab 2: Switch Shop */}
        {activeTab === 'switch_demo' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs">
                {language === 'hi' ? 'दुकान चुनें या बदलें:' : 'Select or Switch Business:'}
              </h3>
              {onOpenAddNewShop && (
                <button
                  onClick={() => {
                    if (onClose) onClose();
                    onOpenAddNewShop();
                  }}
                  className="text-xs font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? '+ नई दुकान' : '+ Add Shop'}</span>
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {allShops.map((shopItem) => (
                <button
                  key={shopItem.id}
                  onClick={() => handleSelectShop(shopItem)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between cursor-pointer ${
                    currentShop?.id === shopItem.id
                      ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-bold truncate">{shopItem.name.split('(')[0]}</p>
                    <p className={`text-[10px] truncate ${currentShop?.id === shopItem.id ? 'text-slate-300' : 'text-slate-500'}`}>
                      {shopItem.owner_name} • {shopItem.city}
                    </p>
                  </div>
                  {currentShop?.id === shopItem.id ? (
                    <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded font-bold">
                      {language === 'hi' ? 'सक्रिय' : 'Active'}
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              ))}

              {onOpenAddNewShop && (
                <button
                  onClick={() => {
                    if (onClose) onClose();
                    onOpenAddNewShop();
                  }}
                  className="w-full text-center py-2.5 border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                >
                  <Store className="w-4 h-4" />
                  <span>{language === 'hi' ? '+ नई दुकान या फर्म जोड़ें' : '+ Add New Shop / Business'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Logout Action if logged in */}
        {onLogout && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onLogout}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'लॉगआउट करें' : 'Log Out'}</span>
            </button>
            <div className="text-[10px] text-slate-400">Hisab App Bharat</div>
          </div>
        )}
      </div>
    </div>
  );
};
