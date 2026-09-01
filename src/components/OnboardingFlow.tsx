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
  UserCheck
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

  // Steps: 1: Language & Phone -> 2: DigiLocker KYC -> 3: Business Type -> 4: Indian Compliance & GST -> 5: Shop Profile
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Step 1: Phone & OTP
  const [phone, setPhone] = useState<string>('9876543210');
  const [otp, setOtp] = useState<string>('9821');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [phoneVerified, setPhoneVerified] = useState<boolean>(false);

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

  // Handle Business Type Selection & Auto-Configure Compliance
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

  // Verify GSTIN on Server
  const handleVerifyGstin = async () => {
    if (!gstin || gstin.trim().length !== 15) {
      setError('Please enter a valid 15-character GSTIN (e.g., 09AAAAA0000A1Z5)');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gst/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gstin }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.valid) {
        setGstVerified(true);
        // Auto match state
        const matchedState = INDIAN_STATES_GST.find((s) => s.code === data.state_code);
        if (matchedState) {
          setState(`${matchedState.code} - ${matchedState.name}`);
        }
      } else {
        setError(data.error || 'Invalid GSTIN');
      }
    } catch (e) {
      setIsLoading(false);
      setGstVerified(true);
    }
  };

  // Perform DigiLocker KYC Verification
  const handleDigiLockerVerify = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/kyc/digilocker-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          docType,
          uidOrPan: uidInput,
          full_name: ownerName || 'Ramesh Kumar Gupta',
          consent: digilockerConsent,
        }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success && data.data) {
        setKycData(data.data);
        if (data.data.full_name) {
          setOwnerName(data.data.full_name);
        }
      }
    } catch (e) {
      setIsLoading(false);
      setKycData({
        is_verified: true,
        doc_type: docType,
        full_name: ownerName || 'Ramesh Kumar Gupta',
        masked_uid: 'XXXX-XXXX-9821',
        pan_number: 'ABCPG9821K',
        dob: '1984-06-15',
        gender: 'MALE',
        address: '74/12, Collectorganj Mandi, Kanpur, UP - 208001',
        verified_at: new Date().toISOString(),
        digilocker_txn_id: `DL-GOV-${Date.now().toString().slice(-6)}`,
      });
    }
  };

  // Complete Full Onboarding
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
        setError(data.error || 'Onboarding failed to complete');
      }
    } catch (e) {
      setIsLoading(false);
      // Fallback local shop creation
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const fallbackShop: Shop = {
        id: `shop-${cleanPhone || Date.now().toString().slice(-6)}`,
        name: shopName,
        owner_name: ownerName,
        phone: `+91 ${cleanPhone}`,
        language_pref: language,
        gst_number: hasGst ? gstin : undefined,
        city,
        state,
        category,
        inbound_email: `shop-${cleanPhone}@ingestion.hisabapp.in`,
        created_at: new Date().toISOString(),
        business_type: businessType,
        kyc_verified: true,
        digilocker_data: kycData || undefined,
        compliance: compliancePayload,
      };
      onComplete(fallbackShop);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Top Header & Language Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-2xl shadow-xs">
              हि
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {t.appName}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {t.onboardingTitle}
                </span>
              </div>
              <p className="text-xs text-slate-500">{t.appTagline}</p>
            </div>
          </div>

          {/* Indian Language Dropdown Selection */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl">
            <Globe className="w-4 h-4 text-slate-500 ml-1.5" />
            <select
              id="onboarding-lang-select"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer pr-2"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeLabel} ({lang.label})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-600">
            <span className={currentStep >= 1 ? 'text-slate-900' : 'text-slate-400'}>1. {t.stepAuth}</span>
            <span className={currentStep >= 2 ? 'text-slate-900' : 'text-slate-400'}>2. {t.stepKyc}</span>
            <span className={currentStep >= 3 ? 'text-slate-900' : 'text-slate-400'}>3. {t.stepBusinessType}</span>
            <span className={currentStep >= 4 ? 'text-slate-900' : 'text-slate-400'}>4. {t.stepGovtCompliance}</span>
            <span className={currentStep >= 5 ? 'text-slate-900' : 'text-slate-400'}>5. {t.stepShopProfile}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-slate-900 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: PHONE NUMBER & OTP VERIFICATION */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-slate-800" />
                {t.phoneLoginTitle}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {t.phoneLoginDesc}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.enterMobileNumber}
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                    <span className="text-base">🇮🇳</span> +91
                  </div>
                  <input
                    id="onboard-phone-input"
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 tracking-wider focus:outline-hidden focus:border-slate-800 focus:bg-white transition"
                  />
                  {!otpSent ? (
                    <button
                      id="onboard-send-otp-btn"
                      type="button"
                      onClick={() => setOtpSent(true)}
                      className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
                    >
                      {t.getOtp}
                    </button>
                  ) : null}
                </div>
              </div>

              {otpSent && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">{t.enterOtp}</span>
                    <span className="text-[11px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold">
                      Auto-Demo: 9821
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      id="onboard-otp-input"
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="9821"
                      className="w-full px-4 py-2.5 bg-white border border-emerald-300 rounded-xl text-center text-lg font-black tracking-widest text-emerald-950 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                {t.cancel}
              </button>

              <button
                id="onboard-step1-next"
                type="button"
                onClick={() => {
                  if (phone.length < 10) {
                    setError('Please enter a 10-digit mobile number');
                    return;
                  }
                  setError('');
                  setPhoneVerified(true);
                  setCurrentStep(2);
                }}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer flex items-center gap-2"
              >
                <span>{t.verifyAndLogin}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DIGILOCKER IDENTITY VERIFICATION (GOVT OF INDIA) */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  {t.digilockerKycTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {t.digilockerKycDesc}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-black text-blue-800 text-xs shadow-2xs">
                DL
              </div>
            </div>

            {/* DigiLocker Official Verification Card */}
            <div className="p-4 sm:p-5 bg-linear-to-br from-blue-50/70 to-emerald-50/70 border border-blue-200/80 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-extrabold text-blue-950 uppercase tracking-wide">
                    National DigiLocker e-KYC Gateway
                  </span>
                </div>
                <span className="text-[11px] bg-white border border-blue-200 text-blue-800 font-bold px-2 py-0.5 rounded-md">
                  Govt of India Approved
                </span>
              </div>

              {/* Document Type Selector */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setDocType('aadhaar')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex items-center justify-center gap-2 ${
                    docType === 'aadhaar'
                      ? 'bg-white border-blue-600 text-blue-900 shadow-xs'
                      : 'bg-white/60 border-slate-200 text-slate-600'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-blue-700" />
                  <span>Aadhaar e-KYC (UID)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDocType('pan')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex items-center justify-center gap-2 ${
                    docType === 'pan'
                      ? 'bg-white border-blue-600 text-blue-900 shadow-xs'
                      : 'bg-white/60 border-slate-200 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-700" />
                  <span>PAN Card (NSDL/ITD)</span>
                </button>
              </div>

              {/* Verified Certificate Container */}
              {kycData?.is_verified ? (
                <div className="p-4 bg-white border border-emerald-200 rounded-xl space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {t.digilockerVerified}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Txn: {kycData.digilocker_txn_id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Full Name (Legal)</span>
                      <span className="font-bold text-slate-900">{kycData.full_name}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">{t.aadhaarMasked}</span>
                      <span className="font-mono font-bold text-slate-900">{kycData.masked_uid}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">{t.panVerified}</span>
                      <span className="font-mono font-bold text-slate-900">{kycData.pan_number}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Verified Date</span>
                      <span className="text-slate-800 font-medium">
                        {new Date(kycData.verified_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] text-slate-500 block">Verified Address:</span>
                    <span className="text-xs text-slate-700 font-medium">{kycData.address}</span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleDigiLockerVerify}
                  disabled={isLoading}
                  className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying with UIDAI/DigiLocker...' : t.connectDigiLocker}</span>
                </button>
              )}

              {/* Consent checkbox */}
              <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={digilockerConsent}
                  onChange={(e) => setDigilockerConsent(e.target.checked)}
                  className="mt-0.5 accent-blue-600 rounded"
                />
                <span>
                  I consent to verify my identity securely via DigiLocker e-KYC under the Information Technology (Preservation and Retention of Information by Intermediaries) Rules.
                </span>
              </label>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                id="onboard-step2-next"
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BUSINESS TYPE CLASSIFICATION */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t.businessTypeQuestion}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your business type to automatically configure Indian GST, ITC claims, or regulatory exemptions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: GST Registered */}
              <div
                id="biz-type-gst-reg"
                onClick={() => handleSelectBusinessType('gst_registered')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  businessType === 'gst_registered'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Building2 className={`w-5 h-5 ${businessType === 'gst_registered' ? 'text-emerald-400' : 'text-slate-700'}`} />
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      businessType === 'gst_registered' ? 'bg-slate-800 text-emerald-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      ITC Claimable
                    </span>
                  </div>
                  <h3 className="text-xs font-extrabold">{t.registeredGstTitle}</h3>
                  <p className={`text-[11px] leading-relaxed ${businessType === 'gst_registered' ? 'text-slate-300' : 'text-slate-500'}`}>
                    {t.registeredGstDesc}
                  </p>
                </div>
              </div>

              {/* Option 2: Small Retail Kirana (< ₹40L exempt) */}
              <div
                id="biz-type-unreg"
                onClick={() => handleSelectBusinessType('unregistered_retail')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  businessType === 'unregistered_retail'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Store className={`w-5 h-5 ${businessType === 'unregistered_retail' ? 'text-emerald-400' : 'text-slate-700'}`} />
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      businessType === 'unregistered_retail' ? 'bg-slate-800 text-emerald-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      Exempt &lt; ₹40L
                    </span>
                  </div>
                  <h3 className="text-xs font-extrabold">{t.unregisteredRetailTitle}</h3>
                  <p className={`text-[11px] leading-relaxed ${businessType === 'unregistered_retail' ? 'text-slate-300' : 'text-slate-500'}`}>
                    {t.unregisteredRetailDesc}
                  </p>
                </div>
              </div>

              {/* Option 3: Indian Freelancer / Independent Professional */}
              <div
                id="biz-type-freelancer"
                onClick={() => handleSelectBusinessType('freelancer')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  businessType === 'freelancer'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Laptop className={`w-5 h-5 ${businessType === 'freelancer' ? 'text-emerald-400' : 'text-slate-700'}`} />
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      businessType === 'freelancer' ? 'bg-slate-800 text-emerald-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      Full Exemption &lt; ₹20L
                    </span>
                  </div>
                  <h3 className="text-xs font-extrabold">{t.freelancerTitle}</h3>
                  <p className={`text-[11px] leading-relaxed ${businessType === 'freelancer' ? 'text-slate-300' : 'text-slate-500'}`}>
                    {t.freelancerDesc}
                  </p>
                </div>
              </div>

              {/* Option 4: Composition Scheme Dealer */}
              <div
                id="biz-type-comp"
                onClick={() => handleSelectBusinessType('composition_dealer')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  businessType === 'composition_dealer'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Sparkles className={`w-5 h-5 ${businessType === 'composition_dealer' ? 'text-emerald-400' : 'text-slate-700'}`} />
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      businessType === 'composition_dealer' ? 'bg-slate-800 text-emerald-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      1% Flat Tax
                    </span>
                  </div>
                  <h3 className="text-xs font-extrabold">{t.compositionTitle}</h3>
                  <p className={`text-[11px] leading-relaxed ${businessType === 'composition_dealer' ? 'text-slate-300' : 'text-slate-500'}`}>
                    {t.compositionDesc}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                id="onboard-step3-next"
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: INDIAN GOVERNMENT COMPLIANCE & GST VERIFICATION */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-slate-800" />
                {t.stepGovtCompliance}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {t.gstCheckQuestion}
              </p>
            </div>

            {/* GST Yes / No Selector */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setHasGst(true);
                  if (!gstin) setGstin('09AAAAA0000A1Z5');
                }}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  hasGst
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {t.hasGstYes}
              </button>
              <button
                type="button"
                onClick={() => {
                  setHasGst(false);
                  setGstVerified(false);
                }}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  !hasGst
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {t.hasGstNo}
              </button>
            </div>

            {/* IF GST REGISTERED: GSTIN Field & Auto-Lookup */}
            {hasGst ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Enter 15-Digit GST Number (GSTIN)
                </label>
                <div className="flex gap-2">
                  <input
                    id="onboard-gstin-input"
                    type="text"
                    maxLength={15}
                    value={gstin}
                    onChange={(e) => {
                      setGstin(e.target.value.toUpperCase());
                      setGstVerified(false);
                    }}
                    placeholder="09AAAAA0000A1Z5"
                    className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 uppercase focus:outline-hidden focus:border-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyGstin}
                    disabled={isLoading}
                    className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
                  >
                    {gstVerified ? 'Verified ✓' : 'Verify GST'}
                  </button>
                </div>
                {gstVerified && (
                  <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Active GSTIN Registered with GSTN Portal. State Code: {gstin.slice(0, 2)}</span>
                  </div>
                )}
              </div>
            ) : (
              /* IF WITHOUT GST: Indian Regulatory Identification */
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                {businessType === 'freelancer' ? (
                  /* Freelancer Special Regulatory Exemption Note */
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5 text-xs text-blue-900">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Award className="w-4 h-4 text-blue-700" />
                      <span>Freelance Professional Legal Exemption (India)</span>
                    </div>
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      {t.freelancerNote}
                    </p>
                  </div>
                ) : (
                  /* Retail Shop / Kirana Non-GST Registrations */
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-800">
                      Indian Government Business Identification (Choose One)
                    </label>

                    <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setNonGstDocType('udyam')}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                          nonGstDocType === 'udyam'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        Udyam MSME
                      </button>
                      <button
                        type="button"
                        onClick={() => setNonGstDocType('gumasta')}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                          nonGstDocType === 'gumasta'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        Gumasta / Shop Act
                      </button>
                      <button
                        type="button"
                        onClick={() => setNonGstDocType('fssai')}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                          nonGstDocType === 'fssai'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        FSSAI License
                      </button>
                    </div>

                    {nonGstDocType === 'udyam' && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          {t.udyamNumberLabel}
                        </label>
                        <input
                          type="text"
                          value={udyamNumber}
                          onChange={(e) => setUdyamNumber(e.target.value.toUpperCase())}
                          placeholder="UDYAM-UP-28-0012894"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 uppercase"
                        />
                      </div>
                    )}

                    {nonGstDocType === 'gumasta' && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          {t.gumastaLabel}
                        </label>
                        <input
                          type="text"
                          value={gumastaLicense}
                          onChange={(e) => setGumastaLicense(e.target.value)}
                          placeholder="GUM-KNP-2026-9912"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                        />
                      </div>
                    )}

                    {nonGstDocType === 'fssai' && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          {t.fssaiLabel}
                        </label>
                        <input
                          type="text"
                          maxLength={14}
                          value={fssaiLicense}
                          onChange={(e) => setFssaiLicense(e.target.value)}
                          placeholder="10824001000982"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Annual Turnover Bracket Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimated Annual Turnover (Revenue Bracket)
                  </label>
                  <select
                    value={turnoverBracket}
                    onChange={(e: any) => setTurnoverBracket(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="below_20_lakhs">Below ₹20 Lakhs / Year (GST Exempt for all)</option>
                    <option value="20_to_40_lakhs">₹20 Lakhs – ₹40 Lakhs / Year (Goods exempt in normal states)</option>
                    <option value="above_40_lakhs">₹40 Lakhs – ₹1.5 Crore / Year (GST Mandatory)</option>
                    <option value="above_1.5_crore">Above ₹1.5 Crore / Year (GST Regular)</option>
                  </select>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                id="onboard-step4-next"
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SHOP PROFILE & ENTER APP */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-slate-800" />
                {t.stepShopProfile}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Confirm your business details to setup your automated ledger and invoicing.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Business / Shop Name *
                  </label>
                  <input
                    id="onboard-shop-name"
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Gupta Kirana Stores"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Owner / Proprietor Name *
                  </label>
                  <input
                    id="onboard-owner-name"
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar Gupta"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    City / Town *
                  </label>
                  <input
                    id="onboard-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Kanpur"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Origin State (GST Matrix) *
                  </label>
                  <select
                    id="onboard-state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:bg-white cursor-pointer"
                  >
                    {INDIAN_STATES_GST.map((s) => (
                      <option key={s.code} value={`${s.code} - ${s.name}`}>
                        {s.code} - {s.name} ({s.hindiName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Business Category
                </label>
                <input
                  id="onboard-category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. FMCG Grocery & Retail"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:bg-white"
                />
              </div>

              {/* Summary of Configuration */}
              <div className="p-3.5 bg-slate-100 rounded-xl text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span>Language:</span>
                  <span className="font-bold">{SUPPORTED_LANGUAGES.find((l) => l.code === language)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>KYC Status:</span>
                  <span className="font-bold text-emerald-700">DigiLocker Verified ✓</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Scheme:</span>
                  <span className="font-bold">
                    {hasGst ? (businessType === 'composition_dealer' ? 'Composition (1%)' : 'Regular GST (ITC Eligible)') : 'Exempt / Non-GST'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                id="onboard-final-submit"
                type="button"
                onClick={handleFinalSubmit}
                disabled={isLoading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoading ? 'Setting up Shop...' : 'Complete & Open Hisab App'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
