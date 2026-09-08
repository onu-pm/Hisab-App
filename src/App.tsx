import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  PlusCircle,
  Cpu,
  BarChart3,
  Store,
  Wifi,
  WifiOff,
  RefreshCw,
  Globe,
  Share2,
  Camera,
  Mail,
  Sparkles,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Maximize2,
  Minimize2,
  Users,
  TrendingUp,
  Percent,
  Plus,
  ShieldCheck,
  FileSpreadsheet,
  ChevronDown,
  ChevronRight,
  LogOut,
  Building2,
  Settings,
  Layers,
  ArrowRight,
  User
} from 'lucide-react';
import {
  Invoice,
  Language,
  LedgerSummary,
  QueueJob,
  Shop,
  Vendor,
  SourceChannel,
  Customer,
  CustomerPayment,
  SalesInvoice,
  GstSettings,
  UserProfile,
} from './types';
import { getTranslation, SUPPORTED_LANGUAGES } from './locales/i18n';
import { INITIAL_SHOP, INITIAL_INVOICES, INITIAL_VENDORS } from './data/sampleInvoices';
import {
  INITIAL_CUSTOMERS,
  INITIAL_CUSTOMER_PAYMENTS,
  INITIAL_SALES_INVOICES,
  INITIAL_GST_SETTINGS,
} from './data/sampleShopkeeperData';
import {
  getOfflineQueue,
  enqueueOfflineInvoice,
  removeOfflineItem,
  saveOfflineQueue,
} from './utils/offlineQueue';
import { LedgerDashboard } from './components/LedgerDashboard';
import { Channel1ShareSheet } from './components/Channel1ShareSheet';
import { Channel2CameraScanner } from './components/Channel2CameraScanner';
import { Channel3EmailIngestion } from './components/Channel3EmailIngestion';
import { ExtractionQueueView } from './components/ExtractionQueueView';
import { ReviewCorrectionModal } from './components/ReviewCorrectionModal';
import { GstAnalyticsView } from './components/GstAnalyticsView';
import { PhoneAuthModal } from './components/PhoneAuthModal';
import { LoginScreen } from './components/LoginScreen';
import { CustomersKhataView } from './components/CustomersKhataView';
import { FinancialAnalyticsView } from './components/FinancialAnalyticsView';
import { GstStatewiseSettingsView } from './components/GstStatewiseSettingsView';
import { CreateSalesInvoiceModal } from './components/CreateSalesInvoiceModal';
import { AddNewShopModal } from './components/AddNewShopModal';
import { OnboardingFlow } from './components/OnboardingFlow';
import { ProfileAndSettingsView } from './components/ProfileAndSettingsView';
import { DEMO_SHOPS } from './data/sampleShops';

export default function App() {
  // 1. Persistent Language State (Preserved across all screen/shop changes)
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('hisab_app_language');
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      return saved as Language;
    }
    return 'en';
  });

  const handleLanguageChange = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('hisab_app_language', newLang);
  };

  const [isOnline, setIsOnline] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const stored = localStorage.getItem('hisab_is_authenticated');
    return stored !== 'false';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('hisab_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<
    'ledger' | 'customers' | 'financials' | 'gstOptions' | 'capture' | 'queue' | 'analytics' | 'settings'
  >('ledger');
  const [activeCaptureChannel, setActiveCaptureChannel] = useState<'share' | 'camera' | 'email'>('share');

  // 2. Multi-Shop State Management & Persistent User Shops
  const [allShops, setAllShops] = useState<Shop[]>(() => {
    const saved = localStorage.getItem('hisab_user_shops');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEMO_SHOPS;
  });

  const [shop, setShop] = useState<Shop>(() => {
    const savedShopId = localStorage.getItem('hisab_active_shop_id');
    if (savedShopId) {
      const found = allShops.find((s) => s.id === savedShopId);
      if (found) return found;
    }
    return allShops[0] || INITIAL_SHOP;
  });

  // Shop Dropdown & Modals State
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isAddShopModalOpen, setIsAddShopModalOpen] = useState(false);
  const [isOnboardingFlowOpen, setIsOnboardingFlowOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [salesCustomerTarget, setSalesCustomerTarget] = useState<Customer | null>(null);
  const [reviewInvoice, setReviewInvoice] = useState<Invoice | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsShopDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ledger & Business State
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [customerPayments, setCustomerPayments] = useState<CustomerPayment[]>(INITIAL_CUSTOMER_PAYMENTS);
  const [salesInvoices, setSalesInvoices] = useState<SalesInvoice[]>(INITIAL_SALES_INVOICES);
  const [gstSettings, setGstSettings] = useState<GstSettings>(INITIAL_GST_SETTINGS);
  const [summary, setSummary] = useState<LedgerSummary | null>(null);

  // Ingestion Queue State
  const [queueJobs, setQueueJobs] = useState<QueueJob[]>([]);
  const [offlinePendingCount, setOfflinePendingCount] = useState(0);

  const t = getTranslation(language);

  // Fetch initial ledger data
  const fetchAllData = async () => {
    try {
      const authToken = localStorage.getItem('hisab_auth_token');
      const authHeaders: Record<string, string> = {};
      if (authToken) authHeaders['Authorization'] = `Bearer ${authToken}`;

      const [invRes, sumRes, venRes, custRes, salesRes, gstRes, shopsRes, profileRes] = await Promise.all([
        fetch('/api/invoices'),
        fetch('/api/ledger/summary'),
        fetch('/api/vendors'),
        fetch('/api/customers'),
        fetch('/api/sales'),
        fetch('/api/gst/settings'),
        fetch('/api/shops'),
        fetch('/api/user/profile', { headers: authHeaders }),
      ]);

      if (profileRes.ok) {
        const profData = await profileRes.json();
        if (profData.success && profData.user) {
          setCurrentUser(profData.user);
          localStorage.setItem('hisab_user_profile', JSON.stringify(profData.user));
          if (profData.user.shops && profData.user.shops.length > 0) {
            setAllShops(profData.user.shops);
            localStorage.setItem('hisab_user_shops', JSON.stringify(profData.user.shops));
          }
          if (profData.active_shop) {
            setShop(profData.active_shop);
          }
        }
      }

      if (invRes.ok) {
        const invData = await invRes.json();
        setInvoices(invData.invoices);
      }
      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setSummary(sumData);
      }
      if (venRes.ok) {
        const venData = await venRes.json();
        setVendors(venData.vendors);
      }
      if (custRes.ok) {
        const custData = await custRes.json();
        setCustomers(custData.customers);
      }
      if (salesRes.ok) {
        const sData = await salesRes.json();
        setSalesInvoices(sData.sales);
      }
      if (gstRes.ok) {
        const gData = await gstRes.json();
        setGstSettings(gData.settings);
      }
      if (shopsRes.ok) {
        const shData = await shopsRes.json();
        if (shData.shops && shData.shops.length > 0) {
          setAllShops((prev) => {
            const merged = [...shData.shops];
            prev.forEach((p) => {
              if (!merged.some((m) => m.id === p.id)) merged.push(p);
            });
            localStorage.setItem('hisab_user_shops', JSON.stringify(merged));
            return merged;
          });
        }
      }
    } catch (e) {
      console.warn('Using local client state (offline/development mode):', e);
    }
  };

  useEffect(() => {
    fetchAllData();
    const offlineItems = getOfflineQueue();
    setOfflinePendingCount(offlineItems.length);
  }, []);

  // Customer Management Handlers
  const handleAddCustomer = async (custData: Partial<Customer>) => {
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(custData),
      });
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomers((prev) => [data.customer, ...prev]);
        return;
      }
    } catch (e) {}

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      shop_id: shop.id,
      name: custData.name || 'Customer',
      phone: custData.phone || '',
      address: custData.address || '',
      state: custData.state || '09 - Uttar Pradesh',
      gstin: custData.gstin || '',
      customer_type: custData.customer_type || 'regular',
      credit_limit: custData.credit_limit || 10000,
      outstanding_balance: custData.outstanding_balance || 0,
      total_purchases: 0,
      total_invoices_count: 0,
      created_at: new Date().toISOString(),
    };
    setCustomers((prev) => [newCust, ...prev]);
  };

  const handleRecordPayment = async (
    customerId: string,
    amount: number,
    mode: 'cash' | 'upi' | 'bank_transfer',
    notes?: string
  ) => {
    try {
      const res = await fetch(`/api/customers/${customerId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, mode, notes }),
      });
      const data = await res.json();
      if (data.success && data.payment) {
        setCustomerPayments((prev) => [data.payment, ...prev]);
        setCustomers((prev) =>
          prev.map((c) => (c.id === customerId ? data.customer : c))
        );
        return;
      }
    } catch (e) {}

    const targetCust = customers.find((c) => c.id === customerId);
    const newPayment: CustomerPayment = {
      id: `pay-${Date.now()}`,
      customer_id: customerId,
      customer_name: targetCust?.name || 'Customer',
      amount,
      payment_mode: mode,
      date: new Date().toISOString().split('T')[0],
      receipt_number: `RCPT-${Date.now().toString().slice(-6)}`,
      notes: notes || '',
      created_at: new Date().toISOString(),
    };
    setCustomerPayments((prev) => [newPayment, ...prev]);
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              outstanding_balance: Math.max(0, c.outstanding_balance - amount),
            }
          : c
      )
    );
  };

  // Handle saving new sales invoice (POS)
  const handleSaveSale = async (saleData: Partial<SalesInvoice>) => {
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData),
      });
      const data = await res.json();
      if (data.success && data.sale) {
        setSalesInvoices((prev) => [data.sale, ...prev]);
        if (saleData.customer_id && saleData.due_amount) {
          setCustomers((prev) =>
            prev.map((c) =>
              c.id === saleData.customer_id
                ? {
                    ...c,
                    outstanding_balance: c.outstanding_balance + (saleData.due_amount || 0),
                    total_purchases: c.total_purchases + (saleData.grand_total || 0),
                  }
                : c
            )
          );
        }
        return;
      }
    } catch (e) {}

    const fallbackSale: SalesInvoice = {
      id: `sale-${Date.now()}`,
      shop_id: shop.id,
      invoice_number: `SAL-${Date.now().toString().slice(-6)}`,
      customer_name: saleData.customer_name || 'Cash Customer',
      customer_phone: saleData.customer_phone || '',
      customer_state: saleData.customer_state || `${gstSettings.shop_state_code} - ${gstSettings.shop_state_name}`,
      shop_state: `${gstSettings.shop_state_code} - ${gstSettings.shop_state_name}`,
      invoice_date: saleData.invoice_date || new Date().toISOString().split('T')[0],
      supply_type: saleData.supply_type || 'intra_state',
      gst_pricing_mode: saleData.gst_pricing_mode || 'inclusive',
      items: saleData.items || [],
      subtotal_taxable: saleData.subtotal_taxable || 0,
      cgst: saleData.cgst || 0,
      sgst: saleData.sgst || 0,
      igst: saleData.igst || 0,
      total_gst: saleData.total_gst || 0,
      discount_amount: saleData.discount_amount || 0,
      round_off: 0,
      grand_total: saleData.grand_total || 0,
      total_cost_price: saleData.total_cost_price || 0,
      profit_amount: saleData.profit_amount || 0,
      profit_margin_pct: saleData.profit_margin_pct || 0,
      payment_mode: saleData.payment_mode || 'cash',
      paid_amount: saleData.paid_amount || 0,
      due_amount: saleData.due_amount || 0,
      status: saleData.status || 'paid',
      notes: saleData.notes || '',
      created_at: new Date().toISOString(),
    };

    setSalesInvoices((prev) => [fallbackSale, ...prev]);
    if (saleData.customer_id && saleData.due_amount) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === saleData.customer_id
            ? {
                ...c,
                outstanding_balance: c.outstanding_balance + (saleData.due_amount || 0),
                total_purchases: c.total_purchases + (saleData.grand_total || 0),
              }
            : c
        )
      );
    }
  };

  // Handle updating GST settings
  const handleUpdateGstSettings = async (newSettings: Partial<GstSettings>) => {
    try {
      const res = await fetch('/api/gst/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      if (data.success && data.settings) {
        setGstSettings(data.settings);
        return;
      }
    } catch (e) {}

    setGstSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Main Ingestion & Extraction Handler
  const handleIngestInvoice = async (
    imageDataUrl: string,
    channel: SourceChannel,
    hint?: any
  ) => {
    const jobId = `job-${Date.now()}`;
    const newJob: QueueJob = {
      id: jobId,
      shop_id: shop.id,
      source_channel: channel,
      image_url: imageDataUrl,
      image_name: hint?.vendorName || (channel === 'share_sheet' ? 'WhatsApp Invoice' : 'Paper Scan'),
      status: 'active',
      progress: 15,
      stage_message: t.extractingAi,
      created_at: new Date().toISOString(),
    };

    setQueueJobs((prev) => [newJob, ...prev]);
    setActiveTab('queue');

    if (!isOnline) {
      enqueueOfflineInvoice(imageDataUrl, channel);
      setOfflinePendingCount((prev) => prev + 1);

      setTimeout(() => {
        setQueueJobs((prev) =>
          prev.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  status: 'completed',
                  progress: 100,
                  stage_message: language === 'hi' ? 'ऑफ़लाइन कतार में सहेजा गया' : 'Queued offline safely',
                }
              : j
          )
        );
      }, 800);
      return;
    }

    setTimeout(() => {
      setQueueJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, progress: 45, stage_message: t.extractingAi } : j))
      );
    }, 600);

    try {
      const response = await fetch('/api/invoices/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageDataUrl,
          sourceChannel: channel,
          fallbackHint: hint,
        }),
      });

      const data = await response.json();

      if (data.success && data.invoice) {
        const createdInvoice: Invoice = data.invoice;

        setQueueJobs((prev) =>
          prev.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  status: 'completed',
                  progress: 100,
                  stage_message: data.autoPosted ? t.autoPosted : t.sentToReview,
                  result_invoice_id: createdInvoice.id,
                }
              : j
          )
        );

        setInvoices((prev) => [createdInvoice, ...prev.filter((i) => i.id !== createdInvoice.id)]);

        if (!data.autoPosted || createdInvoice.status === 'pending_review' || createdInvoice.status === 'duplicate_flagged') {
          setTimeout(() => {
            setReviewInvoice(createdInvoice);
          }, 400);
        }
      }
    } catch (err) {
      console.error('Extraction request failed:', err);
      setQueueJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? { ...j, status: 'failed', stage_message: 'Extraction error - please retry' }
            : j
        )
      );
    }
  };

  const handleConfirmAndSave = async (
    invoiceId: string,
    updatedFields: Partial<Invoice>,
    originalFields?: any
  ) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/correct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correctedFields: updatedFields,
          originalFields,
        }),
      });
      const data = await res.json();
      if (data.success && data.invoice) {
        setInvoices((prev) => prev.map((i) => (i.id === invoiceId ? data.invoice : i)));
      } else {
        setInvoices((prev) =>
          prev.map((i) => (i.id === invoiceId ? { ...i, ...updatedFields, status: 'confirmed' } : i))
        );
      }
    } catch (e) {
      setInvoices((prev) =>
        prev.map((i) => (i.id === invoiceId ? { ...i, ...updatedFields, status: 'confirmed' } : i))
      );
    }

    setReviewInvoice(null);
    setActiveTab('ledger');
  };

  const handleDiscardDuplicate = async (invoiceId: string) => {
    try {
      await fetch(`/api/invoices/${invoiceId}`, { method: 'DELETE' });
    } catch (e) {}
    setInvoices((prev) => prev.filter((i) => i.id !== invoiceId));
    setReviewInvoice(null);
  };

  // Authentication & Shop Switching
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('hisab_is_authenticated', 'false');
    localStorage.removeItem('hisab_auth_token');
    localStorage.removeItem('hisab_user_id');
    localStorage.removeItem('hisab_user_profile');
    setCurrentUser(null);
    setIsAuthOpen(false);
  };

  const handleLoginSuccess = (newShop: Shop, newUser?: UserProfile) => {
    setShop(newShop);
    localStorage.setItem('hisab_active_shop_id', newShop.id);
    setIsAuthenticated(true);
    localStorage.setItem('hisab_is_authenticated', 'true');
    if (newUser) {
      setCurrentUser(newUser);
      localStorage.setItem('hisab_user_profile', JSON.stringify(newUser));
      if (newUser.shops && newUser.shops.length > 0) {
        setAllShops(newUser.shops);
        localStorage.setItem('hisab_user_shops', JSON.stringify(newUser.shops));
      }
    }
    setIsAuthOpen(false);

    // Sync GST settings with shop compliance
    const stateParts = (newShop.state || '09 - Uttar Pradesh').split('-');
    const stateCode = stateParts[0]?.trim() || '09';
    const stateName = stateParts[1]?.trim() || 'Uttar Pradesh';

    setGstSettings((prev) => ({
      ...prev,
      shop_gstin: newShop.gst_number || newShop.compliance?.gstin || '',
      shop_state_code: stateCode,
      shop_state_name: stateName,
      tax_scheme: newShop.compliance?.tax_scheme || (newShop.gst_number ? 'regular' : 'unregistered'),
    }));
  };

  const handleShopCreated = (newShop: Shop) => {
    setAllShops((prev) => {
      const filtered = prev.filter((s) => s.id !== newShop.id);
      const updated = [newShop, ...filtered];
      localStorage.setItem('hisab_user_shops', JSON.stringify(updated));
      return updated;
    });
    handleLoginSuccess(newShop);
    setIsAddShopModalOpen(false);
    setIsOnboardingFlowOpen(false);
    setIsShopDropdownOpen(false);
  };

  const handleSelectShop = (targetShop: Shop) => {
    handleLoginSuccess(targetShop);
    setIsShopDropdownOpen(false);
  };

  const handleSyncOfflineInvoices = async () => {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;

    for (const item of queue) {
      await handleIngestInvoice(item.image_data_url, item.source_channel);
      removeOfflineItem(item.id);
    }
    setOfflinePendingCount(0);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col items-center justify-start p-0 sm:p-3 selection:bg-slate-900 selection:text-white">
      {/* Main Container: Mobile Full-Width Responsive Canvas */}
      <main className="w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl bg-white sm:border sm:border-slate-200 sm:rounded-3xl sm:shadow-xl flex flex-col min-h-screen sm:min-h-[90vh] overflow-hidden">
        
        {/* Top App Header with Shop Switcher, Language & Actions */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-5 py-2.5 flex items-center justify-between gap-1.5 sm:gap-2 shadow-2xs">
          
          {/* Shop Switcher Dropdown Trigger */}
          <div className="relative min-w-0" ref={dropdownRef}>
            <button
              onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
              className="flex items-center gap-2 p-1 -ml-1 rounded-2xl hover:bg-slate-100 transition cursor-pointer text-left group"
              title="Switch Business / Shop"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs sm:text-base shadow-xs shrink-0 group-hover:scale-102 transition">
                <Store className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 pr-0.5">
                <div className="flex items-center gap-1">
                  <h1 className="font-bold text-slate-900 text-xs sm:text-sm truncate leading-tight max-w-[120px] xs:max-w-[150px] sm:max-w-[200px] md:max-w-xs">
                    {shop.name.split('(')[0]}
                  </h1>
                  <ChevronDown className={`w-3 h-3 text-slate-500 shrink-0 transition-transform ${isShopDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                <p className="text-[10px] text-slate-500 truncate max-w-[120px] xs:max-w-[150px] sm:max-w-[200px]">
                  {shop.city || 'India'} • {shop.gst_number || shop.compliance?.gstin ? 'GST' : 'Exempt'}
                </p>
              </div>
            </button>

            {/* Shop Switcher Dropdown Menu */}
            {isShopDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {language === 'hi' ? 'दुकान बदलें' : 'Switch Business'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {allShops.length} {language === 'hi' ? 'दुकानें' : 'Shops'}
                  </span>
                </div>

                {/* Shops List */}
                <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                  {allShops.map((s) => {
                    const isSelected = s.id === shop.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => handleSelectShop(s)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white font-bold shadow-xs'
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold truncate">{s.name.split('(')[0]}</p>
                          <p className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            {s.owner_name} • {s.city}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Dropdown Action: Add New Shop */}
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <button
                    onClick={() => {
                      setIsShopDropdownOpen(false);
                      setIsAddShopModalOpen(true);
                    }}
                    className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-700" />
                    <span>{language === 'hi' ? '+ नई दुकान जोड़ें' : '+ Add New Shop'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsShopDropdownOpen(false);
                      setIsOnboardingFlowOpen(true);
                    }}
                    className="w-full py-2 px-3 text-slate-600 hover:text-slate-900 text-[11px] font-medium transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>{language === 'hi' ? '5-चरणीय e-KYC ऑनबोर्डिंग शुरू करें' : 'Launch 5-Step e-KYC Onboarding'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Header Actions: Connectivity, Language & New POS Sale */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Online / Offline Connectivity Pill */}
            <button
              id="offline-toggle-pill"
              onClick={() => {
                const nextOnline = !isOnline;
                setIsOnline(nextOnline);
                if (nextOnline && offlinePendingCount > 0) {
                  handleSyncOfflineInvoices();
                }
              }}
              className={`p-1.5 sm:px-2 sm:py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                isOnline
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
              }`}
              title={isOnline ? 'Online (Tap to toggle)' : 'Offline (Tap to reconnect)'}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
              <span className="hidden sm:inline">{isOnline ? t.online : t.offline}</span>
            </button>

            {/* Persistent Indian Language Selector */}
            <div className="flex items-center bg-slate-50 hover:bg-slate-100 rounded-xl px-1.5 sm:px-2 py-1 border border-slate-200 transition">
              <Globe className="w-3.5 h-3.5 text-slate-500 mr-1 shrink-0" />
              <select
                id="app-top-lang-dropdown"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="bg-transparent text-[11px] font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.code.toUpperCase()} ({l.nativeLabel})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick POS Bill Button (Visible on Tablet/Desktop) */}
            {isAuthenticated && (
              <button
                onClick={() => {
                  setSalesCustomerTarget(null);
                  setIsSalesModalOpen(true);
                }}
                className="hidden sm:flex bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white text-xs font-bold py-1.5 px-3 rounded-xl items-center gap-1 shadow-xs transition cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? '+ बिक्री बिल' : '+ New Sale'}</span>
              </button>
            )}

            {/* Profile Avatar / Settings Quick Action */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-1 rounded-xl transition cursor-pointer flex items-center gap-1 border ${
                activeTab === 'settings'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
              title="Profile, Settings & Logout"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center font-black text-xs">
                {(currentUser?.name || shop.owner_name || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="text-[11px] font-bold hidden md:inline pr-1">
                {(currentUser?.name || shop.owner_name || 'User').split(' ')[0]}
              </span>
            </button>
          </div>
        </header>

        {/* IF NOT AUTHENTICATED: SHOW PRIMARY LOGIN SCREEN */}
        {!isAuthenticated ? (
          <LoginScreen
            language={language}
            onLanguageChange={handleLanguageChange}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <>
            {/* Offline Queue Sync Alert Banner */}
            {!isOnline && (
              <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-amber-900 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    {offlinePendingCount > 0
                      ? `${offlinePendingCount} ${t.offlineSyncPending}`
                      : t.offline}
                  </span>
                </div>
                {offlinePendingCount > 0 && (
                  <button
                    onClick={() => {
                      setIsOnline(true);
                      handleSyncOfflineInvoices();
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer"
                  >
                    {t.syncNow}
                  </button>
                )}
              </div>
            )}

            {/* Top Navigation Bar for Desktop Hubs */}
            <div className="hidden md:flex bg-white px-5 py-2 border-b border-slate-200 items-center gap-1.5 overflow-x-auto text-xs font-bold select-none no-scrollbar">
              <button
                onClick={() => setActiveTab('ledger')}
                className={`px-3 py-1.5 rounded-xl shrink-0 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'ledger'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.tabLedger}</span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`px-3 py-1.5 rounded-xl shrink-0 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'customers'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{t.tabCustomers}</span>
              </button>

              <button
                onClick={() => setActiveTab('financials')}
                className={`px-3 py-1.5 rounded-xl shrink-0 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'financials'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{t.tabFinancials}</span>
              </button>

              <button
                onClick={() => setActiveTab('gstOptions')}
                className={`px-3 py-1.5 rounded-xl shrink-0 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'gstOptions'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Percent className="w-3.5 h-3.5" />
                <span>{t.tabGstOptions}</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1.5 rounded-xl shrink-0 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'settings'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'सेटिंग्स व दुकानें' : 'Settings & Shops'}</span>
              </button>
            </div>

            {/* Main Scrollable View Area */}
            <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-4 pb-28 md:pb-6">
              {/* TAB 1: PURCHASES / LEDGER DASHBOARD */}
              {activeTab === 'ledger' && (
                <LedgerDashboard
                  language={language}
                  invoices={invoices}
                  summary={summary}
                  vendors={vendors}
                  onOpenReview={(inv) => setReviewInvoice(inv)}
                  onOpenCaptureTab={() => setActiveTab('capture')}
                />
              )}

              {/* TAB 2: CUSTOMERS & UDHAAR KHATA */}
              {activeTab === 'customers' && (
                <CustomersKhataView
                  language={language}
                  customers={customers}
                  sales={salesInvoices}
                  payments={customerPayments}
                  onAddCustomer={handleAddCustomer}
                  onRecordPayment={handleRecordPayment}
                  onCreateBillForCustomer={(customer) => {
                    setSalesCustomerTarget(customer);
                    setIsSalesModalOpen(true);
                  }}
                />
              )}

              {/* TAB 3: FINANCIAL REPORTING & PROFIT */}
              {activeTab === 'financials' && (
                <FinancialAnalyticsView
                  language={language}
                  sales={salesInvoices}
                  purchases={invoices}
                  customers={customers}
                />
              )}

              {/* TAB 4: GST SETTINGS & STATEWISE RULES */}
              {activeTab === 'gstOptions' && (
                <GstStatewiseSettingsView
                  language={language}
                  settings={gstSettings}
                  onUpdateSettings={handleUpdateGstSettings}
                />
              )}

              {/* TAB 5: CAPTURE / INGESTION */}
              {activeTab === 'capture' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="font-bold text-slate-900 text-base">{t.captureHeading}</h2>
                    <p className="text-xs text-slate-500">{t.captureSubheading}</p>
                  </div>

                  {/* 3 Channel Selector */}
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    <button
                      id="tab-channel-share"
                      onClick={() => setActiveCaptureChannel('share')}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                        activeCaptureChannel === 'share'
                          ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Share2 className="w-4 h-4 text-emerald-700" />
                      <span>{language === 'hi' ? 'व्हाट्सएप शेयर' : 'WhatsApp'}</span>
                    </button>

                    <button
                      id="tab-channel-camera"
                      onClick={() => setActiveCaptureChannel('camera')}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                        activeCaptureChannel === 'camera'
                          ? 'bg-white text-amber-800 shadow-xs border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Camera className="w-4 h-4 text-amber-700" />
                      <span>{language === 'hi' ? 'कैमरा स्कैनर' : 'Camera'}</span>
                    </button>

                    <button
                      id="tab-channel-email"
                      onClick={() => setActiveCaptureChannel('email')}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                        activeCaptureChannel === 'email'
                          ? 'bg-white text-blue-800 shadow-xs border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Mail className="w-4 h-4 text-blue-700" />
                      <span>{language === 'hi' ? 'ईमेल खाता' : 'Email'}</span>
                    </button>
                  </div>

                  {activeCaptureChannel === 'share' && (
                    <Channel1ShareSheet
                      language={language}
                      onIngestInvoice={(imgUrl, channel, hint) =>
                        handleIngestInvoice(imgUrl, channel, hint)
                      }
                    />
                  )}

                  {activeCaptureChannel === 'camera' && (
                    <Channel2CameraScanner
                      language={language}
                      onCaptureInvoice={(imgUrl, channel, hint) =>
                        handleIngestInvoice(imgUrl, channel, hint)
                      }
                    />
                  )}

                  {activeCaptureChannel === 'email' && (
                    <Channel3EmailIngestion
                      language={language}
                      shop={shop}
                      onIngestInvoice={(imgUrl, channel, hint) =>
                        handleIngestInvoice(imgUrl, channel, hint)
                      }
                    />
                  )}
                </div>
              )}

              {/* TAB 6: QUEUE / EXTRACTION WORKER */}
              {activeTab === 'queue' && (
                <ExtractionQueueView
                  language={language}
                  jobs={queueJobs}
                  onOpenReview={(invId) => {
                    const found = invoices.find((i) => i.id === invId);
                    if (found) setReviewInvoice(found);
                  }}
                />
              )}

              {/* TAB 7: GST ANALYTICS / ITC BREAKDOWN */}
              {activeTab === 'analytics' && (
                <GstAnalyticsView
                  language={language}
                  summary={summary}
                  vendors={vendors}
                  invoices={invoices}
                />
              )}

              {/* TAB 8: SHOP PROFILE & SETTINGS */}
              {activeTab === 'settings' && (
                <ProfileAndSettingsView
                  language={language}
                  onLanguageChange={handleLanguageChange}
                  shop={shop}
                  allShops={allShops}
                  gstSettings={gstSettings}
                  user={currentUser}
                  onSelectShop={handleSelectShop}
                  onOpenAddNewShop={() => setIsAddShopModalOpen(true)}
                  onLaunchOnboarding={() => setIsOnboardingFlowOpen(true)}
                  onLogout={handleLogout}
                  onOpenGstSettingsTab={() => setActiveTab('gstOptions')}
                />
              )}
            </div>

            {/* Mobile Bottom Navigation Bar (Large 48px+ Tap Targets) */}
            <nav className="fixed sm:sticky bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 sm:px-3 py-1.5 sm:py-2 flex items-center justify-around select-none shadow-lg sm:shadow-none">
              {/* 1. Purchases Ledger */}
              <button
                id="nav-ledger-tab"
                onClick={() => setActiveTab('ledger')}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[46px] gap-0.5 py-1 px-2 rounded-2xl transition cursor-pointer ${
                  activeTab === 'ledger'
                    ? 'text-slate-900 font-extrabold scale-105 bg-slate-100/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-[10px]">{language === 'hi' ? 'ख़रीद' : 'Purchases'}</span>
              </button>

              {/* 2. Customers / Khata */}
              <button
                id="nav-customers-tab"
                onClick={() => setActiveTab('customers')}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[46px] gap-0.5 py-1 px-2 rounded-2xl transition cursor-pointer ${
                  activeTab === 'customers'
                    ? 'text-slate-900 font-extrabold scale-105 bg-slate-100/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="text-[10px]">{language === 'hi' ? 'खाता' : 'Khata'}</span>
              </button>

              {/* 3. Add Bill (Center Hero Action) */}
              <button
                id="nav-capture-tab"
                onClick={() => setActiveTab('capture')}
                className={`flex flex-col items-center justify-center min-w-[64px] min-h-[46px] gap-0.5 py-1 px-3 rounded-2xl transition cursor-pointer ${
                  activeTab === 'capture'
                    ? 'bg-slate-900 text-white font-bold shadow-md scale-105'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span className="text-[10px] font-bold">{t.tabCapture}</span>
              </button>

              {/* 4. Financials / Profit */}
              <button
                id="nav-financials-tab"
                onClick={() => setActiveTab('financials')}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[46px] gap-0.5 py-1 px-2 rounded-2xl transition cursor-pointer ${
                  activeTab === 'financials'
                    ? 'text-slate-900 font-extrabold scale-105 bg-slate-100/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px]">{language === 'hi' ? 'मुनाफ़ा' : 'Profit'}</span>
              </button>

              {/* 5. Profile & Settings */}
              <button
                id="nav-settings-tab"
                onClick={() => setActiveTab('settings')}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[46px] gap-0.5 py-1 px-2 rounded-2xl transition cursor-pointer ${
                  activeTab === 'settings'
                    ? 'text-slate-900 font-extrabold scale-105 bg-slate-100/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="text-[10px]">{language === 'hi' ? 'दुकान' : 'Shop'}</span>
              </button>
            </nav>
          </>
        )}
      </main>

      {/* Review / Correction Modal */}
      {reviewInvoice && (
        <ReviewCorrectionModal
          language={language}
          invoice={reviewInvoice}
          onClose={() => setReviewInvoice(null)}
          onConfirmAndSave={handleConfirmAndSave}
          onDiscardDuplicate={handleDiscardDuplicate}
        />
      )}

      {/* POS Sales Invoice Creation Modal */}
      {isSalesModalOpen && (
        <CreateSalesInvoiceModal
          language={language}
          customers={customers}
          defaultCustomer={salesCustomerTarget}
          gstSettings={gstSettings}
          onClose={() => {
            setIsSalesModalOpen(false);
            setSalesCustomerTarget(null);
          }}
          onSaveSale={handleSaveSale}
        />
      )}

      {/* Add New Shop Quick Modal */}
      {isAddShopModalOpen && (
        <AddNewShopModal
          language={language}
          onClose={() => setIsAddShopModalOpen(false)}
          onShopCreated={handleShopCreated}
          onLaunchFullOnboarding={() => {
            setIsAddShopModalOpen(false);
            setIsOnboardingFlowOpen(true);
          }}
        />
      )}

      {/* Full 5-Step e-KYC Onboarding Wizard Modal */}
      {isOnboardingFlowOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto">
            <OnboardingFlow
              language={language}
              onLanguageChange={handleLanguageChange}
              onComplete={handleShopCreated}
              onCancel={() => setIsOnboardingFlowOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Phone OTP Login / Switch Shop Modal */}
      {isAuthOpen && (
        <PhoneAuthModal
          language={language}
          onLanguageChange={handleLanguageChange}
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setIsAuthOpen(false)}
          onLogout={handleLogout}
          currentShop={shop}
          allShops={allShops}
          onOpenAddNewShop={() => {
            setIsAuthOpen(false);
            setIsAddShopModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
