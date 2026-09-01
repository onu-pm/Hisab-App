import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  AlertTriangle,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Plus,
  Trash2,
  Save,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { Invoice, ExtractedFields, Language, InvoiceItem } from '../types';
import { getTranslation } from '../locales/i18n';
import { speakGuidance } from '../utils/audioGuide';

interface ReviewCorrectionModalProps {
  language: Language;
  invoice: Invoice;
  onClose: () => void;
  onConfirmAndSave: (invoiceId: string, updatedFields: Partial<Invoice>, originalFields?: any) => void;
  onDiscardDuplicate?: (invoiceId: string) => void;
}

export const ReviewCorrectionModal: React.FC<ReviewCorrectionModalProps> = ({
  language,
  invoice,
  onClose,
  onConfirmAndSave,
  onDiscardDuplicate,
}) => {
  const t = getTranslation(language);

  // Form State initialized from invoice/extracted_data
  const [vendorName, setVendorName] = useState(invoice.vendor_name || '');
  const [invoiceNumber, setInvoiceNumber] = useState(invoice.invoice_number || '');
  const [invoiceDate, setInvoiceDate] = useState(invoice.invoice_date || '');
  const [amount, setAmount] = useState<number>(invoice.amount || 0);
  const [gstAmount, setGstAmount] = useState<number>(invoice.gst_amount || 0);
  const [gstNumber, setGstNumber] = useState(invoice.gst_number || '');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid' | 'credit' | 'partial'>(
    invoice.payment_status || 'paid'
  );
  const [items, setItems] = useState<InvoiceItem[]>(
    invoice.items && invoice.items.length > 0
      ? invoice.items
      : [{ name: 'Grocery Supplies', quantity: 1, rate: invoice.amount, total: invoice.amount }]
  );

  // Image viewer zoom & rotation state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Track if any field was modified by the user (for correction logs)
  const [hasEdits, setHasEdits] = useState(false);
  const [isDuplicateAlertAcknowledged, setIsDuplicateAlertAcknowledged] = useState(
    !invoice.is_duplicate
  );

  // Confidence calculations
  const confidence = invoice.extraction_confidence || 0.85;
  const isHighConf = confidence >= 0.85;

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    setHasEdits(true);
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };

    // Auto calculate line total if qty & rate change
    if (field === 'quantity' || field === 'rate') {
      const q = field === 'quantity' ? Number(value) : updated[index].quantity || 1;
      const r = field === 'rate' ? Number(value) : updated[index].rate || 0;
      if (q && r) {
        updated[index].total = q * r;
      }
    }
    setItems(updated);
  };

  const handleAddItem = () => {
    setHasEdits(true);
    setItems([...items, { name: '', quantity: 1, rate: 0, total: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setHasEdits(true);
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const originalFields = invoice.extracted_data || {
      vendor_name: invoice.vendor_name,
      invoice_number: invoice.invoice_number,
      invoice_date: invoice.invoice_date,
      amount: invoice.amount,
      gst_amount: invoice.gst_amount,
      gst_number: invoice.gst_number,
      payment_status: invoice.payment_status,
      items: invoice.items,
    };

    const updatedFields: Partial<Invoice> = {
      vendor_name: vendorName,
      invoice_number: invoiceNumber,
      invoice_date: invoiceDate,
      amount: Number(amount) || 0,
      gst_amount: Number(gstAmount) || 0,
      cgst: (Number(gstAmount) || 0) / 2,
      sgst: (Number(gstAmount) || 0) / 2,
      gst_number: gstNumber,
      payment_status: paymentStatus,
      items,
      status: 'confirmed',
      corrections_applied: hasEdits,
      is_duplicate: false, // User explicitly confirmed this invoice
    };

    onConfirmAndSave(invoice.id, updatedFields, originalFields);
  };

  const handleVoiceHelp = () => {
    const helpMsg =
      language === 'hi'
        ? `यह बिल सप्लायर ${vendorName || 'अज्ञात'} का है। कुल रकम ₹${amount} है। यदि सब सही है, तो नीचे दिए गए हरे बटन 'पुष्टि करें' पर दबाएं।`
        : `This invoice is from ${vendorName || 'Unknown'}. Total amount is ₹${amount}. If all details are correct, tap the green Confirm button below.`;
    speakGuidance(helpMsg, language);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-white px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">{t.reviewTitle}</h3>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'दुकानदार बहीखाता प्रविष्टि' : 'Invoice verification & ledger posting'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Voice Guide Button */}
            <button
              onClick={handleVoiceHelp}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-emerald-800 rounded-xl transition flex items-center gap-1.5 text-xs font-bold border border-slate-200"
              title={t.audioGuide}
            >
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">{t.audioGuide}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Duplicate Warning Banner (If Hash Match Detected) */}
        {invoice.is_duplicate && !isDuplicateAlertAcknowledged && (
          <div className="bg-amber-50 border-b border-amber-200 p-4 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-amber-800 text-sm">{t.duplicateWarningTitle}</h4>
                <p className="text-xs text-amber-700 leading-snug">{t.duplicateWarningDesc}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onDiscardDuplicate && (
                <button
                  onClick={() => onDiscardDuplicate(invoice.id)}
                  className="bg-white hover:bg-slate-100 text-rose-700 text-xs px-3 py-1.5 rounded-xl font-bold transition border border-rose-200"
                >
                  {t.discardThis}
                </button>
              )}
              <button
                onClick={() => setIsDuplicateAlertAcknowledged(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3.5 py-1.5 rounded-xl font-bold transition"
              >
                {t.keepBoth}
              </button>
            </div>
          </div>
        )}

        {/* Split Container: Left = Original Image, Right = Editable Inputs */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* LEFT SIDE: Original Document Image Viewer (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 p-4 flex flex-col items-center justify-between space-y-3">
            <div className="w-full flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold flex items-center gap-1.5 text-slate-700">
                <span>{t.originalBill}</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono uppercase">
                  {invoice.source_channel.replace('_', ' ')}
                </span>
              </span>

              {/* Zoom & Rotate Controls */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
                <button
                  onClick={() => setZoomLevel(Math.max(0.7, zoomLevel - 0.2))}
                  className="p-1 text-slate-500 hover:text-slate-800 rounded"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono px-1 text-slate-700">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(2.5, zoomLevel + 0.2))}
                  className="p-1 text-slate-500 hover:text-slate-800 rounded"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="p-1 text-slate-500 hover:text-slate-800 rounded ml-1 border-l border-slate-200"
                  title="Rotate"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Image Preview Box */}
            <div className="w-full flex-1 min-h-[280px] lg:min-h-[420px] bg-slate-200/60 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center p-2 relative">
              <div
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease-out',
                }}
                className="max-w-full max-h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                <img
                  src={invoice.raw_image_url}
                  alt="Original Document"
                  className="max-h-[380px] object-contain rounded-lg shadow-sm"
                />
              </div>

              {/* Confidence Meter Badge in Image Corner */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-mono shadow-2xs">
                <span className="text-slate-500">{t.confidenceScore}</span>
                <span
                  className={`font-bold ${
                    isHighConf ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {Math.round(confidence * 100)}%
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              {language === 'hi' ? 'फोटो को बड़ा करके देखने के लिए ज़ूम बटन का उपयोग करें' : 'Use zoom controls to inspect small handwritten figures'}
            </p>
          </div>

          {/* RIGHT SIDE: Editable Extracted Fields (7 cols) */}
          <div className="lg:col-span-7 p-5 space-y-4 bg-white overflow-y-auto">
            {/* Header info */}
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">{t.extractedDetails}</h4>
              {hasEdits && (
                <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                  {language === 'hi' ? 'संशोधित (Edited)' : 'Modified'}
                </span>
              )}
            </div>

            {/* Main Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Vendor / Supplier Name */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>{t.vendorName}</span>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold">
                    {Math.round((invoice.extracted_data?.vendor_name_confidence || 0.9) * 100)}% match
                  </span>
                </label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => {
                    setVendorName(e.target.value);
                    setHasEdits(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold text-sm focus:outline-none transition"
                  placeholder="सप्लायर का नाम"
                />
              </div>

              {/* Invoice Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{t.invoiceDate}</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => {
                    setInvoiceDate(e.target.value);
                    setHasEdits(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold text-sm focus:outline-none transition"
                />
              </div>

              {/* Invoice Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{t.invoiceNumber}</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => {
                    setInvoiceNumber(e.target.value);
                    setHasEdits(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold text-sm focus:outline-none transition"
                  placeholder="Bill/Slip No"
                />
              </div>

              {/* Total Amount (Large Touch Target) */}
              <div className="space-y-1 bg-emerald-50/40 p-3 rounded-xl border border-emerald-200">
                <label className="text-xs font-bold text-emerald-800">{t.totalAmount}</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 font-bold text-base">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(Number(e.target.value));
                      setHasEdits(true);
                    }}
                    className="w-full bg-white border border-emerald-300 focus:border-emerald-600 rounded-lg pl-7 pr-3 py-2 text-emerald-800 font-extrabold text-lg focus:outline-none transition"
                  />
                </div>
              </div>

              {/* GST Amount */}
              <div className="space-y-1 bg-blue-50/40 p-3 rounded-xl border border-blue-200">
                <label className="text-xs font-bold text-blue-800">{t.gstAmount}</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 font-bold text-base">₹</span>
                  <input
                    type="number"
                    value={gstAmount}
                    onChange={(e) => {
                      setGstAmount(Number(e.target.value));
                      setHasEdits(true);
                    }}
                    className="w-full bg-white border border-blue-300 focus:border-blue-600 rounded-lg pl-7 pr-3 py-2 text-blue-800 font-extrabold text-lg focus:outline-none transition"
                  />
                </div>
              </div>

              {/* GSTIN */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{t.gstin}</label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => {
                    setGstNumber(e.target.value.toUpperCase());
                    setHasEdits(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-semibold text-xs focus:outline-none transition uppercase"
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>

              {/* Payment Status Pill Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'hi' ? 'भुगतान स्थिति' : 'Payment Status'}
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['paid', 'credit', 'partial'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setPaymentStatus(st);
                        setHasEdits(true);
                      }}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border transition text-center ${
                        paymentStatus === st
                          ? st === 'paid'
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                            : st === 'credit'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                            : 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st === 'paid'
                        ? language === 'hi' ? 'नकद (Paid)' : 'Paid'
                        : st === 'credit'
                        ? language === 'hi' ? 'उधार (Credit)' : 'Credit'
                        : language === 'hi' ? 'आंशिक' : 'Partial'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Items Breakdown Table */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">{t.itemsList}</label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.addItem}</span>
                </button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs items-center"
                  >
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                      placeholder="आइटम का नाम"
                      className="col-span-5 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-900 focus:outline-none"
                    />
                    <input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                      placeholder="Qty"
                      className="col-span-2 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-900 text-center focus:outline-none"
                    />
                    <input
                      type="number"
                      value={item.rate || ''}
                      onChange={(e) => handleItemChange(idx, 'rate', Number(e.target.value))}
                      placeholder="Rate"
                      className="col-span-2 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-900 text-center focus:outline-none"
                    />
                    <div className="col-span-2 font-bold text-slate-900 text-right pr-1">
                      ₹{item.total || 0}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="col-span-1 text-slate-400 hover:text-rose-600 p-1 flex justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Fine-Tuning Logging Note */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.loggedForImprovement}</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="bg-white px-5 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-5 py-3 rounded-xl transition border border-slate-200"
          >
            {t.cancel}
          </button>

          <button
            id="confirm-invoice-btn"
            onClick={handleSave}
            className="bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-sm px-7 py-3 rounded-xl flex items-center gap-2 shadow-xs transition"
          >
            <Check className="w-5 h-5" />
            <span>{t.confirmAndSave}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
