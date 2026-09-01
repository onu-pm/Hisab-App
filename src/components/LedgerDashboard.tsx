import React, { useState } from 'react';
import {
  Search,
  Filter,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Calendar,
  Share2,
  Camera,
  Mail,
  IndianRupee,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Invoice, InvoiceStatus, Language, LedgerSummary, Vendor } from '../types';
import { getTranslation } from '../locales/i18n';

interface LedgerDashboardProps {
  language: Language;
  invoices: Invoice[];
  summary: LedgerSummary | null;
  vendors: Vendor[];
  onOpenReview: (invoice: Invoice) => void;
  onOpenCaptureTab: () => void;
}

export const LedgerDashboard: React.FC<LedgerDashboardProps> = ({
  language,
  invoices,
  summary,
  vendors,
  onOpenReview,
  onOpenCaptureTab,
}) => {
  const t = getTranslation(language);

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending_review' | 'confirmed' | 'gst' | 'duplicate'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('all');

  // Filtered invoices logic
  const filteredInvoices = invoices.filter((inv) => {
    // Status filter
    if (activeFilter === 'pending_review' && inv.status !== 'pending_review') return false;
    if (activeFilter === 'confirmed' && inv.status !== 'confirmed') return false;
    if (activeFilter === 'duplicate' && inv.status !== 'duplicate_flagged') return false;
    if (activeFilter === 'gst' && (!inv.gst_amount || inv.gst_amount <= 0)) return false;

    // Vendor filter
    if (selectedVendor !== 'all' && inv.vendor_normalized_name !== selectedVendor && inv.vendor_name !== selectedVendor) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchVendor = inv.vendor_name.toLowerCase().includes(q);
      const matchBillNo = inv.invoice_number.toLowerCase().includes(q);
      const matchAmount = String(inv.amount).includes(q);
      const matchGstin = inv.gst_number?.toLowerCase().includes(q);
      if (!matchVendor && !matchBillNo && !matchAmount && !matchGstin) return false;
    }

    return true;
  });

  const getSourceIcon = (channel: string) => {
    switch (channel) {
      case 'share_sheet':
        return <Share2 className="w-3.5 h-3.5 text-emerald-700" />;
      case 'camera_scan':
        return <Camera className="w-3.5 h-3.5 text-amber-700" />;
      case 'email_inbound':
        return <Mail className="w-3.5 h-3.5 text-blue-700" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Ledger Metric Cards (Clean Utility Minimal) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {/* Total Spend */}
        <div className="bg-white border border-slate-200 p-3.5 sm:p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>{t.totalSpend}</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center">
            <span className="text-emerald-700 font-bold mr-0.5">₹</span>
            {(summary?.total_spend || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            {invoices.length} {t.totalInvoices}
          </p>
        </div>

        {/* Claimable GST Credit (ITC) */}
        <div className="bg-white border border-blue-200/80 p-3.5 sm:p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-blue-800 text-xs font-bold">
            <span>{t.claimableGst}</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200/60 px-1.5 py-0.5 rounded font-mono">ITC</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-blue-900 flex items-center">
            <span className="text-blue-700 font-bold mr-0.5">₹</span>
            {(summary?.total_gst_itc || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-blue-700 font-medium">
            {language === 'hi' ? 'टैक्स बचत योग्य' : 'Input Tax Credit'}
          </p>
        </div>

        {/* Pending Review Badge Card */}
        <div
          onClick={() => setActiveFilter('pending_review')}
          className={`col-span-2 sm:col-span-1 border p-3.5 sm:p-4 rounded-2xl space-y-1 shadow-xs cursor-pointer transition ${
            (summary?.pending_review_count || 0) > 0
              ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-50'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-amber-900 text-xs font-bold">
            <span>{t.pendingReview}</span>
            <AlertTriangle className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-900 flex items-center justify-between">
            <span>{summary?.pending_review_count || 0}</span>
            {(summary?.pending_review_count || 0) > 0 && (
              <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold">
                {language === 'hi' ? 'जाँचें' : 'Action'}
              </span>
            )}
          </div>
          <p className="text-[10px] text-amber-800 font-medium">
            {language === 'hi' ? '1-टैप में पुष्टि करें' : 'Needs merchant confirmation'}
          </p>
        </div>
      </div>

      {/* Search Bar & Vendor Dropdown */}
      <div className="space-y-2 bg-white border border-slate-200 p-3 rounded-2xl shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition"
          />
        </div>

        {/* Filter Chips Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t.filterAll} ({invoices.length})
          </button>

          <button
            onClick={() => setActiveFilter('pending_review')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1 ${
              activeFilter === 'pending_review'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            <span>{t.filterReview}</span>
            <span>({invoices.filter((i) => i.status === 'pending_review').length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('confirmed')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1 ${
              activeFilter === 'confirmed'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>{t.filterConfirmed}</span>
          </button>

          <button
            onClick={() => setActiveFilter('gst')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeFilter === 'gst'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            {t.filterGst}
          </button>

          {invoices.some((i) => i.status === 'duplicate_flagged') && (
            <button
              onClick={() => setActiveFilter('duplicate')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1 ${
                activeFilter === 'duplicate'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-rose-700" />
              <span>{t.filterDuplicate}</span>
            </button>
          )}
        </div>
      </div>

      {/* Invoice List Cards */}
      <div className="space-y-2.5">
        {filteredInvoices.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-base">{t.noInvoicesFound}</h4>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'hi'
                  ? 'व्हाट्सएप से शेयर करें या कैमरे से फोटो खींचकर बिल तुरंत जोड़ें।'
                  : 'Share invoice via WhatsApp or snap with camera to auto-capture.'}
              </p>
            </div>
            <button
              onClick={onOpenCaptureTab}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.quickCapture}</span>
            </button>
          </div>
        ) : (
          filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              onClick={() => onOpenReview(inv)}
              className={`bg-white border rounded-2xl p-3.5 sm:p-4 transition shadow-xs hover:border-emerald-500/80 cursor-pointer space-y-3 group ${
                inv.status === 'pending_review'
                  ? 'border-amber-300 bg-amber-50/30'
                  : inv.status === 'duplicate_flagged'
                  ? 'border-rose-300 bg-rose-50/30'
                  : 'border-slate-200'
              }`}
            >
              {/* Card Top Row: Vendor & Amount */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="w-12 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                    <img
                      src={inv.raw_image_url}
                      alt={inv.vendor_name}
                      className="w-full h-full object-cover object-top filter group-hover:scale-105 transition"
                    />
                    <div className="absolute bottom-0 right-0 p-1 bg-white/95 rounded-tl-lg shadow-xs">
                      {getSourceIcon(inv.source_channel)}
                    </div>
                  </div>

                  {/* Vendor Details */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-emerald-800 transition">
                        {inv.vendor_name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {inv.invoice_date}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-slate-700">{inv.invoice_number}</span>
                    </div>

                    {inv.gst_number && (
                      <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        GST: {inv.gst_number}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount & ITC Pill */}
                <div className="text-right space-y-1">
                  <div className="text-base sm:text-lg font-extrabold text-emerald-800">
                    ₹{inv.amount.toLocaleString('en-IN')}
                  </div>
                  {inv.gst_amount > 0 && (
                    <div className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full inline-block">
                      +{inv.gst_amount.toFixed(0)} {t.inputGstCredit}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Bottom Row: Items count, Confidence, Status Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px]">
                    {inv.items?.length || 1} {t.itemsCount}
                  </span>

                  {/* Confidence pill */}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      inv.extraction_confidence >= 0.85
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {Math.round(inv.extraction_confidence * 100)}% AI
                  </span>
                </div>

                {/* Status Badge & Review Button */}
                <div className="flex items-center gap-2">
                  {inv.status === 'pending_review' ? (
                    <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] px-3 py-1 rounded-xl flex items-center gap-1 shadow-xs transition">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{t.reviewBill}</span>
                    </button>
                  ) : inv.status === 'duplicate_flagged' ? (
                    <span className="text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full font-bold text-[11px] border border-rose-200">
                      {t.duplicateBadge}
                    </span>
                  ) : (
                    <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold text-[11px] border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>{t.confirmedBadge}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
