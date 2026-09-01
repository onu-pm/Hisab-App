import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Share2,
  PieChart,
  TrendingUp,
  Building,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Receipt
} from 'lucide-react';
import { LedgerSummary, Vendor, Language, Invoice } from '../types';
import { getTranslation } from '../locales/i18n';

interface GstAnalyticsViewProps {
  language: Language;
  summary: LedgerSummary | null;
  vendors: Vendor[];
  invoices: Invoice[];
}

export const GstAnalyticsView: React.FC<GstAnalyticsViewProps> = ({
  language,
  summary,
  vendors,
  invoices,
}) => {
  const t = getTranslation(language);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const totalGst = summary?.total_gst_itc || 0;
  const cgst = Math.round(totalGst / 2);
  const sgst = Math.round(totalGst / 2);
  const igst = 0;

  const topVendors = summary?.top_vendors || [];
  const totalSpend = summary?.total_spend || 1;

  const generateWhatsAppSummary = () => {
    const text = `📊 *व्यापार बिल - मासिक बहीखाता रिपोर्ट (Monthly Ledger)*
🏪 *दुकान:* गुप्ता किराना एवं जनरल स्टोर्स, कानपुर
📅 *अवधि:* अगस्त-सितंबर 2026

💰 *कुल खरीदारी (Total Purchases):* ₹${(summary?.total_spend || 0).toLocaleString('en-IN')}
🧾 *कुल दर्ज बिल:* ${invoices.length}

🟢 *GST इनपुट टैक्स क्रेडिट (ITC Claimable):*
• CGST (केन्द्र): ₹${cgst.toLocaleString('en-IN')}
• SGST (राज्य): ₹${sgst.toLocaleString('en-IN')}
• *कुल GST क्लेम:* ₹${totalGst.toLocaleString('en-IN')}

🏢 *मुख्य सप्लायर हिसाब:*
${topVendors.slice(0, 4).map((v) => `• ${v.vendor_name}: ₹${v.total_spend.toLocaleString('en-IN')} (${v.invoice_count} बिल)`).join('\n')}

_व्यापार बिल ऑटो-कैप्चर द्वारा तैयार_`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* GST Input Tax Credit Highlight Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">{t.gstSummaryTitle}</h3>
              <p className="text-xs text-blue-700 font-mono">GSTR-3B Table 4(A)(5) ITC Eligible</p>
            </div>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-bold">
            100% Reconciled
          </span>
        </div>

        {/* GST ITC Grand Total */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">{t.claimableGst}</span>
            <div className="text-2xl sm:text-3xl font-black text-blue-700">
              ₹{totalGst.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <span>{invoices.filter((i) => i.gst_amount > 0).length} GST {t.filterGst}</span>
          </div>
        </div>

        {/* Breakdown Grid (CGST / SGST / IGST) */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-bold">{t.cgst}</span>
            <div className="font-extrabold text-slate-800 text-sm">₹{cgst.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-bold">{t.sgst}</span>
            <div className="font-extrabold text-slate-800 text-sm">₹{sgst.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-bold">{t.igst}</span>
            <div className="font-extrabold text-slate-800 text-sm">₹{igst}</div>
          </div>
        </div>
      </div>

      {/* Top Vendors Spend Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building className="w-5 h-5 text-emerald-700" />
            <h3 className="font-extrabold text-slate-900 text-base">{t.topVendors}</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {topVendors.length} {language === 'hi' ? 'सप्लायर' : 'Suppliers'}
          </span>
        </div>

        <div className="space-y-2.5">
          {topVendors.map((vendor, idx) => {
            const sharePct = Math.round((vendor.total_spend / totalSpend) * 100);
            return (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-800">{vendor.vendor_name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-800 text-sm">
                      ₹{vendor.total_spend.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${sharePct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono w-10 text-right">
                    {sharePct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share / Export Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={generateWhatsAppSummary}
          className="bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
        >
          {copiedSummary ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'समरी कॉपी हो गई!' : 'Summary Copied!'}</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>{t.shareLedgerWhatsapp}</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            const csvContent =
              'data:text/csv;charset=utf-8,' +
              ['Invoice ID,Vendor,Date,Amount,GST,Status'].concat(
                invoices.map(
                  (i) =>
                    `"${i.id}","${i.vendor_name}","${i.invoice_date}",${i.amount},${i.gst_amount},"${i.status}"`
                )
              ).join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `Vyapar_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="bg-white hover:bg-slate-50 active:scale-98 text-slate-800 font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-200 shadow-xs transition"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
          <span>{t.downloadReport}</span>
        </button>
      </div>
    </div>
  );
};
