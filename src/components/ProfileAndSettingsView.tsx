import React, { useState } from 'react';
import {
  Store,
  User,
  ShieldCheck,
  Building2,
  MapPin,
  FileText,
  Smartphone,
  Mail,
  LogOut,
  Plus,
  CheckCircle2,
  Globe,
  Percent,
  ChevronRight,
  Sparkles,
  Phone,
  Check
} from 'lucide-react';
import { Language, Shop, GstSettings, UserProfile } from '../types';
import { getTranslation, SUPPORTED_LANGUAGES } from '../locales/i18n';

interface ProfileAndSettingsViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  shop: Shop;
  allShops: Shop[];
  gstSettings: GstSettings;
  user?: UserProfile | null;
  onSelectShop: (shop: Shop) => void;
  onOpenAddNewShop: () => void;
  onLaunchOnboarding: () => void;
  onLogout: () => void;
  onOpenGstSettingsTab: () => void;
}

export const ProfileAndSettingsView: React.FC<ProfileAndSettingsViewProps> = ({
  language,
  onLanguageChange,
  shop,
  allShops,
  gstSettings,
  user,
  onSelectShop,
  onOpenAddNewShop,
  onLaunchOnboarding,
  onLogout,
  onOpenGstSettingsTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'shops'>('profile');

  return (
    <div className="space-y-4 pb-16 animate-in fade-in-50 duration-200">
      {/* Sub-tab Pill Switcher */}
      <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold select-none">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`py-2.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
            activeSubTab === 'profile'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{language === 'hi' ? 'खाता व दुकान' : 'Profile & Shop'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('shops')}
          className={`py-2.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
            activeSubTab === 'shops'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>
            {language === 'hi' ? `सभी दुकानें (${allShops.length})` : `All Businesses (${allShops.length})`}
          </span>
        </button>
      </div>

      {/* SUB-TAB 1: SHOP & OWNER PROFILE */}
      {activeSubTab === 'profile' && (
        <div className="space-y-4">
          {/* User Account Card (Backend Synced) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'hi' ? 'सत्यापित व्यापारी प्रोफ़ाइल' : 'Merchant User Profile'}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {user?.role ? user.role.toUpperCase() : 'OWNER'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-base shadow-xs shrink-0">
                {(user?.name || shop.owner_name || 'R').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                  {user?.name || shop.owner_name || 'Ramesh Kumar Gupta'}
                </h3>
                <p className="text-xs text-slate-600 truncate font-mono">
                  {user?.email || 'thepomonu@gmail.com'}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {user?.phone || shop.phone || '+91 9876543210'}
                </p>
              </div>
            </div>
          </div>
          {/* Main Profile Header Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                  <Store className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-slate-900 text-base sm:text-lg truncate">
                      {shop.name.split('(')[0]}
                    </h2>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate mt-0.5">
                    {shop.owner_name} • {shop.phone}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {shop.city || 'Kanpur'}, {gstSettings.shop_state_name}
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenAddNewShop}
                className="hidden sm:flex items-center gap-1.5 py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'hi' ? 'नई दुकान' : 'Add Shop'}</span>
              </button>
            </div>

            {/* DigiLocker Govt e-KYC Verification Certificate Badge */}
            <div className="p-4 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200 rounded-2xl space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  DigiLocker Identity Verified (Govt. of India)
                </span>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                  e-KYC Verified ✓
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px] pt-1.5 border-t border-blue-200/60">
                <div>
                  <span className="text-slate-500 block">UID / Masked Aadhaar:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {shop.digilocker_data?.masked_uid || 'XXXX-XXXX-9821'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Owner PAN:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {shop.digilocker_data?.pan_number || 'ABCPG9821K'}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block">Verification Txn ID:</span>
                  <span className="font-mono text-[10px] font-bold text-blue-800 truncate block">
                    {shop.digilocker_data?.digilocker_txn_id || 'DL-GOV-982104'}
                  </span>
                </div>
              </div>
            </div>

            {/* Shop Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <span className="text-slate-500 font-medium text-[11px]">Business Category</span>
                <span className="font-bold text-slate-900 mt-1">{shop.category}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <span className="text-slate-500 font-medium text-[11px]">GST / Tax Scheme</span>
                <span className="font-bold text-slate-900 mt-1 capitalize">
                  {shop.business_type === 'gst_registered'
                    ? 'Regular GST Registered (18%/12%/5%)'
                    : shop.business_type === 'composition_dealer'
                    ? 'Composition Scheme (1% Tax)'
                    : shop.business_type === 'freelancer'
                    ? 'Freelancer (< ₹20L Exempt)'
                    : 'Small Kirana (< ₹40L Non-GST Exempt)'}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <span className="text-slate-500 font-medium text-[11px]">GSTIN Number</span>
                <span className="font-mono font-bold text-emerald-700 mt-1">
                  {gstSettings.gstin || shop.gst_number || (shop.compliance?.has_gst ? shop.compliance.gstin : 'Exempt / Non-GST')}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <span className="text-slate-500 font-medium text-[11px]">Inbound Ledger Email</span>
                <span className="font-mono text-blue-700 text-[11px] truncate mt-1">
                  {shop.inbound_email}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Navigation Cards */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              {language === 'hi' ? 'त्वरित नियंत्रण' : 'Business Controls'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={onLaunchOnboarding}
                className="w-full p-3.5 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 rounded-2xl text-left transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-950 text-xs">
                      {language === 'hi' ? '5-चरणीय e-KYC ऑनबोर्डिंग' : '5-Step e-KYC Onboarding'}
                    </p>
                    <p className="text-[10px] text-blue-700">
                      {language === 'hi' ? 'नया आधार + GST खाता बनाएँ' : 'Setup verified merchant account'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenGstSettingsTab}
                className="w-full p-3.5 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 rounded-2xl text-left transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-950 text-xs">
                      {language === 'hi' ? 'GST दरें व राज्य नियम' : 'GST Rates & State Rules'}
                    </p>
                    <p className="text-[10px] text-emerald-700">
                      {language === 'hi' ? 'HSN कोड व ITC सेटिंग बदलें' : 'Configure SGST/CGST rules'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Language Selector Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-slate-700" />
              <div>
                <p className="font-bold text-slate-900 text-xs">
                  {language === 'hi' ? 'ऐप की भाषा' : 'App Language'}
                </p>
                <p className="text-[10px] text-slate-500">11 Indian Languages supported</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeLabel} ({l.label})
                </option>
              ))}
            </select>
          </div>

          {/* Secure Log Out Button */}
          <div className="pt-2">
            <button
              onClick={onLogout}
              className="w-full py-4 bg-rose-50 hover:bg-rose-100 active:scale-98 text-rose-700 font-extrabold text-xs sm:text-sm rounded-2xl transition border border-rose-200 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>{language === 'hi' ? 'खाते से लॉगआउट करें' : 'Log Out of Current Account'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ALL SHOPS & SWITCHER */}
      {activeSubTab === 'shops' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                {language === 'hi' ? 'आपकी सभी दुकानें व व्यापार' : 'Your Businesses & Shops'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'किसी भी दुकान पर टैप करके उसका खाता खोलें' : 'Tap any business to instantly switch ledgers'}
              </p>
            </div>

            <button
              onClick={onOpenAddNewShop}
              className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'hi' ? 'नई दुकान' : 'Add Shop'}</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {allShops.map((s) => {
              const isSelected = s.id === shop.id;
              return (
                <div
                  key={s.id}
                  className={`p-4 rounded-3xl border transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-sm truncate">{s.name.split('(')[0]}</p>
                      {isSelected && (
                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {language === 'hi' ? 'सक्रिय' : 'Active'}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {s.owner_name} • {s.category.split('(')[0]}
                    </p>
                    <p className={`text-[10px] mt-1 font-mono ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                      {s.city} • {s.gst_number || (s.compliance?.has_gst ? s.compliance.gstin : 'Non-GST')}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </div>
                    ) : (
                      <button
                        onClick={() => onSelectShop(s)}
                        className="py-1.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-xs transition cursor-pointer"
                      >
                        {language === 'hi' ? 'चुनें' : 'Switch'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <button
              onClick={onOpenAddNewShop}
              className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-3xl text-xs font-bold text-slate-700 hover:text-slate-900 transition flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              <Plus className="w-4 h-4 text-slate-700" />
              <span>{language === 'hi' ? '+ एक और नई दुकान या फ़र्म जोड़ें' : '+ Add Another Business / Shop'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
