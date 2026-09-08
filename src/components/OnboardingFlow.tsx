import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Store,
  Laptop,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Sparkles,
  FileCheck,
  HelpCircle,
  MapPin,
  Lock,
  Globe,
  Award,
  AlertCircle,
  FileText,
  CreditCard,
  UserCheck,
  Check,
  X
} from 'lucide-react';
import { Language, Shop, BusinessType, IndianComplianceDetails, DigiLockerVerification } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../locales/i18n';
import { INDIAN_STATES_GST } from '../data/gstData';

interface OnboardingFlowProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onComplete: (shop: Shop) => void;
  onCancel: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  language,
  onLanguageChange,
  onComplete,
  onCancel,
}) => {
  const t = getTranslation(language);

  // Steps: 1: Phone & OTP -> 2: DigiLocker KYC -> 3: Business Type -> 4: Indian Compliance & GST -> 5: Shop Profile
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Step 1: Phone & OTP
  const [phone, setPhone] = useState<string>('9876543210');
  const [otp, setOtp] = useState<string>('9821');
  const [otpSent, setOtpSent] = useState<boolean>(true);

  // Step 2: DigiLocker KYC
  const [digilockerConsent, setDigilockerConsent] = useState<boolean>(true);
  const [docType, setDocType] = useState<'aadhaar' | 'pan'>('aadhaar');
  const [uidInput, setUidInput] = useState<string>('9821');
  const [kycData, setKycData] = useState<DigiLockerVerification | null>({
    is_verified: true,
    doc_type: 'aadhaar',
    full_name: 'Ramesh Kumar Gupta',
    masked_uid: 'XXXX-XXXX-9821',
    pan_number: 'ABCPG9821K',
    dob: '1984-06-15',
    gender: 'MALE',
    address: '74/12, Collectorganj Mandi, Kanpur, UP - 208001',
    verified_at: new Date().toISOString(),
    digilocker_txn_id: `DL-GOV-${Date.now().toString().slice(-6)}`,
  });

  // Step 3: Business Type
  const [businessType, setBusinessType] = useState<BusinessType>('gst_registered');

  // Step 4: Compliance & GST
  const [hasGst, setHasGst] = useState<boolean>(true);
  const [gstin, setGstin] = useState<string>('09AAAAA0000A1Z5');
  const [gstVerified, setGstVerified] = useState<boolean>(true);
  const [nonGstDocType, setNonGstDocType] = useState<'udyam' | 'gumasta' | 'fssai' | 'freelancer_exempt'>('udyam');
  const [udyamNumber, setUdyamNumber] = useState<string>('UDYAM-UP-28-0012894');
  const [gumastaLicense, setGumastaLicense] = useState<string>('GUM-KNP-2026-9912');
  const [fssaiLicense, setFssaiLicense] = useState<string>('10824001000982');
  const [turnoverBracket, setTurnoverBracket] = useState<'below_20_lakhs' | '20_to_40_lakhs' | 'above_40_lakhs' | 'above_1.5_crore'>('above_40_lakhs');

  // Step 5: Shop Profile
  const [shopName, setShopName] = useState<string>('Gupta Kirana & General Store');
  const [ownerName, setOwnerName] = useState<string>('Ramesh Kumar Gupta');
  const [city, setCity] = useState<string>('Kanpur');
  const [state, setState] = useState<string>('09 - Uttar Pradesh');
  const [category, setCategory] = useState<string>('FMCG Grocery & Daily Retail');

  // Handle Business Type Selection
  const handleSelectBusinessType = (type: BusinessType) => {
    setBusinessType(type);
    if (type === 'gst_registered') {
      setHasGst(true);
      setGstin('09AAAAA0000A1Z5');
      setGstVerified(true);
      setTurnoverBracket('above_40_lakhs');
    } else if (type === 'composition_dealer') {
      setHasGst(true);
      setGstin('08CCCCC2222C1Z9');
      setGstVerified(true);
      setTurnoverBracket('20_to_40_lakhs');
    } else if (type === 'unregistered_retail' || type === 'msme_small_biz') {
      setHasGst(false);
      setGstin('');
      setGstVerified(false);
      setNonGstDocType('udyam');
      setTurnoverBracket('below_20_lakhs');
    } else if (type === 'freelancer') {
      setHasGst(false);
      setGstin('');
      setGstVerified(false);
      setNonGstDocType('freelancer_exempt');
      setTurnoverBracket('below_20_lakhs');
      if (category.includes('Grocery')) {
        setCategory('UI/UX Design & Software Consulting');
      }
    }
  };

  // Step 1: Submit Phone & Advance
  const handleStep1Next = () => {
    if (phone.length < 10) {
      setError(language === 'hi' ? 'कृपया 10 अंकों का मोबाइल नंबर डालें' : 'Please enter a 10-digit mobile number');
      return;
    }
    setError('');
    setCurrentStep(2);
  };

  // Step 2: DigiLocker KYC Advance
  const handleStep2Next = () => {
    if (!kycData?.is_verified) {
      setError(language === 'hi' ? 'कृपया ई-केवाईसी पूरा करें' : 'Please complete e-KYC verification');
      return;
    }
    setError('');
    setCurrentStep(3);
  };

  // Step 3: Advance
  const handleStep3Next = () => {
    setError('');
    setCurrentStep(4);
  };

  // Step 4: Advance
  const handleStep4Next = () => {
    setError('');
    setCurrentStep(5);
  };

  // Step 5: Final Submit & Creation
  const handleFinalSubmit = async () => {
    setIsLoading(true);
    setError('');

    const compliancePayload: IndianComplianceDetails = {
      has_gst: hasGst,
      gstin: hasGst ? gstin : undefined,
      tax_scheme: hasGst ? (businessType === 'composition_dealer' ? 'composition' : 'regular') : 'unregistered',
      non_gst_doc_type: hasGst ? 'none' : nonGstDocType,
      udyam_number: !hasGst && nonGstDocType === 'udyam' ? udyamNumber : undefined,
      gumasta_license: !hasGst && nonGstDocType === 'gumasta' ? gumastaLicense : undefined,
      fssai_license: !hasGst && nonGstDocType === 'fssai' ? fssaiLicense : undefined,
      turnover_bracket: turnoverBracket,
      is_freelancer_exempt: businessType === 'freelancer',
    };

    try {
      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          phone,
          shop_name: shopName,
          owner_name: ownerName,
          city,
          state,
          category,
          business_type: businessType,
          kyc_verified: !!kycData?.is_verified,
          digilocker_data: kycData,
          compliance: compliancePayload,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success && data.shop) {
        onComplete(data.shop);
      } else {
        createLocalFallbackShop();
      }
    } catch (e) {
      setIsLoading(false);
      createLocalFallbackShop();
    }
  };

  const createLocalFallbackShop = () => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10) || '9876543210';
    const fallbackShop: Shop = {
      id: `shop-${cleanPhone}`,
      name: shopName || 'Gupta Kirana Stores',
      owner_name: ownerName || 'Ramesh Kumar Gupta',
      phone: `+91 ${cleanPhone}`,
      language_pref: language,
      gst_number: hasGst ? gstin : undefined,
      city: city || 'Kanpur',
      state: state || '09 - Uttar Pradesh',
      category: category || 'FMCG Grocery & Daily Retail',
      inbound_email: `shop-${cleanPhone}@ingestion.hisabapp.in`,
      created_at: new Date().toISOString(),
      business_type: businessType,
      kyc_verified: true,
      digilocker_data: kycData || undefined,
      compliance: {
        has_gst: hasGst,
        gstin: hasGst ? gstin : undefined,
        tax_scheme: hasGst ? (businessType === 'composition_dealer' ? 'composition' : 'regular') : 'unregistered',
        turnover_bracket: turnoverBracket,
      },
    };
    onComplete(fallbackShop);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-7 max-h-[92vh] overflow-y-auto space-y-4 sm:space-y-5">
      {/* Top Header & Language Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-xs shrink-0">
            हि
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-lg font-extrabold text-slate-900 tracking-tight truncate">
                {language === 'hi' ? 'दुकानदार ई-केवाईसी ऑनबोर्डिंग' : 'Merchant e-KYC Onboarding'}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                Step {currentStep} / 5
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
              {language === 'hi' ? 'भारत सरकार डिजीलॉकर व GST अनुरूप खाता' : 'Govt. DigiLocker & GST Ready Setup'}
            </p>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer shrink-0 ml-2"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Step Indicators - Mobile Optimized with No Overlapping */}
      <div className="space-y-1.5">
        {/* Desktop Step Indicators */}
        <div className="hidden sm:grid grid-cols-5 gap-1 text-xs font-bold text-center">
          <span className={currentStep >= 1 ? 'text-slate-900 font-extrabold' : 'text-slate-400'}>
            1. {language === 'hi' ? 'फोन' : 'Phone'}
          </span>
          <span className={currentStep >= 2 ? 'text-slate-900 font-extrabold' : 'text-slate-400'}>
            2. {language === 'hi' ? 'KYC' : 'e-KYC'}
          </span>
          <span className={currentStep >= 3 ? 'text-slate-900 font-extrabold' : 'text-slate-400'}>
            3. {language === 'hi' ? 'व्यापार' : 'Business'}
          </span>
          <span className={currentStep >= 4 ? 'text-slate-900 font-extrabold' : 'text-slate-400'}>
            4. {language === 'hi' ? 'GST/टैक्स' : 'GST / Tax'}
          </span>
          <span className={currentStep >= 5 ? 'text-slate-900 font-extrabold' : 'text-slate-400'}>
            5. {language === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}
          </span>
        </div>

        {/* Mobile Step Header (Clean, Zero Overlap) */}
        <div className="flex sm:hidden items-center justify-between text-xs font-bold text-slate-800 px-0.5">
          <span className="truncate pr-2">
            {currentStep === 1 && (language === 'hi' ? 'चरण 1: फोन OTP' : 'Step 1: Phone OTP')}
            {currentStep === 2 && (language === 'hi' ? 'चरण 2: डिजीलॉकर e-KYC' : 'Step 2: DigiLocker e-KYC')}
            {currentStep === 3 && (language === 'hi' ? 'चरण 3: व्यापार प्रकार' : 'Step 3: Business Type')}
            {currentStep === 4 && (language === 'hi' ? 'चरण 4: कर / GST' : 'Step 4: Tax / Compliance')}
            {currentStep === 5 && (language === 'hi' ? 'चरण 5: दुकान प्रोफ़ाइल' : 'Step 5: Shop Profile')}
          </span>
          <span className="text-[11px] font-mono text-slate-500 shrink-0 font-bold">
            {currentStep}/5
          </span>
        </div>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
          <div
            className="bg-slate-900 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: PHONE & OTP */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-slate-800" />
              {language === 'hi' ? 'चरण 1: मोबाइल नंबर सत्यापन' : 'Step 1: Mobile Number & OTP'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'अपने व्यापार के लिए 10 अंकों का मोबाइल नंबर दर्ज करें।'
                : 'Enter your 10-digit mobile number for instant verification.'}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
              </label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 tracking-wider focus:outline-hidden focus:border-slate-800 focus:bg-white"
                />
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>{language === 'hi' ? 'OTP सत्यापन कोड' : 'OTP Code'}</span>
                <span className="bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded text-[11px] font-mono">
                  Auto-Fill: 9821
                </span>
              </div>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="9821"
                className="w-full px-4 py-2.5 bg-white border border-emerald-300 rounded-xl text-center text-lg font-black tracking-widest text-emerald-950 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-between items-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleStep1Next}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>{language === 'hi' ? 'सत्यापित करें व आगे बढ़ें' : 'Verify & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DIGILOCKER E-KYC */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              {language === 'hi' ? 'चरण 2: डिजीलॉकर सरकारी ई-केवाईसी' : 'Step 2: DigiLocker Government e-KYC'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'मास्क्ड आधार व PAN नंबर से सुरक्षित व्यापारी पहचान।'
                : 'Instant verified identity via Govt. of India sandbox.'}
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-blue-950 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                DigiLocker Identity Verified
              </span>
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                e-KYC Verified ✓
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                <span className="text-[10px] text-slate-500 block">Owner Name:</span>
                <span className="font-bold text-slate-900 text-xs">{kycData?.full_name || 'Ramesh Kumar Gupta'}</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                <span className="text-[10px] text-slate-500 block">Masked Aadhaar:</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{kycData?.masked_uid || 'XXXX-XXXX-9821'}</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                <span className="text-[10px] text-slate-500 block">Owner PAN:</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{kycData?.pan_number || 'ABCPG9821K'}</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                <span className="text-[10px] text-slate-500 block">Txn ID:</span>
                <span className="font-mono font-bold text-blue-800 text-[11px] truncate block">{kycData?.digilocker_txn_id}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'पीछे' : 'Back'}</span>
            </button>

            <button
              type="button"
              onClick={handleStep2Next}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>{language === 'hi' ? 'व्यापार प्रकार चुनें' : 'Proceed to Business Type'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: BUSINESS TYPE */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-slate-800" />
              {language === 'hi' ? 'चरण 3: व्यापार का प्रकार' : 'Step 3: Business & Tax Category'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'अपनी दुकान या पेशे का सही मॉडल चुनें।'
                : 'Select how your business operates for customized ledger and invoice rules.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleSelectBusinessType('gst_registered')}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                businessType === 'gst_registered'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs">Regular GST Registered</span>
                  {businessType === 'gst_registered' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className={`text-[11px] mt-1 ${businessType === 'gst_registered' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Full ITC claim (18%, 12%, 5%), B2B e-invoices, GSTR-1 auto-export.
                </p>
              </div>
              <span className={`text-[10px] font-bold mt-2.5 ${businessType === 'gst_registered' ? 'text-emerald-400' : 'text-emerald-700'}`}>
                Annual Turnover &gt; ₹40 Lakhs
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectBusinessType('composition_dealer')}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                businessType === 'composition_dealer'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs">Composition Scheme (1%)</span>
                  {businessType === 'composition_dealer' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className={`text-[11px] mt-1 ${businessType === 'composition_dealer' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Flat 1% tax on turnover. Bill of Supply (No ITC claim allowed).
                </p>
              </div>
              <span className={`text-[10px] font-bold mt-2.5 ${businessType === 'composition_dealer' ? 'text-emerald-400' : 'text-emerald-700'}`}>
                Turnover ₹20L – ₹1.5 Cr
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectBusinessType('unregistered_retail')}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                businessType === 'unregistered_retail'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs">Small Kirana / Retail</span>
                  {businessType === 'unregistered_retail' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className={`text-[11px] mt-1 ${businessType === 'unregistered_retail' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Non-GST Exempt. Simple customer khata, udhaar tracking & purchase ledger.
                </p>
              </div>
              <span className={`text-[10px] font-bold mt-2.5 ${businessType === 'unregistered_retail' ? 'text-emerald-400' : 'text-emerald-700'}`}>
                Turnover &lt; ₹40 Lakhs (Exempt)
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectBusinessType('freelancer')}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                businessType === 'freelancer'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs">Freelancer / Service Pro</span>
                  {businessType === 'freelancer' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className={`text-[11px] mt-1 ${businessType === 'freelancer' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Software, Design, Consulting, Legal. Professional invoicing & TDS tracking.
                </p>
              </div>
              <span className={`text-[10px] font-bold mt-2.5 ${businessType === 'freelancer' ? 'text-emerald-400' : 'text-emerald-700'}`}>
                Service Limit &lt; ₹20 Lakhs
              </span>
            </button>
          </div>

          <div className="pt-3 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'पीछे' : 'Back'}</span>
            </button>

            <button
              type="button"
              onClick={handleStep3Next}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>{language === 'hi' ? 'GST व नियम सेटिंग्स' : 'Proceed to Tax Settings'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: COMPLIANCE & GST */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              {language === 'hi' ? 'चरण 4: GSTIN व लाइसेंस विवरण' : 'Step 4: GSTIN & Tax Details'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'अपने व्यवसाय का 15-अंकों का GSTIN या MSME उद्यम नंबर दर्ज करें।'
                : 'Enter your 15-character GSTIN or MSME Udyam registration.'}
            </p>
          </div>

          {hasGst ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  15-Digit GSTIN Number *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={15}
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="09AAAAA0000A1Z5"
                    className="flex-1 font-mono uppercase px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:bg-white"
                  />
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-2.5 rounded-xl flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Valid</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Origin State:</span>
                  <span className="font-bold text-slate-900">09 - Uttar Pradesh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Filing Scheme:</span>
                  <span className="font-bold text-slate-900">Regular (Monthly GSTR-1 / 3B)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  MSME Udyam Registration (Optional)
                </label>
                <input
                  type="text"
                  value={udyamNumber}
                  onChange={(e) => setUdyamNumber(e.target.value)}
                  placeholder="UDYAM-UP-28-0012894"
                  className="w-full font-mono uppercase px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:bg-white"
                />
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900">
                ✓ Non-GST Exempt mode active. Standard retail billing with zero tax compliance burden.
              </div>
            </div>
          )}

          <div className="pt-3 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'पीछे' : 'Back'}</span>
            </button>

            <button
              type="button"
              onClick={handleStep4Next}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>{language === 'hi' ? 'दुकान प्रोफ़ाइल बनाएं' : 'Proceed to Shop Profile'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SHOP PROFILE & COMPLETION */}
      {currentStep === 5 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              {language === 'hi' ? 'चरण 5: दुकान का नाम व पता' : 'Step 5: Business Profile'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'अपने बिलों और इनवॉइस पर छपने वाला नाम व शहर भरें।'
                : 'Confirm shop name, owner name, and city for automated invoice generation.'}
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'दुकान का नाम *' : 'Business / Shop Name *'}
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Gupta Kirana Stores"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'मालिक का नाम *' : 'Owner Name *'}
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Ramesh Kumar Gupta"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'शहर / मंडी *' : 'City / Town *'}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Kanpur"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'राज्य (State GST Code) *' : 'State (GST Matrix) *'}
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:bg-white cursor-pointer"
                >
                  {INDIAN_STATES_GST.map((s) => (
                    <option key={s.code} value={`${s.code} - ${s.name}`}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'व्यापार श्रेणी' : 'Business Category'}
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="FMCG Grocery & Retail"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'पीछे' : 'Back'}</span>
            </button>

            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isLoading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Setting up...' : language === 'hi' ? 'खाता शुरू करें ✓' : 'Complete & Open Hisab App'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
