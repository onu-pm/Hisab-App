import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  ArrowUpRight,
  ArrowDownLeft,
  Share2,
  CheckCircle2,
  Wallet,
  Building,
  CreditCard,
  History,
  X,
  FileText,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { Customer, CustomerPayment, Language, SalesInvoice } from '../types';
import { getTranslation } from '../locales/i18n';
import { INDIAN_STATES_GST } from '../data/gstData';

interface CustomersKhataViewProps {
  language: Language;
  customers: Customer[];
  sales: SalesInvoice[];
  payments: CustomerPayment[];
  onAddCustomer: (customer: Partial<Customer>) => void;
  onRecordPayment: (customerId: string, amount: number, mode: 'cash' | 'upi' | 'bank_transfer', notes?: string) => void;
  onCreateBillForCustomer: (customer: Customer) => void;
}

export const CustomersKhataView: React.FC<CustomersKhataViewProps> = ({
  language,
  customers,
  sales,
  payments,
  onAddCustomer,
  onRecordPayment,
  onCreateBillForCustomer,
}) => {
  const t = getTranslation(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'due' | 'wholesale'>('all');
  
  // Selected Customer for detail drawer/modal
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Add Customer Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');
  const [newCustomerState, setNewCustomerState] = useState('09 - Uttar Pradesh');
  const [newCustomerGstin, setNewCustomerGstin] = useState('');
  const [newCustomerType, setNewCustomerType] = useState<'regular' | 'wholesale' | 'retail'>('regular');
  const [newCustomerCreditLimit, setNewCustomerCreditLimit] = useState('10000');
  const [newCustomerOpeningBalance, setNewCustomerOpeningBalance] = useState('0');

  // Record Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'bank_transfer'>('cash');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentSuccessToast, setPaymentSuccessToast] = useState(false);

  // WhatsApp reminder feedback
  const [copiedReminderId, setCopiedReminderId] = useState<string | null>(null);

  const totalOutstanding = customers.reduce((sum, c) => sum + (c.outstanding_balance || 0), 0);
  const totalCustomersCount = customers.length;
  const customersWithDue = customers.filter((c) => c.outstanding_balance > 0).length;
  const thisMonthPayments = payments.reduce((sum, p) => sum + p.amount, 0);

  // Filtered list
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.city && c.city.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterType === 'due') return c.outstanding_balance > 0;
    if (filterType === 'wholesale') return c.customer_type === 'wholesale';
    return true;
  });

  const handleSendWhatsAppReminder = (customer: Customer) => {
    const text = `🙏 *नमस्ते ${customer.name} जी,*
🏪 *गुप्ता किराना एवं जनरल स्टोर्स, कानपुर*

आपके खाते में कुल बकाया उधारी: *₹${customer.outstanding_balance.toLocaleString('en-IN')}* है।
कृपया समय पर भुगतान करके सहयोग करें।

📱 *UPI द्वारा भुगतान करें:* 9839098210@upi
धन्यवाद!`;

    navigator.clipboard.writeText(text);
    setCopiedReminderId(customer.id);
    setTimeout(() => setCopiedReminderId(null), 3000);

    // Open WhatsApp if mobile
    const encoded = encodeURIComponent(text);
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    if (targetPhone) {
      window.open(`https://wa.me/${targetPhone}?text=${encoded}`, '_blank');
    }
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) return;

    onAddCustomer({
      name: newCustomerName.trim(),
      phone: newCustomerPhone.trim() || '+91 98000 00000',
      address: newCustomerAddress.trim(),
      state: newCustomerState,
      gstin: newCustomerGstin.trim().toUpperCase(),
      customer_type: newCustomerType,
      credit_limit: Number(newCustomerCreditLimit) || 10000,
      outstanding_balance: Number(newCustomerOpeningBalance) || 0,
      total_purchases: Number(newCustomerOpeningBalance) || 0,
      total_invoices_count: 0,
    });

    // Reset & close
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerAddress('');
    setNewCustomerGstin('');
    setNewCustomerOpeningBalance('0');
    setShowAddModal(false);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) return;

    onRecordPayment(selectedCustomer.id, amount, paymentMode, paymentNotes);
    
    // Update local selected customer view
    setSelectedCustomer({
      ...selectedCustomer,
      outstanding_balance: Math.max(0, selectedCustomer.outstanding_balance - amount),
    });

    setPaymentAmount('');
    setPaymentNotes('');
    setShowPaymentModal(false);
    setPaymentSuccessToast(true);
    setTimeout(() => setPaymentSuccessToast(false), 3000);
  };

  // Get selected customer transactions
  const customerSales = selectedCustomer
    ? sales.filter((s) => s.customer_id === selectedCustomer.id)
    : [];
  const customerPayments = selectedCustomer
    ? payments.filter((p) => p.customer_id === selectedCustomer.id)
    : [];

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {paymentSuccessToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{language === 'hi' ? 'रकम जमा हो गई व खाता अपडेट हो गया!' : 'Payment recorded & ledger updated!'}</span>
          </div>
        </div>
      )}

      {/* Top Shopkeeper KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold">{t.totalUdhaarOutstanding}</span>
            <span className="p-1.5 bg-rose-50 text-rose-700 rounded-lg">
              <ArrowDownLeft className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-700">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {customersWithDue} {language === 'hi' ? 'ग्राहकों पर बाक़ी' : 'customers owe'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold">{t.collectedThisMonth}</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-800">
            ₹{thisMonthPayments.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {payments.length} {language === 'hi' ? 'पेमेंट्स जमा' : 'payments'}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex sm:flex-col justify-between items-start">
          <div>
            <div className="text-xs text-slate-500 font-bold mb-1">{t.totalCustomers}</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{totalCustomersCount}</div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer mt-0 sm:mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addCustomer}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'hi' ? 'ग्राहक का नाम या फोन नंबर खोजें...' : 'Search customer name or phone...'}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {language === 'hi' ? 'सभी ग्राहक' : 'All Customers'} ({customers.length})
          </button>
          <button
            onClick={() => setFilterType('due')}
            className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 cursor-pointer ${
              filterType === 'due'
                ? 'bg-rose-700 text-white'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            {language === 'hi' ? '⚠️ केवल बाक़ीदार' : '⚠️ Pending Udhaar'} ({customersWithDue})
          </button>
          <button
            onClick={() => setFilterType('wholesale')}
            className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 cursor-pointer ${
              filterType === 'wholesale'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            {language === 'hi' ? '🏢 होलसेल / B2B' : '🏢 Wholesale / B2B'}
          </button>
        </div>
      </div>

      {/* Customers List */}
      <div className="space-y-2.5">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 shadow-xs space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs">{language === 'hi' ? 'कोई ग्राहक नहीं मिला' : 'No customers found matching search.'}</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs text-blue-700 font-bold underline"
            >
              {t.addCustomer}
            </button>
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const hasDue = customer.outstanding_balance > 0;
            return (
              <div
                key={customer.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-extrabold text-slate-900 text-sm truncate">{customer.name}</span>
                      {customer.customer_type === 'wholesale' && (
                        <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded-full font-bold shrink-0">
                          B2B
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="font-mono">{customer.phone}</span>
                      {customer.city && <span className="truncate">• {customer.city}</span>}
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <div className="text-[10px] text-slate-500 font-bold uppercase whitespace-nowrap">
                      {hasDue ? (language === 'hi' ? 'बाक़ी रकम' : 'Balance Due') : (language === 'hi' ? 'चुकता' : 'Settled')}
                    </div>
                    <div
                      className={`text-sm sm:text-base font-black whitespace-nowrap ${
                        hasDue ? 'text-rose-700' : 'text-emerald-700'
                      }`}
                    >
                      {hasDue ? `₹${customer.outstanding_balance.toLocaleString('en-IN')}` : '₹0 (चुकता)'}
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons per Customer */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => setSelectedCustomer(customer)}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 active:scale-98 text-slate-700 font-bold py-2 px-3 rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'खाता देखें' : 'View Khata'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowPaymentModal(true);
                    }}
                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 active:scale-98 text-emerald-800 font-bold py-2 px-3 rounded-xl border border-emerald-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>{t.recordPayment}</span>
                  </button>

                  {hasDue && (
                    <button
                      onClick={() => handleSendWhatsAppReminder(customer)}
                      title="Send WhatsApp Payment Reminder"
                      className="bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold p-2 rounded-xl transition flex items-center justify-center cursor-pointer"
                    >
                      {copiedReminderId === customer.id ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <MessageCircle className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => onCreateBillForCustomer(customer)}
                    title="Create New Bill"
                    className="bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold p-2 rounded-xl transition flex items-center justify-center cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Customer Detail & Ledger Drawer/Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{selectedCustomer.name}</h3>
                <p className="text-xs text-slate-500">{selectedCustomer.phone} • {selectedCustomer.state}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Outstanding Balance Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase">{language === 'hi' ? 'कुल बाक़ी उधारी' : 'Outstanding Balance'}</span>
                <div className="text-2xl font-black text-rose-700">
                  ₹{selectedCustomer.outstanding_balance.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{t.recordPayment}</span>
                </button>
                <button
                  onClick={() => handleSendWhatsAppReminder(selectedCustomer)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold p-2.5 rounded-xl flex items-center cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                </button>
              </div>
            </div>

            {/* Customer Details Info Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-bold text-[10px]">{language === 'hi' ? 'उधारी सीमा' : 'Credit Limit'}</span>
                <div className="font-bold text-slate-800">₹{selectedCustomer.credit_limit.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-slate-400 font-bold text-[10px]">{language === 'hi' ? 'कुल खरीदारी' : 'Total Purchases'}</span>
                <div className="font-bold text-slate-800">₹{selectedCustomer.total_purchases.toLocaleString('en-IN')}</div>
              </div>
              {selectedCustomer.gstin && (
                <div className="col-span-2">
                  <span className="text-slate-400 font-bold text-[10px]">GSTIN</span>
                  <div className="font-mono font-bold text-blue-700">{selectedCustomer.gstin}</div>
                </div>
              )}
            </div>

            {/* Khata / Transaction Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-slate-600" />
                <span>{language === 'hi' ? 'लेन-देन इतिहास (Bills & Payments)' : 'Ledger History'}</span>
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {customerSales.length === 0 && customerPayments.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">{language === 'hi' ? 'कोई लेन-देन दर्ज नहीं' : 'No recorded transactions'}</p>
                ) : (
                  <>
                    {customerSales.map((s) => (
                      <div key={s.id} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="text-blue-700 font-mono">{s.invoice_number}</span>
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-bold uppercase">{s.payment_mode}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">{s.invoice_date} • {s.items.length} items</div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900">₹{s.grand_total.toLocaleString('en-IN')}</span>
                          {s.due_amount > 0 && (
                            <div className="text-[10px] text-rose-700 font-bold">बाक़ी: ₹{s.due_amount}</div>
                          )}
                        </div>
                      </div>
                    ))}

                    {customerPayments.map((p) => (
                      <div key={p.id} className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <span>रकम जमा ({p.payment_mode.toUpperCase()})</span>
                            <span className="text-[10px] text-emerald-700 font-mono">{p.receipt_number}</span>
                          </div>
                          <div className="text-[10px] text-emerald-700">{p.date} {p.notes && `• ${p.notes}`}</div>
                        </div>
                        <div className="text-right font-black text-emerald-800">
                          - ₹{p.amount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  onCreateBillForCustomer(selectedCustomer);
                  setSelectedCustomer(null);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'hi' ? 'इस ग्राहक का नया बिल बनाएं' : 'Create New Bill'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-extrabold text-slate-900">{t.recordPayment}</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500">{language === 'hi' ? 'ग्राहक:' : 'Customer:'}</span>{' '}
                <strong className="text-slate-900">{selectedCustomer.name}</strong>
                <div className="text-rose-700 font-bold mt-1">
                  {language === 'hi' ? 'वर्तमान बाक़ी:' : 'Current Due:'} ₹{selectedCustomer.outstanding_balance.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">{t.paymentAmount}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder={String(selectedCustomer.outstanding_balance || 500)}
                    className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">{t.paymentMode}</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['cash', 'upi', 'bank_transfer'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`py-2 px-2 rounded-xl font-bold text-center border cursor-pointer capitalize ${
                        paymentMode === mode
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mode === 'cash' ? 'नकद (Cash)' : mode === 'upi' ? 'UPI / GPay' : 'Bank'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">{language === 'hi' ? 'टिप्पणी / विवरण (वैकल्पिक)' : 'Notes / Remarks'}</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. आधी रकम जमा की' : 'e.g. Received partial payment'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {language === 'hi' ? 'जमा करें ✓' : 'Save Payment ✓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-700" />
                <h3 className="text-sm font-extrabold text-slate-900">{t.addCustomer}</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">{t.customerName} *</label>
                <input
                  type="text"
                  required
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. राकेश कुमार (किराना स्टोर)' : 'e.g. Rakesh Kumar'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{t.customerPhone}</label>
                  <input
                    type="tel"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{t.customerType}</label>
                  <select
                    value={newCustomerType}
                    onChange={(e: any) => setNewCustomerType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 cursor-pointer"
                  >
                    <option value="regular">नियमित ग्राहक (Regular)</option>
                    <option value="retail">खुदरा (Retail Cash)</option>
                    <option value="wholesale">होलसेल / B2B व्यापारी</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">{t.customerState}</label>
                <select
                  value={newCustomerState}
                  onChange={(e) => setNewCustomerState(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 cursor-pointer"
                >
                  {INDIAN_STATES_GST.map((state) => (
                    <option key={state.code} value={`${state.code} - ${state.name}`}>
                      {state.code} - {state.hindiName} ({state.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">{t.customerGstin}</label>
                <input
                  type="text"
                  value={newCustomerGstin}
                  onChange={(e) => setNewCustomerGstin(e.target.value)}
                  placeholder="09AAAAA0000A1Z5"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{t.creditLimit}</label>
                  <input
                    type="number"
                    value={newCustomerCreditLimit}
                    onChange={(e) => setNewCustomerCreditLimit(e.target.value)}
                    placeholder="10000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{language === 'hi' ? 'पिछली बाक़ी (Opening Balance)' : 'Opening Balance'}</label>
                  <input
                    type="number"
                    value={newCustomerOpeningBalance}
                    onChange={(e) => setNewCustomerOpeningBalance(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {language === 'hi' ? 'ग्राहक जोड़ें ✓' : 'Save Customer ✓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
