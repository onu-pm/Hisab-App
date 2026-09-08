export type Language = 'en' | 'hi' | 'hinglish' | 'gu' | 'mr' | 'ta' | 'te' | 'kn' | 'bn' | 'pa' | 'ml';

export type BusinessType =
  | 'gst_registered'
  | 'unregistered_retail'
  | 'msme_small_biz'
  | 'freelancer'
  | 'composition_dealer';

export interface DigiLockerVerification {
  is_verified: boolean;
  doc_type: 'aadhaar' | 'pan' | 'driving_license';
  full_name: string;
  masked_uid: string; // e.g. "XXXX-XXXX-9821"
  pan_number?: string; // e.g. "ABCDE1234F"
  dob?: string;
  gender?: string;
  address?: string;
  verified_at: string;
  digilocker_txn_id: string;
}

export interface IndianComplianceDetails {
  has_gst: boolean;
  gstin?: string;
  trade_name?: string;
  legal_name?: string;
  gst_status?: 'active' | 'inactive' | 'pending';
  tax_scheme: 'regular' | 'composition' | 'unregistered';
  // Non-GST Compliance for Small Shops & Businesses
  non_gst_doc_type?: 'udyam' | 'gumasta' | 'fssai' | 'trade_license' | 'freelancer_exempt' | 'none';
  udyam_number?: string;
  gumasta_license?: string;
  fssai_license?: string;
  trade_license?: string;
  turnover_bracket: 'below_20_lakhs' | '20_to_40_lakhs' | 'above_40_lakhs';
  is_freelancer_exempt?: boolean;
}

export type InvoiceStatus = 'pending_review' | 'confirmed' | 'duplicate_flagged' | 'processing' | 'failed';

export type SourceChannel = 'share_sheet' | 'camera_scan' | 'email_inbound' | 'file_upload';

export interface InvoiceItem {
  id?: string;
  name: string;
  quantity?: number;
  unit?: string;
  rate?: number;
  total: number;
  hsn?: string;
}

export interface ExtractedFields {
  vendor_name: string;
  vendor_name_confidence: number;
  vendor_gstin?: string;
  vendor_gstin_confidence?: number;
  invoice_number: string;
  invoice_number_confidence: number;
  invoice_date: string;
  invoice_date_confidence: number;
  amount: number;
  amount_confidence: number;
  gst_amount: number;
  gst_amount_confidence: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  items: InvoiceItem[];
  items_confidence?: number;
  payment_status: 'paid' | 'unpaid' | 'credit' | 'partial';
  notes?: string;
  overall_confidence: number;
  is_high_confidence: boolean;
  low_confidence_reasons?: string[];
}

export interface Invoice {
  id: string;
  shop_id: string;
  vendor_name: string;
  vendor_normalized_name: string;
  amount: number;
  gst_amount: number;
  invoice_date: string;
  invoice_number: string;
  source_channel: SourceChannel;
  raw_image_url: string;
  extraction_confidence: number;
  status: InvoiceStatus;
  created_at: string;
  updated_at?: string;
  hash: string;
  gst_number?: string;
  items: InvoiceItem[];
  payment_status: 'paid' | 'unpaid' | 'credit' | 'partial';
  extracted_data?: ExtractedFields;
  corrections_applied?: boolean;
  is_duplicate?: boolean;
  duplicate_of_id?: string;
  notes?: string;
  cgst?: number;
  sgst?: number;
  igst?: number;
}

export interface Shop {
  id: string;
  name: string;
  owner_name: string;
  phone: string;
  language_pref: Language;
  gst_number?: string;
  city: string;
  state: string;
  category: string;
  inbound_email: string;
  created_at: string;
  // Enhanced Indian Business & DigiLocker Compliance
  business_type?: BusinessType;
  kyc_verified?: boolean;
  digilocker_data?: DigiLockerVerification;
  compliance?: IndianComplianceDetails;
}

export interface UserProfile {
  id: string;
  phone: string;
  email?: string;
  name: string;
  role: 'owner' | 'manager' | 'accountant';
  active_shop_id: string;
  shops: Shop[];
  created_at: string;
  last_login: string;
  kyc_status: 'verified' | 'pending' | 'unverified';
  digilocker_data?: DigiLockerVerification;
}

export interface Vendor {
  id: string;
  shop_id: string;
  name_normalized: string;
  display_name: string;
  name_variants: string[];
  gst_number?: string;
  phone?: string;
  city?: string;
  category?: string;
  total_invoices: number;
  total_spend: number;
  last_invoice_date?: string;
}

export interface CorrectionLog {
  id: string;
  invoice_id: string;
  shop_id: string;
  timestamp: string;
  original_fields: Partial<ExtractedFields>;
  corrected_fields: Partial<ExtractedFields>;
  field_diff: Array<{
    field: string;
    original: any;
    corrected: any;
  }>;
}

export interface QueueJob {
  id: string;
  shop_id: string;
  source_channel: SourceChannel;
  image_url: string;
  image_name?: string;
  status: 'waiting' | 'active' | 'completed' | 'failed';
  progress: number;
  stage_message: string;
  created_at: string;
  completed_at?: string;
  result_invoice_id?: string;
  error?: string;
}

export interface OfflineSyncItem {
  id: string;
  temp_id: string;
  image_data_url: string;
  source_channel: SourceChannel;
  timestamp: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  error?: string;
}

export interface Customer {
  id: string;
  shop_id: string;
  name: string;
  phone: string;
  address?: string;
  city?: string;
  state: string; // State code or name, e.g., '09 - Uttar Pradesh'
  gstin?: string;
  customer_type: 'retail' | 'wholesale' | 'regular';
  credit_limit: number;
  outstanding_balance: number; // Positive = customer owes money (उधार)
  total_purchases: number;
  total_invoices_count: number;
  last_transaction_date?: string;
  created_at: string;
}

export interface CustomerPayment {
  id: string;
  customer_id: string;
  customer_name: string;
  amount: number;
  payment_mode: 'cash' | 'upi' | 'bank_transfer' | 'cheque';
  date: string;
  receipt_number: string;
  notes?: string;
  created_at: string;
}

export interface SalesInvoiceItem {
  id?: string;
  name: string;
  quantity: number;
  unit?: string;
  rate: number; // Selling price per unit
  cost_price: number; // Cost price to shopkeeper (खरीद भाव) for accurate profit computation
  gst_rate: number; // 0, 5, 12, 18, 28
  hsn?: string;
  taxable_amount: number;
  gst_amount: number;
  total: number;
}

export interface SalesInvoice {
  id: string;
  shop_id: string;
  invoice_number: string;
  customer_id?: string;
  customer_name: string;
  customer_phone?: string;
  customer_gstin?: string;
  customer_state: string; // e.g. '09 - Uttar Pradesh' or '07 - Delhi'
  shop_state: string;
  invoice_date: string;
  supply_type: 'intra_state' | 'inter_state';
  gst_pricing_mode: 'inclusive' | 'exclusive' | 'exempt';
  items: SalesInvoiceItem[];
  subtotal_taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  total_gst: number;
  discount_amount: number;
  round_off: number;
  grand_total: number;
  total_cost_price: number;
  profit_amount: number; // grand_total - total_gst - total_cost_price (or gross profit)
  profit_margin_pct: number;
  payment_mode: 'cash' | 'upi' | 'credit' | 'split';
  paid_amount: number;
  due_amount: number;
  status: 'paid' | 'unpaid' | 'partial';
  notes?: string;
  created_at: string;
}

export interface GstSettings {
  shop_gstin: string;
  shop_state_code: string; // '09'
  shop_state_name: string; // 'Uttar Pradesh'
  tax_scheme: 'regular' | 'composition' | 'unregistered';
  default_pricing_mode: 'inclusive' | 'exclusive';
  default_gst_rate: number;
  e_way_bill_threshold: number;
  enable_cess: boolean;
}

export interface PeriodStats {
  period_key: string;
  period_label: string;
  period_type: 'monthly' | 'quarterly' | 'yearly';
  total_sales: number;
  total_purchases: number; // COGS
  gross_profit: number;
  profit_margin_pct: number;
  sales_count: number;
  purchases_count: number;
  gst_collected_output: number;
  gst_paid_input_itc: number;
  net_gst_liability: number;
  cash_sales: number;
  credit_sales: number;
  outstanding_collected: number;
}

export interface LedgerSummary {
  total_invoices: number;
  total_spend: number;
  total_gst_itc: number;
  pending_review_count: number;
  duplicate_count: number;
  confirmed_count: number;
  monthly_spend: { month: string; spend: number; gst: number }[];
  top_vendors: { vendor_name: string; total_spend: number; invoice_count: number }[];
  channel_breakdown: { channel: SourceChannel; count: number }[];
  // Shopkeeper Financial Stats
  total_sales_revenue?: number;
  total_gross_profit?: number;
  total_customer_udhaar?: number;
  total_customers_count?: number;
  period_stats?: PeriodStats[];
}

