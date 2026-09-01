import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Receipt,
  Printer,
  Share2,
  CheckCircle2,
  TrendingUp,
  Percent,
  Calculator,
  UserCheck
} from 'lucide-react';
import { Customer, Language, SalesInvoice, SalesInvoiceItem, GstSettings } from '../types';
import { getTranslation } from '../locales/i18n';
import { GST_SLABS, getGstBreakdown, INDIAN_STATES_GST } from '../data/gstData';

interface CreateSalesInvoiceModalProps {
  language: Language;
  customers: Customer[];
  defaultCustomer?: Customer | null;
  gstSettings: GstSettings;
  onClose: () => void;
  onSaveSale: (sale: Partial<SalesInvoice>) => void;
}

export const CreateSalesInvoiceModal: React.FC<CreateSalesInvoiceModalProps> = ({
  language,
  customers,
  defaultCustomer,
  gstSettings,
  onClose,
  onSaveSale,
}) => {
  const t = getTranslation(language);

  // Bill Meta
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    defaultCustomer?.id || ''
  );
  const [walkinName, setWalkinName] = useState(
    defaultCustomer?.name || 'नकद ग्राहक (Cash Walk-in)'
  );
  const [customerPhone, setCustomerPhone] = useState(
    defaultCustomer?.phone || ''
  );
  const [customerState, setCustomerState] = useState(
    defaultCustomer?.state || `${gstSettings.shop_state_code} - ${gstSettings.shop_state_name}`
  );
  const [customerGstin, setCustomerGstin] = useState(
    defaultCustomer?.gstin || ''
  );
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [pricingMode, setPricingMode] = useState<'inclusive' | 'exclusive' | 'exempt'>(
    gstSettings.default_pricing_mode || 'inclusive'
  );

  // Line items
  const [items, setItems] = useState<SalesInvoiceItem[]>([
    {
      name: 'उत्तम शुगर एम-30 (1kg)',
      quantity: 2,
      unit: 'kg',
      rate: 48,
      cost_price: 42,
      gst_rate: 5,
      hsn: '1701',
      taxable_amount: 91.43,
      gst_amount: 4.57,
      total: 96,
    },
    {
      name: 'फॉर्च्यून रिफाइंड तेल 1L',
      quantity: 1,
      unit: 'पाउच',
      rate: 145,
      cost_price: 125,
      gst_rate: 5,
      hsn: '1507',
      taxable_amount: 138.1,
      gst_amount: 6.9,
      total: 145,
    },
  ]);

  // Payment details
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'credit' | 'split'>('cash');
  const [paidAmount, setPaidAmount] = useState<string>('241');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  // Update customer when selection changes
  useEffect(() => {
    if (selectedCustomerId) {
      const c = customers.find((cust) => cust.id === selectedCustomerId);
      if (c) {
        setWalkinName(c.name);
        setCustomerPhone(c.phone);
        setCustomerState(c.state || `${gstSettings.shop_state_code} - ${gstSettings.shop_state_name}`);
        setCustomerGstin(c.gstin || '');
      }
    }
  }, [selectedCustomerId, customers, gstSettings]);

  // Calculations
  const customerStateCode = customerState.slice(0, 2);
  const isIntraState = customerStateCode === gstSettings.shop_state_code;

  let totalTaxable = 0;
  let totalGstAmount = 0;
  let totalCostPrice = 0;
  let rawGrandTotal = 0;

  const calculatedItems = items.map((it) => {
    const lineGross = (it.quantity || 1) * (it.rate || 0);
    const lineCost = (it.quantity || 1) * (it.cost_price || 0);
    totalCostPrice += lineCost;

    if (pricingMode === 'exempt' || it.gst_rate === 0) {
      totalTaxable += lineGross;
      rawGrandTotal += lineGross;
      return {
        ...it,
        taxable_amount: lineGross,
        gst_amount: 0,
        total: lineGross,
      };
    } else if (pricingMode === 'inclusive') {
      const taxable = (lineGross * 100) / (100 + it.gst_rate);
      const gst = lineGross - taxable;
      totalTaxable += taxable;
      totalGstAmount += gst;
      rawGrandTotal += lineGross;
      return {
        ...it,
        taxable_amount: Math.round(taxable * 100) / 100,
        gst_amount: Math.round(gst * 100) / 100,
        total: lineGross,
      };
    } else {
      // Exclusive
      const gst = (lineGross * it.gst_rate) / 100;
      const total = lineGross + gst;
      totalTaxable += lineGross;
      totalGstAmount += gst;
      rawGrandTotal += total;
      return {
        ...it,
        taxable_amount: lineGross,
        gst_amount: Math.round(gst * 100) / 100,
        total: Math.round(total * 100) / 100,
      };
    }
  });

  const finalGrandTotal = Math.max(0, Math.round(rawGrandTotal - discountAmount));
  const cgstAmount = isIntraState ? Math.round((totalGstAmount / 2) * 100) / 100 : 0;
  const sgstAmount = isIntraState ? Math.round((totalGstAmount / 2) * 100) / 100 : 0;
  const igstAmount = !isIntraState ? Math.round(totalGstAmount * 100) / 100 : 0;

  // Profit calculation
  const grossProfit = Math.round(finalGrandTotal - totalGstAmount - totalCostPrice);
  const profitMarginPct =
    finalGrandTotal > 0 ? Math.round((grossProfit / finalGrandTotal) * 100 * 10) / 10 : 0;

  // Keep paid amount in sync if cash
  useEffect(() => {
    if (paymentMode === 'cash' || paymentMode === 'upi') {
      setPaidAmount(String(finalGrandTotal));
    } else if (paymentMode === 'credit') {
      setPaidAmount('0');
    }
  }, [finalGrandTotal, paymentMode]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        name: '',
        quantity: 1,
        unit: 'पैकेट',
        rate: 100,
        cost_price: 80,
        gst_rate: 18,
        hsn: '1905',
        taxable_amount: 84.75,
        gst_amount: 15.25,
        total: 100,
      },
    ]);
  };

  const handleItemChange = (index: number, field: keyof SalesInvoiceItem, val: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = val;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paid = Number(paidAmount) || 0;
    const due = Math.max(0, finalGrandTotal - paid);

    onSaveSale({
      customer_id: selectedCustomerId || undefined,
      customer_name: walkinName.trim() || 'Cash Customer',
      customer_phone: customerPhone.trim(),
      customer_gstin: customerGstin.trim().toUpperCase(),
      customer_state: customerState,
      shop_state: `${gstSettings.shop_state_code} - ${gstSettings.shop_state_name}`,
      invoice_date: invoiceDate,
      supply_type: isIntraState ? 'intra_state' : 'inter_state',
      gst_pricing_mode: pricingMode,
      items: calculatedItems,
      subtotal_taxable: Math.round(totalTaxable * 100) / 100,
      cgst: cgstAmount,
      sgst: sgstAmount,
      igst: igstAmount,
      total_gst: Math.round(totalGstAmount * 100) / 100,
      discount_amount: discountAmount,
      round_off: 0,
      grand_total: finalGrandTotal,
      total_cost_price: Math.round(totalCostPrice),
      profit_amount: grossProfit,
      profit_margin_pct: profitMarginPct,
      payment_mode: paymentMode,
      paid_amount: paid,
      due_amount: due,
      status: due === 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid',
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{t.createSalesBill}</h3>
              <p className="text-xs text-slate-500 font-mono">
                {isIntraState
                  ? `${gstSettings.shop_state_name} (${t.intraStateGst})`
                  : `${customerState.split('-')[1] || customerState} (${t.interStateGst} - IGST)`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Customer Selection & Bill Info */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {language === 'hi' ? 'ग्राहक चुनें (या नया नाम डालें)' : 'Select Customer / Party'}
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
                >
                  <option value="">-- नकद वॉक-इन ग्राहक (Walk-in Cash) --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.outstanding_balance > 0 ? `(बाक़ी: ₹${c.outstanding_balance})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">{t.customerName}</label>
                <input
                  type="text"
                  required
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-slate-700 font-bold mb-1">{t.customerPhone}</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">{t.customerState}</label>
                <select
                  value={customerState}
                  onChange={(e) => setCustomerState(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
                >
                  {INDIAN_STATES_GST.map((s) => (
                    <option key={s.code} value={`${s.code} - ${s.name}`}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">{t.date}</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            {/* GST Pricing Mode Toggle for Shopkeeper */}
            <div className="pt-1 flex items-center justify-between">
              <span className="font-bold text-slate-700 text-xs">
                {language === 'hi' ? 'GST टैक्स मोड:' : 'GST Pricing Mode:'}
              </span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPricingMode('inclusive')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    pricingMode === 'inclusive'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t.taxInclusive}
                </button>
                <button
                  type="button"
                  onClick={() => setPricingMode('exclusive')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    pricingMode === 'exclusive'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t.taxExclusive}
                </button>
                <button
                  type="button"
                  onClick={() => setPricingMode('exempt')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    pricingMode === 'exempt'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t.nonGstBill}
                </button>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-xs">{t.itemsList}</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-1 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addItem}</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {items.map((item, idx) => {
                const lineTotal = (item.quantity || 1) * (item.rate || 0);
                const lineProfit = lineTotal - (item.quantity || 1) * (item.cost_price || 0);

                return (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        required
                        placeholder={language === 'hi' ? 'सामान का नाम (उदा. आशीर्वाद आटा)' : 'Item name'}
                        value={item.name}
                        onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        disabled={items.length <= 1}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 items-center">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">{t.qty}</span>
                        <input
                          type="number"
                          min="0.1"
                          step="any"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-bold text-center"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">{t.sellingPrice} (₹)</span>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(idx, 'rate', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-bold text-center"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">{t.costPrice} (₹)</span>
                        <input
                          type="number"
                          value={item.cost_price}
                          onChange={(e) => handleItemChange(idx, 'cost_price', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 text-center"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">GST Slab</span>
                        <select
                          value={item.gst_rate}
                          onChange={(e) => handleItemChange(idx, 'gst_rate', Number(e.target.value))}
                          className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-bold cursor-pointer"
                        >
                          <option value="0">0% (कर मुक्त)</option>
                          <option value="5">5% (आवश्यक)</option>
                          <option value="12">12% (खाद्य)</option>
                          <option value="18">18% (FMCG)</option>
                          <option value="28">28% (लक्जरी)</option>
                        </select>
                      </div>

                      <div className="col-span-4 sm:col-span-1 text-right">
                        <span className="text-[10px] text-slate-400 font-bold block">{t.total}</span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          ₹{lineTotal.toLocaleString('en-IN')}
                        </span>
                        <div className="text-[10px] text-emerald-700 font-bold">
                          +{language === 'hi' ? 'मुनाफ़ा' : 'Profit'} ₹{lineProfit}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Profit & GST Breakdown Bar */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold">{t.amount}</span>
                <div className="text-2xl font-black text-white">
                  ₹{finalGrandTotal.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="text-right bg-emerald-950/80 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl">
                <div className="text-[10px] text-emerald-300 uppercase font-bold flex items-center gap-1 justify-end">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span>{t.grossProfit} ({profitMarginPct}%)</span>
                </div>
                <div className="text-lg font-black text-emerald-400">
                  ₹{grossProfit.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* GST Summary mini line */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-800 text-slate-300">
              <div>
                <span className="text-[10px] text-slate-400 block">Taxable Value</span>
                <span className="font-bold">₹{Math.round(totalTaxable).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {isIntraState ? 'CGST + SGST' : 'IGST'}
                </span>
                <span className="font-bold text-blue-300">
                  ₹{Math.round(totalGstAmount).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">खरीद लागत (Cost)</span>
                <span className="font-bold text-amber-300">
                  ₹{Math.round(totalCostPrice).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Mode Selector */}
          <div className="space-y-2">
            <label className="block text-slate-700 font-bold">{t.paymentMode}</label>
            <div className="grid grid-cols-4 gap-2">
              {(['cash', 'upi', 'credit', 'split'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  className={`py-2.5 px-2 rounded-xl font-bold text-center border cursor-pointer capitalize text-xs ${
                    paymentMode === mode
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {mode === 'cash'
                    ? '💵 नकद'
                    : mode === 'upi'
                    ? '📱 UPI'
                    : mode === 'credit'
                    ? '📒 उधारी (Khata)'
                    : 'Split'}
                </button>
              ))}
            </div>

            {/* Paid & Due Inputs if partial / credit */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-slate-600 font-bold mb-0.5">
                  {language === 'hi' ? 'प्राप्त रकम (Paid)' : 'Amount Paid (₹)'}
                </label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-0.5">
                  {language === 'hi' ? 'बाक़ी रकम (Due / Udhaar)' : 'Balance Due (₹)'}
                </label>
                <input
                  type="text"
                  disabled
                  value={`₹${Math.max(0, finalGrandTotal - (Number(paidAmount) || 0))}`}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-black text-rose-700"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-2 py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              <span>{language === 'hi' ? 'बिल जारी करें व खाते में जोड़ें ✓' : 'Issue Bill & Post to Ledger ✓'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
