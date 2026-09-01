import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  CheckCircle2,
  Percent,
  Calculator,
  ShieldCheck,
  FileCheck,
  AlertCircle,
  HelpCircle,
  ArrowRightLeft,
  ChevronDown
} from 'lucide-react';
import { Language, GstSettings } from '../types';
import { getTranslation } from '../locales/i18n';
import { INDIAN_STATES_GST, GST_SLABS, getGstBreakdown } from '../data/gstData';

interface GstStatewiseSettingsViewProps {
  language: Language;
  settings: GstSettings;
  onUpdateSettings: (newSettings: Partial<GstSettings>) => void;
}

export const GstStatewiseSettingsView: React.FC<GstStatewiseSettingsViewProps> = ({
  language,
  settings,
  onUpdateSettings,
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<'settings' | 'calculator' | 'states'>('settings');

  // Form State
  const [gstin, setGstin] = useState(settings.gstin || '09AAAAA1234A1Z5');
  const [shopStateCode, setShopStateCode] = useState(settings.shop_state_code || '09');
  const [taxScheme, setTaxScheme] = useState<'regular' | 'composition' | 'unregistered'>(
    settings.tax_scheme || 'regular'
  );
  const [defaultPricingMode, setDefaultPricingMode] = useState<'inclusive' | 'exclusive' | 'exempt'>(
    settings.default_pricing_mode || 'inclusive'
  );
  const [isComposition, setIsComposition] = useState(settings.is_composition_scheme || false);
  const [compositionRate, setCompositionRate] = useState(settings.composition_rate_pct || 1.0);
  const [eInvoiceEnabled, setEInvoiceEnabled] = useState(settings.e_invoice_enabled || false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Interactive Live Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [calcGstRate, setCalcGstRate] = useState<number>(18);
  const [calcPricingMode, setCalcPricingMode] = useState<'inclusive' | 'exclusive'>('inclusive');
  const [calcDestStateCode, setCalcDestStateCode] = useState<string>('09');

  // Search State in States Matrix
  const [stateSearch, setStateSearch] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const stateObj = INDIAN_STATES_GST.find((s) => s.code === shopStateCode);

    onUpdateSettings({
      gstin: gstin.trim().toUpperCase(),
      shop_state_code: shopStateCode,
      shop_state_name: stateObj ? stateObj.name : 'Uttar Pradesh',
      tax_scheme: taxScheme,
      default_pricing_mode: defaultPricingMode,
      is_composition_scheme: taxScheme === 'composition',
      composition_rate_pct: taxScheme === 'composition' ? compositionRate : 0,
      e_invoice_enabled: eInvoiceEnabled,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Calculator computation
  const calcBreakdown = getGstBreakdown(
    calcAmount,
    calcGstRate,
    shopStateCode,
    calcDestStateCode,
    calcPricingMode === 'inclusive'
  );

  const destStateObj = INDIAN_STATES_GST.find((s) => s.code === calcDestStateCode);

  const filteredStates = INDIAN_STATES_GST.filter(
    (s) =>
      s.name.toLowerCase().includes(stateSearch.toLowerCase()) ||
      s.code.includes(stateSearch) ||
      s.hindiName.includes(stateSearch)
  );

  return (
    <div className="space-y-4">
      {/* Toast */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl flex items-center gap-2 text-xs font-bold shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{language === 'hi' ? 'GST सेटिंग्स सुरक्षित हो गईं!' : 'GST settings saved successfully!'}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-xs flex gap-1">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{t.gstOptionsTitle}</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'calculator'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'GST कैलकुलेटर' : 'State Tax Calculator'}</span>
        </button>

        <button
          onClick={() => setActiveTab('states')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'states'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? '36 राज्य कोड' : 'State Codes'}</span>
        </button>
      </div>

      {/* TAB 1: GST SETTINGS & SCHEMES */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSave} className="space-y-4">
          {/* Shopkeeper Scheme Selector Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>{language === 'hi' ? 'दुकान की टैक्स स्कीम (Tax Scheme)' : 'Shopkeeper Tax Scheme'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Regular Scheme */}
              <div
                onClick={() => setTaxScheme('regular')}
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer space-y-1 ${
                  taxScheme === 'regular'
                    ? 'border-blue-700 bg-blue-50/40'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">रेगुलर GST (Regular)</span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${taxScheme === 'regular' ? 'border-blue-700 bg-blue-700' : 'border-slate-300'}`}>
                    {taxScheme === 'regular' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  {language === 'hi'
                    ? 'इनपुट क्रेडिट (ITC) क्लेम करें, GSTR-1 व 3B फ़ाइल करें।'
                    : 'Claim full Input Tax Credit (ITC) on all purchases.'}
                </p>
              </div>

              {/* Composition Scheme */}
              <div
                onClick={() => setTaxScheme('composition')}
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer space-y-1 ${
                  taxScheme === 'composition'
                    ? 'border-amber-700 bg-amber-50/40'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">कंपोजिशन (1% Flat)</span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${taxScheme === 'composition' ? 'border-amber-700 bg-amber-700' : 'border-slate-300'}`}>
                    {taxScheme === 'composition' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  {language === 'hi'
                    ? '1% आसान टर्नओवर टैक्स, बिना ITC झंझट के।'
                    : 'Pay 1% flat turnover tax. No input credit allowed.'}
                </p>
              </div>

              {/* Unregistered Small Shop */}
              <div
                onClick={() => setTaxScheme('unregistered')}
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer space-y-1 ${
                  taxScheme === 'unregistered'
                    ? 'border-emerald-700 bg-emerald-50/40'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">असंगठित / छोटा किराना</span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${taxScheme === 'unregistered' ? 'border-emerald-700 bg-emerald-700' : 'border-slate-300'}`}>
                    {taxScheme === 'unregistered' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  {language === 'hi'
                    ? '₹40 लाख से कम टर्नओवर वाले किराना स्टोर के लिए टैक्स मुक्त।'
                    : 'Exempt (< ₹40L turnover). Simple bill of supply.'}
                </p>
              </div>
            </div>
          </div>

          {/* State & GSTIN Configuration Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5 text-xs">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-700" />
              <span>{language === 'hi' ? 'दुकान का राज्य व GSTIN' : 'Shop State & Registration'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">{t.originState}</label>
                <select
                  value={shopStateCode}
                  onChange={(e) => setShopStateCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
                >
                  {INDIAN_STATES_GST.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.code} - {s.hindiName} ({s.name})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {language === 'hi'
                    ? `इस राज्य में बिक्री पर CGST + SGST लगेगा, दूसरे राज्य में IGST लगेगा।`
                    : `Intra-state uses CGST+SGST, interstate uses IGST.`}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">{t.gstin}</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="09AAAAA1234A1Z5"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {language === 'hi' ? 'शुरुआती 2 अंक राज्य कोड दर्शाते हैं।' : 'First 2 digits represent state code.'}
                </span>
              </div>
            </div>

            {/* Default Bill Mode (Inclusive vs Exclusive) */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-slate-700 font-bold mb-2">
                {language === 'hi' ? 'डिफ़ॉल्ट बिलिंग मोड (Default Pricing Mode):' : 'Default Sales Pricing Mode:'}
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDefaultPricingMode('inclusive')}
                  className={`py-2.5 px-2 rounded-xl font-bold text-center border cursor-pointer ${
                    defaultPricingMode === 'inclusive'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.taxInclusive}
                </button>

                <button
                  type="button"
                  onClick={() => setDefaultPricingMode('exclusive')}
                  className={`py-2.5 px-2 rounded-xl font-bold text-center border cursor-pointer ${
                    defaultPricingMode === 'exclusive'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.taxExclusive}
                </button>

                <button
                  type="button"
                  onClick={() => setDefaultPricingMode('exempt')}
                  className={`py-2.5 px-2 rounded-xl font-bold text-center border cursor-pointer ${
                    defaultPricingMode === 'exempt'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.nonGstBill}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs py-3.5 rounded-xl shadow-xs transition cursor-pointer"
          >
            {language === 'hi' ? 'GST सेटिंग्स सुरक्षित करें ✓' : 'Save GST Settings ✓'}
          </button>
        </form>
      )}

      {/* TAB 2: INTERACTIVE STATE-WISE TAX CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-700" />
              <span>{language === 'hi' ? 'राज्यवार GST कैलकुलेटर' : 'State-wise GST Calculator'}</span>
            </h4>
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg font-bold">
              {calcBreakdown.isIntraState ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)'}
            </span>
          </div>

          {/* Calculator Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {language === 'hi' ? 'रकम (Amount ₹)' : 'Amount (₹)'}
              </label>
              <input
                type="number"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">GST दर (Slab Rate %)</label>
              <div className="grid grid-cols-5 gap-1">
                {[0, 5, 12, 18, 28].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setCalcGstRate(rate)}
                    className={`py-1.5 rounded-lg font-bold text-center border cursor-pointer ${
                      calcGstRate === rate
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">{t.destinationState}</label>
              <select
                value={calcDestStateCode}
                onChange={(e) => setCalcDestStateCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
              >
                {INDIAN_STATES_GST.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">टैक्स प्रकार (Mode)</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setCalcPricingMode('inclusive')}
                  className={`py-2 px-2 rounded-lg font-bold text-center border cursor-pointer ${
                    calcPricingMode === 'inclusive'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {t.taxInclusive}
                </button>
                <button
                  type="button"
                  onClick={() => setCalcPricingMode('exclusive')}
                  className={`py-2 px-2 rounded-lg font-bold text-center border cursor-pointer ${
                    calcPricingMode === 'exclusive'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {t.taxExclusive}
                </button>
              </div>
            </div>
          </div>

          {/* Calculator Output Result Card */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Taxable Subtotal</span>
                <div className="text-lg font-bold">₹{calcBreakdown.taxableAmount.toLocaleString('en-IN')}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Grand Total (₹)</span>
                <div className="text-2xl font-black text-emerald-400">
                  ₹{calcBreakdown.grandTotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
              {calcBreakdown.isIntraState ? (
                <>
                  <div>
                    <span className="text-[10px] text-slate-400 block">CGST ({calcGstRate / 2}%)</span>
                    <span className="font-bold text-blue-300">₹{calcBreakdown.cgst}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">SGST ({calcGstRate / 2}%)</span>
                    <span className="font-bold text-blue-300">₹{calcBreakdown.sgst}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total GST</span>
                    <span className="font-black text-amber-300">₹{calcBreakdown.totalTax}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-2 text-left pl-2">
                    <span className="text-[10px] text-slate-400 block">IGST ({calcGstRate}%) - Inter-State</span>
                    <span className="font-bold text-blue-300">
                      Destination: {destStateObj?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total IGST</span>
                    <span className="font-black text-amber-300">₹{calcBreakdown.igst}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 36 INDIAN STATES GST REFERENCE TABLE */}
      {activeTab === 'states' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-700" />
              <span>{t.statewiseRules}</span>
            </h4>
            <input
              type="text"
              value={stateSearch}
              onChange={(e) => setStateSearch(e.target.value)}
              placeholder="Search state..."
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs w-36 focus:outline-none"
            />
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 text-xs">
            {filteredStates.map((s) => {
              const isShopState = s.code === shopStateCode;
              return (
                <div
                  key={s.code}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    isShopState
                      ? 'bg-blue-50/60 border-blue-300 font-bold'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-black text-xs flex items-center justify-center">
                      {s.code}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900">
                        {s.hindiName} ({s.name})
                      </div>
                      <div className="text-[10px] text-slate-500">{s.zone} Zone</div>
                    </div>
                  </div>

                  <div className="text-right">
                    {isShopState ? (
                      <span className="text-[10px] bg-blue-700 text-white px-2 py-0.5 rounded-full font-bold">
                        दुकान का राज्य (Origin)
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">IGST Applicable</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
