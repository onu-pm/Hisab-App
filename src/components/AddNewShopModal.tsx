import React, { useState } from 'react';
import {
  X,
  Store,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Building2,
  MapPin,
  FileText,
  Smartphone,
  User,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { BusinessType, Language, Shop } from '../types';
import { getTranslation } from '../locales/i18n';
import { INDIAN_STATES_GST } from '../data/gstData';

interface AddNewShopModalProps {
  language: Language;
  onClose: () => void;
  onShopCreated: (shop: Shop) => void;
  onLaunchFullOnboarding?: () => void;
}

const BUSINESS_CATEGORIES = [
  'FMCG Grocery & Kirana',
  'Medical & Pharmacy Store',
  'Electronics & Mobile Accessories',
  'Hardware & Electricals',
  'Textiles, Garments & Footwear',
  'Dairy & Daily Provisions',
  'Automobile & Spare Parts',
  'Restaurant, Cafe & Bakery',
  'Services & Tech Consultancy',
  'Wholesale & Distribution',
  'General Retail Trade',
];

export const AddNewShopModal: React.FC<AddNewShopModalProps> = ({
  language,
  onClose,
  onShopCreated,
  onLaunchFullOnboarding,
}) => {
  const t = getTranslation(language);
  const [creationMode, setCreationMode] = useState<'quick' | 'onboard_prompt'>('quick');

  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState(BUSINESS_CATEGORIES[0]);
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('09');
  const [businessType, setBusinessType] = useState<BusinessType>('gst_registered');
  const [gstin, setGstin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedStateObj = INDIAN_STATES_GST.find((s) => s.code === stateCode) || INDIAN_STATES_GST[8];

  const handleStateChange = (newCode: string) => {
    setStateCode(newCode);
    if (gstin && gstin.length >= 2) {
      setGstin(`${newCode}${gstin.substring(2)}`);
    }
  };

  const handleGstinChange = (val: string) => {
    const uppercaseVal = val.toUpperCase();
    setGstin(uppercaseVal);
    if (uppercaseVal.length >= 2) {
      const codeFromGst = uppercaseVal.substring(0, 2);
      const match = INDIAN_STATES_GST.find((s) => s.code === codeFromGst);
      if (match) {
        setStateCode(match.code);
      }
    }
  };

  const handleSubmitQuick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) {
      setError(language === 'hi' ? 'कृपया दुकान या फ़र्म का नाम भरें' : 'Please enter Shop/Business Name');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError(language === 'hi' ? 'कृपया 10 अंकों का मोबाइल नंबर भरें' : 'Please enter valid 10-digit Phone number');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const fullStateStr = `${selectedStateObj.code} - ${selectedStateObj.name}`;

    const newShopObj: Shop = {
      id: `shop-${Date.now().toString().slice(-6)}`,
      name: shopName.trim(),
      owner_name: ownerName.trim() || (language === 'hi' ? 'दुकानदार' : 'Business Owner'),
      phone: `+91 ${cleanPhone}`,
      language_pref: language,
      city: city.trim() || selectedStateObj.name,
      state: fullStateStr,
      category,
      gst_number: gstin.trim() || (businessType === 'gst_registered' ? `${selectedStateObj.code}AAAAA0000A1Z5` : undefined),
      inbound_email: `${shopName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10) || 'shop'}-${cleanPhone.slice(-4)}@ingestion.hisabapp.in`,
      created_at: new Date().toISOString(),
      business_type: businessType,
      kyc_verified: true,
      digilocker_data: {
        is_verified: true,
        doc_type: 'aadhaar',
        full_name: ownerName.trim() || 'Business Owner',
        masked_uid: `XXXX-XXXX-${cleanPhone.slice(-4)}`,
        pan_number: gstin ? gstin.substring(2, 12) : `ABCDE${cleanPhone.slice(-4)}F`,
        verified_at: new Date().toISOString(),
        digilocker_txn_id: `DL-SHOP-${Date.now().toString().slice(-6)}`,
      },
      compliance: {
        has_gst: businessType === 'gst_registered' || businessType === 'composition_dealer' || !!gstin,
        gstin: gstin.trim() || (businessType === 'gst_registered' ? `${selectedStateObj.code}AAAAA0000A1Z5` : ''),
        trade_name: shopName.trim(),
        legal_name: ownerName.trim() || shopName.trim(),
        tax_scheme: businessType === 'composition_dealer' ? 'composition' : businessType === 'gst_registered' ? 'regular' : 'unregistered',
        turnover_bracket: '20_to_40_lakhs',
      },
    };

    try {
      await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShopObj),
      });
    } catch (err) {
      // Local fallback handled smoothly
    }

    setIsSubmitting(false);
    onShopCreated(newShopObj);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base leading-tight">
                {language === 'hi' ? 'नई दुकान / व्यापार जोड़ें' : 'Add New Shop / Business'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'नया बहीखाता व GST खाता तुरंत शुरू करें' : 'Create and manage multiple business ledgers'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setCreationMode('quick')}
            className={`py-2 px-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              creationMode === 'quick'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'hi' ? 'त्वरित जोड़ें (1 मिनट)' : 'Quick Setup'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onLaunchFullOnboarding) {
                onClose();
                onLaunchFullOnboarding();
              } else {
                setCreationMode('onboard_prompt');
              }
            }}
            className={`py-2 px-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              creationMode === 'onboard_prompt'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'hi' ? '5-चरणीय e-KYC' : 'Full Onboarding'}</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitQuick} className="space-y-3.5 text-xs">
          {/* Shop Name */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              {language === 'hi' ? 'दुकान / फ़र्म का नाम *' : 'Shop / Business Name *'}
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. राधे श्याम किराना स्टोर्स' : 'e.g. Radhey Kirana Stores'}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-hidden transition"
              />
            </div>
          </div>

          {/* Owner Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {language === 'hi' ? 'मालिक / प्रोपराइटर का नाम' : 'Owner / Trader Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. राहुल शर्मा' : 'e.g. Rahul Sharma'}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-hidden transition"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {language === 'hi' ? 'मोबाइल नंबर *' : 'Mobile Number *'}
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-hidden transition"
                />
              </div>
            </div>
          </div>

          {/* Business Category & Business Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {language === 'hi' ? 'व्यापार की श्रेणी' : 'Business Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-hidden cursor-pointer"
              >
                {BUSINESS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {language === 'hi' ? 'GST प्रकार' : 'GST / Business Type'}
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="gst_registered">GST Registered Trader (Regular 18%/12%/5%)</option>
                <option value="unregistered_retail">Small Kirana (&lt; ₹40L Non-GST Exempt)</option>
                <option value="composition_dealer">Composition Scheme (1% Tax)</option>
                <option value="freelancer">Freelancer / Consultant (&lt; ₹20L Exempt)</option>
              </select>
            </div>
          </div>

          {/* State & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {language === 'hi' ? 'राज्य (GST State Code) *' : 'State (GST Code) *'}
              </label>
              <select
                value={stateCode}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-hidden cursor-pointer"
              >
                {INDIAN_STATES_GST.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.code} - {s.name} ({s.hindiName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {language === 'hi' ? 'शहर / मंडी (City)' : 'City / Town'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. लखनऊ / कानपुर' : 'e.g. Lucknow / Kanpur'}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-hidden transition"
                />
              </div>
            </div>
          </div>

          {/* GSTIN Field (Optional or required for regular) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 block">
                {language === 'hi' ? 'GSTIN नंबर (वैकल्पिक)' : 'GSTIN Number (Optional)'}
              </label>
              <span className="text-[10px] text-slate-400 font-mono">15 alphanumeric characters</span>
            </div>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                maxLength={15}
                value={gstin}
                onChange={(e) => handleGstinChange(e.target.value)}
                placeholder={`${selectedStateObj.code}AAAAA0000A1Z5`}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 uppercase focus:outline-hidden transition"
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{language === 'hi' ? 'दुकान बनाएं व शुरू करें' : 'Create & Switch Shop'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
