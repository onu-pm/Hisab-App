import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  PieChart,
  BarChart3,
  Download,
  Share2,
  ArrowUpRight,
  ArrowDownLeft,
  Percent,
  CheckCircle2,
  FileSpreadsheet,
  Building,
  Users
} from 'lucide-react';
import { Language, PeriodStats, SalesInvoice, Invoice, Customer } from '../types';
import { getTranslation } from '../locales/i18n';
import { SAMPLE_PERIOD_STATS } from '../data/sampleShopkeeperData';

interface FinancialAnalyticsViewProps {
  language: Language;
  sales: SalesInvoice[];
  purchases: Invoice[];
  customers: Customer[];
}

export const FinancialAnalyticsView: React.FC<FinancialAnalyticsViewProps> = ({
  language,
  sales,
  purchases,
  customers,
}) => {
  const t = getTranslation(language);
  const [periodType, setPeriodType] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [selectedPeriodKey, setSelectedPeriodKey] = useState<string>('2026-08');
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Available periods filtered by type
  const availablePeriods = SAMPLE_PERIOD_STATS.filter((p) => p.period_type === periodType);

  // Current active stats
  const activeStats =
    SAMPLE_PERIOD_STATS.find((p) => p.period_key === selectedPeriodKey) ||
    availablePeriods[0] ||
    SAMPLE_PERIOD_STATS[0];

  // Dynamic calculation for live period
  const totalMarketUdhaar = customers.reduce((sum, c) => sum + (c.outstanding_balance || 0), 0);

  const handlePeriodTypeChange = (type: 'monthly' | 'quarterly' | 'yearly') => {
    setPeriodType(type);
    const firstInType = SAMPLE_PERIOD_STATS.find((p) => p.period_type === type);
    if (firstInType) {
      setSelectedPeriodKey(firstInType.period_key);
    }
  };

  const generateWhatsAppBusinessReport = () => {
    const text = `📊 *व्यापार बिल - ${activeStats.period_label} वित्तीय रिपोर्ट*
🏪 *दुकान:* गुप्ता किराना एवं जनरल स्टोर्स, कानपुर

📈 *बिक्री व मुनाफ़ा हिसाब (Sales & Profit):*
• *कुल बिक्री (Gross Sales):* ₹${activeStats.total_sales.toLocaleString('en-IN')}
• *कुल खरीद लागत (Purchases/COGS):* ₹${activeStats.total_purchases.toLocaleString('en-IN')}
• *शुद्ध मुनाफ़ा (Gross Profit):* ₹${activeStats.gross_profit.toLocaleString('en-IN')}
• *मुनाफ़ा मार्जिन:* ${activeStats.profit_margin_pct}%

💵 *नकद बनाम उधारी:*
• नकद बिक्री: ₹${activeStats.cash_sales.toLocaleString('en-IN')}
• उधारी बिक्री: ₹${activeStats.credit_sales.toLocaleString('en-IN')}
• बाजार से वसूली: ₹${activeStats.outstanding_collected.toLocaleString('en-IN')}
• *वर्तमान कुल बाक़ी उधारी:* ₹${totalMarketUdhaar.toLocaleString('en-IN')}

🧾 *GST हिसाब (Tax Summary):*
• बिक्री पर GST (Output): ₹${activeStats.gst_collected_output.toLocaleString('en-IN')}
• खरीद पर GST क्रेडिट (Input ITC): ₹${activeStats.gst_paid_input_itc.toLocaleString('en-IN')}
• *सरकार को देय शुद्ध GST:* ₹${activeStats.net_gst_liability.toLocaleString('en-IN')}

_व्यापार बिल ऐप द्वारा स्वतः तैयार_`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Period Selector Tabs (Monthly / Quarterly / Yearly) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-700" />
            <h3 className="font-extrabold text-slate-900 text-sm">{t.tabFinancials}</h3>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => handlePeriodTypeChange('monthly')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                periodType === 'monthly'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'मासिक (Monthly)' : 'Monthly'}
            </button>
            <button
              onClick={() => handlePeriodTypeChange('quarterly')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                periodType === 'quarterly'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'तिमाही (Quarterly)' : 'Quarterly'}
            </button>
            <button
              onClick={() => handlePeriodTypeChange('yearly')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                periodType === 'yearly'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'सालाना (Yearly)' : 'Yearly'}
            </button>
          </div>
        </div>

        {/* Sub Period Chips (e.g. Sep 2026, Aug 2026 or Q1, Q2 or FY26) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {availablePeriods.map((p) => (
            <button
              key={p.period_key}
              onClick={() => setSelectedPeriodKey(p.period_key)}
              className={`px-3.5 py-2 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                selectedPeriodKey === p.period_key
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {p.period_label}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Core Financial KPI Cards (Sales Revenue, Cost/Purchases, Net Profit) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Total Sales Revenue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold">
              {periodType === 'monthly'
                ? t.monthlyRevenue
                : periodType === 'quarterly'
                ? t.quarterlyRevenue
                : t.yearlyRevenue}
            </span>
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹{activeStats.total_sales.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500">
            {activeStats.sales_count} {language === 'hi' ? 'बिक्री बिल जारी' : 'sales bills issued'}
          </div>
        </div>

        {/* Cost of Goods / Purchases */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold">
              {language === 'hi' ? 'कुल खरीदारी लागत (Purchases)' : 'Total Purchases (Cost)'}
            </span>
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
              <ArrowDownLeft className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-900">
            ₹{activeStats.total_purchases.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500">
            {activeStats.purchases_count} {language === 'hi' ? 'सप्लायर आवक बिल' : 'inward supplier bills'}
          </div>
        </div>

        {/* Net Profit & Margin */}
        <div className="bg-emerald-900 text-white rounded-2xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-200">
            <span className="font-bold">
              {periodType === 'monthly'
                ? t.monthlyProfit
                : periodType === 'quarterly'
                ? t.quarterlyProfit
                : t.yearlyProfit}
            </span>
            <span className="p-1.5 bg-emerald-800 text-emerald-300 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300">
            ₹{activeStats.gross_profit.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-200 flex items-center gap-1.5 font-bold">
            <span>{t.profitMargin}: {activeStats.profit_margin_pct}%</span>
            <span>• {language === 'hi' ? 'शुद्ध कमाई' : 'Net Margin'}</span>
          </div>
        </div>
      </div>

      {/* Visual Comparison Chart (Revenue vs Purchases vs Profit) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-700" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              {language === 'hi'
                ? `${periodType === 'monthly' ? 'माह-वार' : periodType === 'quarterly' ? 'तिमाही' : 'वार्षिक'} तुलनात्मक चार्ट`
                : `${periodType.toUpperCase()} Financial Comparison`}
            </h3>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              {language === 'hi' ? 'बिक्री' : 'Sales'}
            </span>
            <span className="flex items-center gap-1 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              {language === 'hi' ? 'खरीद' : 'Cost'}
            </span>
            <span className="flex items-center gap-1 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              {language === 'hi' ? 'मुनाफ़ा' : 'Profit'}
            </span>
          </div>
        </div>

        {/* Multi-Bar Graph */}
        <div className="space-y-4 pt-2">
          {availablePeriods.map((p) => {
            const maxVal = Math.max(...availablePeriods.map((x) => x.total_sales)) || 1;
            const salesPct = Math.round((p.total_sales / maxVal) * 100);
            const costPct = Math.round((p.total_purchases / maxVal) * 100);
            const profitPct = Math.round((p.gross_profit / maxVal) * 100);
            const isCurrent = p.period_key === selectedPeriodKey;

            return (
              <div
                key={p.period_key}
                onClick={() => setSelectedPeriodKey(p.period_key)}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-50/50 border-blue-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <div className="flex items-center gap-2">
                    <span>{p.period_label}</span>
                    {isCurrent && (
                      <span className="text-[10px] bg-blue-700 text-white px-2 py-0.5 rounded-full">
                        {language === 'hi' ? 'चयनित' : 'Selected'}
                      </span>
                    )}
                  </div>
                  <span className="text-emerald-800 font-extrabold">
                    +₹{p.gross_profit.toLocaleString('en-IN')} ({p.profit_margin_pct}%)
                  </span>
                </div>

                {/* Triple Bars */}
                <div className="space-y-1.5">
                  {/* Sales Bar */}
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-12 text-slate-500 text-right">बिक्री</span>
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${salesPct}%` }}
                      />
                    </div>
                    <span className="w-20 text-right font-mono font-bold text-slate-800">
                      ₹{p.total_sales.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Purchases Cost Bar */}
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-12 text-slate-500 text-right">लागत</span>
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${costPct}%` }}
                      />
                    </div>
                    <span className="w-20 text-right font-mono font-bold text-slate-800">
                      ₹{p.total_purchases.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Profit Bar */}
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-12 text-slate-500 text-right font-bold text-emerald-800">मुनाफ़ा</span>
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all"
                        style={{ width: `${profitPct}%` }}
                      />
                    </div>
                    <span className="w-20 text-right font-mono font-black text-emerald-800">
                      ₹{p.gross_profit.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cash vs Credit Udhaar Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Cash Flow in Period */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-700" />
            <span>{language === 'hi' ? 'नकद व उधारी बिक्री विभाजन' : 'Cash vs Credit Sales'}</span>
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-600">{language === 'hi' ? '💵 नकद बिक्री (Cash/UPI)' : 'Cash / UPI Sales'}</span>
              <span className="font-extrabold text-emerald-800">
                ₹{activeStats.cash_sales.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-600">{language === 'hi' ? '📒 उधारी बिक्री (Credit)' : 'Credit Sales (Udhaar)'}</span>
              <span className="font-extrabold text-rose-700">
                ₹{activeStats.credit_sales.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-emerald-900 font-bold">{language === 'hi' ? '🤝 बाक़ी उधारी वसूली' : 'Recovered Outstanding'}</span>
              <span className="font-black text-emerald-800">
                ₹{activeStats.outstanding_collected.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* GST Net Tax Liability */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
            <Percent className="w-4 h-4 text-blue-700" />
            <span>{language === 'hi' ? 'GST टैक्स देनदारी (Tax Liability)' : 'GST Tax Liability'}</span>
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-600">{t.outputGstSales}</span>
              <span className="font-extrabold text-blue-700">
                ₹{activeStats.gst_collected_output.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-600">{t.inputGstPurchases}</span>
              <span className="font-extrabold text-emerald-800">
                - ₹{activeStats.gst_paid_input_itc.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-blue-900 font-bold">{t.netGstPayableGovt}</span>
              <span className="font-black text-blue-900">
                ₹{activeStats.net_gst_liability.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Share and Download Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={generateWhatsAppBusinessReport}
          className="bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
        >
          {copiedSummary ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'रिपोर्ट कॉपी हो गई!' : 'Report Copied!'}</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'व्हाट्सएप पर वित्तीय समरी भेजें' : 'Share Financial Summary on WhatsApp'}</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            const csvContent =
              'data:text/csv;charset=utf-8,' +
              ['Period,Type,Total Sales,Purchases COGS,Gross Profit,Margin %,Cash Sales,Credit Sales,Net GST'].concat(
                SAMPLE_PERIOD_STATS.map(
                  (p) =>
                    `"${p.period_label}","${p.period_type}",${p.total_sales},${p.total_purchases},${p.gross_profit},${p.profit_margin_pct},${p.cash_sales},${p.credit_sales},${p.net_gst_liability}`
                )
              ).join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `Vyapar_Financial_Report_${periodType}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="bg-white hover:bg-slate-50 active:scale-98 text-slate-800 font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-200 shadow-xs transition cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
          <span>{t.downloadReport}</span>
        </button>
      </div>
    </div>
  );
};
