import { Invoice, Shop, Vendor } from '../types';

export const INITIAL_SHOP: Shop = {
  id: 'shop-9821',
  name: 'गुप्ता किराना एवं जनरल स्टोर्स (Gupta Kirana Stores)',
  owner_name: 'रमेश कुमार गुप्ता (Ramesh Gupta)',
  phone: '+91 98765 43210',
  language_pref: 'hi',
  gst_number: '22AAAAA0000A1Z5',
  city: 'कानपुर (Kanpur)',
  state: 'उत्तर प्रदेश (Uttar Pradesh)',
  category: 'किराना एवं दैनिक उपभोक्ता वस्तुएं (FMCG Grocery)',
  inbound_email: 'shop-9821@ingestion.vyapar.in',
  created_at: '2026-08-01T09:00:00Z',
};

// Generate realistic SVG invoice mockups encoded as data URLs
export function createSampleInvoiceImage(
  vendorName: string,
  invoiceNo: string,
  date: string,
  amount: number,
  gstin: string,
  items: Array<{ name: string; qty: number; rate: number; total: number }>,
  isHandwritten = false
): string {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 850" width="600" height="850">
    <defs>
      <filter id="paper" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" numOctaves="3" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.98   0 0 0 0 0.97   0 0 0 0 0.94  0 0 0 1 0" />
      </filter>
      <linearGradient id="stamp" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#dc2626" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#991b1b" stop-opacity="0.8"/>
      </linearGradient>
    </defs>
    
    <!-- Paper Background -->
    <rect width="600" height="850" fill="${isHandwritten ? '#fffbeb' : '#fafaf9'}" />
    <rect width="560" height="810" x="20" y="20" fill="#ffffff" stroke="${isHandwritten ? '#d97706' : '#cbd5e1'}" stroke-width="${isHandwritten ? '1.5' : '2'}" rx="4" />
    
    ${
      isHandwritten
        ? `<!-- Handwritten Slip Style -->
        <text x="300" y="65" font-family="'Hind', sans-serif" font-size="24" font-weight="bold" fill="#b45309" text-anchor="middle">श्री गणेशाय नमः | कच्चा बिल / पर्चा</text>
        <text x="300" y="100" font-family="'Hind', sans-serif" font-size="26" font-weight="800" fill="#1e293b" text-anchor="middle">${vendorName}</text>
        <text x="300" y="125" font-family="'Hind', sans-serif" font-size="14" fill="#64748b" text-anchor="middle">थोक गल्ला एवं किराना व्यापारी, नया गंज, कानपुर | मो. 94150XXXXX</text>
        <line x1="40" y1="140" x2="560" y2="140" stroke="#d97706" stroke-width="2" stroke-dasharray="4,4" />
        
        <text x="50" y="170" font-family="'Hind', sans-serif" font-size="16" font-weight="bold" fill="#334155">पार्टी का नाम: <tspan font-weight="normal">गुप्ता किराना स्टोर्स</tspan></text>
        <text x="400" y="170" font-family="'Hind', sans-serif" font-size="15" fill="#334155">दिनांक: <tspan font-weight="bold">${date}</tspan></text>
        <text x="50" y="200" font-family="'Hind', sans-serif" font-size="15" fill="#334155">पर्चा नं.: <tspan font-weight="bold">${invoiceNo}</tspan></text>
        <text x="400" y="200" font-family="'Hind', sans-serif" font-size="14" fill="#64748b">GSTIN: <tspan font-weight="bold">${gstin || 'लागू नहीं (कच्चा)'}</tspan></text>
        
        <!-- Table Header -->
        <rect x="40" y="220" width="520" height="35" fill="#fef3c7" stroke="#f59e0b" />
        <text x="60" y="243" font-family="'Hind', sans-serif" font-size="14" font-weight="bold" fill="#92400e">क्र.सं.</text>
        <text x="140" y="243" font-family="'Hind', sans-serif" font-size="14" font-weight="bold" fill="#92400e">विवरण (आइटम)</text>
        <text x="350" y="243" font-family="'Hind', sans-serif" font-size="14" font-weight="bold" fill="#92400e">मात्रा</text>
        <text x="430" y="243" font-family="'Hind', sans-serif" font-size="14" font-weight="bold" fill="#92400e">भाव (₹)</text>
        <text x="510" y="243" font-family="'Hind', sans-serif" font-size="14" font-weight="bold" fill="#92400e">रकम (₹)</text>
        
        ${items
          .map(
            (it, i) => `
          <line x1="40" y1="${260 + i * 45}" x2="560" y2="${260 + i * 45}" stroke="#fde68a" />
          <text x="65" y="${290 + i * 45}" font-family="'Hind', sans-serif" font-size="15" fill="#334155">${i + 1}</text>
          <text x="120" y="${290 + i * 45}" font-family="'Hind', sans-serif" font-size="15" font-weight="600" fill="#0f172a">${it.name}</text>
          <text x="360" y="${290 + i * 45}" font-family="'Hind', sans-serif" font-size="15" fill="#334155">${it.qty}</text>
          <text x="440" y="${290 + i * 45}" font-family="'Hind', sans-serif" font-size="15" fill="#334155">₹${it.rate}</text>
          <text x="510" y="${290 + i * 45}" font-family="'Hind', sans-serif" font-size="15" font-weight="bold" fill="#0f172a">₹${it.total.toLocaleString('en-IN')}</text>
        `
          )
          .join('')}
        
        <rect x="40" y="600" width="520" height="50" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5" />
        <text x="60" y="632" font-family="'Hind', sans-serif" font-size="16" font-weight="bold" fill="#92400e">कुल योग (Grand Total):</text>
        <text x="450" y="632" font-family="'Hind', sans-serif" font-size="22" font-weight="bold" fill="#b45309">₹${amount.toLocaleString('en-IN')}</text>
        
        <text x="60" y="700" font-family="'Hind', sans-serif" font-size="13" fill="#64748b">भुगतान की स्थिति: उधार खाता (खाते में नामे)</text>
        <text x="420" y="720" font-family="'Hind', sans-serif" font-size="15" font-weight="bold" fill="#334155">हस्ताक्षर विक्रेता</text>
        `
        : `<!-- Tax Invoice Style -->
        <rect x="20" y="20" width="560" height="70" fill="#1e293b" />
        <text x="300" y="50" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">TAX INVOICE / कर बीजक</text>
        <text x="300" y="72" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">ORIGINAL FOR RECIPIENT | SUPPLY COVERED UNDER GST</text>
        
        <text x="45" y="125" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="800" fill="#0f172a">${vendorName}</text>
        <text x="45" y="148" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#475569">Wholesale FMCG & Packaged Foods Distributor</text>
        <text x="45" y="168" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="bold" fill="#1e293b">GSTIN: <tspan fill="#2563eb">${gstin}</tspan></text>
        
        <rect x="360" y="105" width="200" height="75" fill="#f8fafc" stroke="#e2e8f0" rx="4" />
        <text x="375" y="128" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#64748b">Invoice No: <tspan font-weight="bold" fill="#0f172a">${invoiceNo}</tspan></text>
        <text x="375" y="148" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#64748b">Date: <tspan font-weight="bold" fill="#0f172a">${date}</tspan></text>
        <text x="375" y="168" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#64748b">State: <tspan font-weight="bold" fill="#0f172a">09 - Uttar Pradesh</tspan></text>
        
        <line x1="40" y1="195" x2="560" y2="195" stroke="#e2e8f0" />
        
        <text x="45" y="220" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" fill="#64748b">BILLED TO (BUYER):</text>
        <text x="45" y="240" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Gupta Kirana Stores (रमेश कुमार)</text>
        <text x="45" y="258" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#475569">GSTIN: 22AAAAA0000A1Z5 | Kanpur, UP</text>
        
        <!-- Table Header -->
        <rect x="40" y="280" width="520" height="30" fill="#f1f5f9" stroke="#cbd5e1" />
        <text x="50" y="300" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#334155">#</text>
        <text x="80" y="300" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#334155">Item Description</text>
        <text x="300" y="300" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#334155">HSN</text>
        <text x="360" y="300" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#334155">Qty</text>
        <text x="420" y="300" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#334155">Rate</text>
        <text x="495" y="300" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#334155">Amount (₹)</text>
        
        ${items
          .map(
            (it, i) => `
          <line x1="40" y1="${320 + i * 38}" x2="560" y2="${320 + i * 38}" stroke="#f1f5f9" />
          <text x="50" y="${340 + i * 38}" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#64748b">${i + 1}</text>
          <text x="80" y="${340 + i * 38}" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" fill="#0f172a">${it.name}</text>
          <text x="300" y="${340 + i * 38}" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#64748b">1905</text>
          <text x="365" y="${340 + i * 38}" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#334155">${it.qty} Ctn</text>
          <text x="425" y="${340 + i * 38}" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#334155">₹${it.rate}</text>
          <text x="495" y="${340 + i * 38}" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" fill="#0f172a">₹${it.total.toLocaleString('en-IN')}</text>
        `
          )
          .join('')}
        
        <!-- Totals Box -->
        <rect x="330" y="580" width="230" height="140" fill="#f8fafc" stroke="#cbd5e1" rx="4" />
        <text x="345" y="605" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#64748b">Taxable Amount:</text>
        <text x="545" y="605" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" fill="#0f172a" text-anchor="end">₹${(amount / 1.18).toFixed(2)}</text>
        
        <text x="345" y="630" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#64748b">CGST @ 9%:</text>
        <text x="545" y="630" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#059669" text-anchor="end">+₹${((amount - amount / 1.18) / 2).toFixed(2)}</text>
        
        <text x="345" y="655" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#64748b">SGST @ 9%:</text>
        <text x="545" y="655" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#059669" text-anchor="end">+₹${((amount - amount / 1.18) / 2).toFixed(2)}</text>
        
        <line x1="340" y1="675" x2="550" y2="675" stroke="#cbd5e1" />
        <text x="345" y="702" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="bold" fill="#0f172a">GRAND TOTAL:</text>
        <text x="545" y="702" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="800" fill="#2563eb" text-anchor="end">₹${amount.toLocaleString('en-IN')}</text>
        
        <!-- Stamp & Sign -->
        <g transform="translate(100, 640) rotate(-8)">
          <rect width="130" height="50" fill="none" stroke="url(#stamp)" stroke-width="3" rx="8" />
          <text x="65" y="24" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">PAID / RECEIVED</text>
          <text x="65" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="middle">CHECKED & PASSED</text>
        </g>
        `
    }
  </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'v-1',
    shop_id: 'shop-9821',
    name_normalized: 'itc limited distributor kanpur',
    display_name: 'ITC Limited (रमेश एजेंसी)',
    name_variants: ['ITC Ltd', 'ITC Limited Kanpur', 'Ramesh Agency ITC'],
    gst_number: '09AAACI1681G1ZM',
    phone: '+91 94150 12345',
    city: 'Kanpur',
    category: 'FMCG Biscuits & Soaps',
    total_invoices: 8,
    total_spend: 142500,
    last_invoice_date: '2026-08-28',
  },
  {
    id: 'v-2',
    shop_id: 'shop-9821',
    name_normalized: 'parle agro private limited',
    display_name: 'Parle Agro Pvt Ltd (श्री बालाजी ट्रेडर्स)',
    name_variants: ['Parle Agro', 'Balaji Traders Parle', 'Parle Products'],
    gst_number: '09AAACP4123R1ZG',
    phone: '+91 98390 67890',
    city: 'Kanpur',
    category: 'Beverages & Confectionery',
    total_invoices: 6,
    total_spend: 88400,
    last_invoice_date: '2026-08-27',
  },
  {
    id: 'v-3',
    shop_id: 'shop-9821',
    name_normalized: 'haldiram snacks private limited',
    display_name: 'Haldiram Snacks Pvt Ltd (अग्रवाल डिस्ट्रीब्यूटर्स)',
    name_variants: ['Haldirams', 'Haldiram Snacks', 'Agarwal Dist Kanpur'],
    gst_number: '09AAACH5567Q1ZL',
    phone: '+91 99190 22334',
    city: 'Kanpur',
    category: 'Namkeen & Sweets',
    total_invoices: 5,
    total_spend: 64200,
    last_invoice_date: '2026-08-25',
  },
  {
    id: 'v-4',
    shop_id: 'shop-9821',
    name_normalized: 'amul dairy gujarat cooperative',
    display_name: 'Amul Dairy (आनंद मिल्क डिपो)',
    name_variants: ['Amul GCMMF', 'Anand Milk Depot', 'Amul Dairy Products'],
    gst_number: '09AAACG1234F1ZQ',
    phone: '+91 94500 55667',
    city: 'Kanpur',
    category: 'Dairy Products',
    total_invoices: 12,
    total_spend: 96800,
    last_invoice_date: '2026-08-30',
  },
  {
    id: 'v-5',
    shop_id: 'shop-9821',
    name_normalized: 'shree shyam edible oils mandi',
    display_name: 'श्री श्याम आयल ट्रेडर्स (Mandi Wholesaler)',
    name_variants: ['Shree Shyam Oil', 'Shyam Traders Mandi', 'Shyam Galla Mandi'],
    gst_number: '09ABCDE9876K1Z2',
    phone: '+91 98380 99887',
    city: 'Kanpur Mandi',
    category: 'Mustard Oil & Ghee',
    total_invoices: 4,
    total_spend: 112000,
    last_invoice_date: '2026-08-22',
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-101',
    shop_id: 'shop-9821',
    vendor_name: 'ITC Limited (रमेश एजेंसी)',
    vendor_normalized_name: 'itc limited distributor kanpur',
    amount: 18450,
    gst_amount: 2814.4,
    cgst: 1407.2,
    sgst: 1407.2,
    invoice_date: '2026-08-28',
    invoice_number: 'ITC/KN/2026/0892',
    source_channel: 'share_sheet',
    raw_image_url: createSampleInvoiceImage(
      'ITC Limited (Ramesh Agencies)',
      'ITC/KN/2026/0892',
      '2026-08-28',
      18450,
      '09AAACI1681G1ZM',
      [
        { name: 'Sunfeast Dark Fantasy (Box 24)', qty: 5, rate: 1200, total: 6000 },
        { name: 'Aashirvaad Shudh Chakki Atta 10kg', qty: 15, rate: 380, total: 5700 },
        { name: 'Bingo Mad Angles Achaari Masti', qty: 4, rate: 950, total: 3800 },
        { name: 'Fiama Gel Bar Soap (Pack of 4)', qty: 5, rate: 590, total: 2950 },
      ]
    ),
    extraction_confidence: 0.96,
    status: 'confirmed',
    created_at: '2026-08-28T11:42:00Z',
    hash: 'itc limited distributor kanpur_18450_2026-08-28_09AAACI1681G1ZM',
    gst_number: '09AAACI1681G1ZM',
    payment_status: 'paid',
    items: [
      { name: 'Sunfeast Dark Fantasy (Box 24)', quantity: 5, unit: 'box', rate: 1200, total: 6000, hsn: '1905' },
      { name: 'Aashirvaad Shudh Chakki Atta 10kg', quantity: 15, unit: 'bag', rate: 380, total: 5700, hsn: '1101' },
      { name: 'Bingo Mad Angles Achaari Masti', quantity: 4, unit: 'ctn', rate: 950, total: 3800, hsn: '1905' },
      { name: 'Fiama Gel Bar Soap (Pack of 4)', quantity: 5, unit: 'pack', rate: 590, total: 2950, hsn: '3401' },
    ],
  },
  {
    id: 'inv-102',
    shop_id: 'shop-9821',
    vendor_name: 'Parle Agro Pvt Ltd (श्री बालाजी)',
    vendor_normalized_name: 'parle agro private limited',
    amount: 12600,
    gst_amount: 1922.0,
    cgst: 961.0,
    sgst: 961.0,
    invoice_date: '2026-08-27',
    invoice_number: 'PARLE-AG-8819',
    source_channel: 'camera_scan',
    raw_image_url: createSampleInvoiceImage(
      'Parle Agro Pvt Ltd (Balaji Traders)',
      'PARLE-AG-8819',
      '2026-08-27',
      12600,
      '09AAACP4123R1ZG',
      [
        { name: 'Frooti Tetrapack 160ml (Case 40)', qty: 8, rate: 650, total: 5200 },
        { name: 'Appy Fizz Pet 250ml (Case 30)', qty: 6, rate: 700, total: 4200 },
        { name: 'Parle-G Gold 1kg Family Pack', qty: 10, rate: 320, total: 3200 },
      ]
    ),
    extraction_confidence: 0.94,
    status: 'confirmed',
    created_at: '2026-08-27T16:15:00Z',
    hash: 'parle agro private limited_12600_2026-08-27_09AAACP4123R1ZG',
    gst_number: '09AAACP4123R1ZG',
    payment_status: 'paid',
    items: [
      { name: 'Frooti Tetrapack 160ml (Case 40)', quantity: 8, unit: 'case', rate: 650, total: 5200, hsn: '2202' },
      { name: 'Appy Fizz Pet 250ml (Case 30)', quantity: 6, unit: 'case', rate: 700, total: 4200, hsn: '2202' },
      { name: 'Parle-G Gold 1kg Family Pack', quantity: 10, unit: 'pack', rate: 320, total: 3200, hsn: '1905' },
    ],
  },
  {
    id: 'inv-103',
    shop_id: 'shop-9821',
    vendor_name: 'श्री श्याम आयल ट्रेडर्स (Mandi Slip)',
    vendor_normalized_name: 'shree shyam edible oils mandi',
    amount: 34500,
    gst_amount: 1642.8,
    cgst: 821.4,
    sgst: 821.4,
    invoice_date: '2026-08-26',
    invoice_number: 'MANDI-SLIP-401',
    source_channel: 'camera_scan',
    raw_image_url: createSampleInvoiceImage(
      'श्री श्याम आयल ट्रेडर्स (कच्चा पर्चा)',
      'MANDI-SLIP-401',
      '2026-08-26',
      34500,
      '09ABCDE9876K1Z2',
      [
        { name: 'सरसों का तेल (हाथी ब्रांड टीन 15kg)', qty: 10, rate: 2150, total: 21500 },
        { name: 'रिफाइंड सोयाबीन तेल (फॉर्च्यून 15L)', qty: 8, rate: 1625, total: 13000 },
      ],
      true
    ),
    extraction_confidence: 0.72,
    status: 'pending_review',
    created_at: '2026-08-26T18:05:00Z',
    hash: 'shree shyam edible oils mandi_34500_2026-08-26_09ABCDE9876K1Z2',
    gst_number: '09ABCDE9876K1Z2',
    payment_status: 'credit',
    items: [
      { name: 'सरसों का तेल (हाथी ब्रांड टीन 15kg)', quantity: 10, unit: 'tin', rate: 2150, total: 21500, hsn: '1514' },
      { name: 'रिफाइंड सोयाबीन तेल (फॉर्च्यून 15L)', quantity: 8, unit: 'tin', rate: 1625, total: 13000, hsn: '1507' },
    ],
    extracted_data: {
      vendor_name: 'श्री श्याम आयल ट्रेडर्स (Mandi Slip)',
      vendor_name_confidence: 0.75,
      invoice_number: 'MANDI-SLIP-401',
      invoice_number_confidence: 0.68,
      invoice_date: '2026-08-26',
      invoice_date_confidence: 0.78,
      amount: 34500,
      amount_confidence: 0.71,
      gst_amount: 1642.8,
      gst_amount_confidence: 0.65,
      vendor_gstin: '09ABCDE9876K1Z2',
      vendor_gstin_confidence: 0.70,
      items: [
        { name: 'सरसों का तेल (हाथी ब्रांड टीन 15kg)', quantity: 10, rate: 2150, total: 21500 },
        { name: 'रिफाइंड सोयाबीन तेल (फॉर्च्यून 15L)', quantity: 8, rate: 1625, total: 13000 },
      ],
      payment_status: 'credit',
      overall_confidence: 0.72,
      is_high_confidence: false,
      low_confidence_reasons: [
        'हस्तलिखित कच्चा पर्चा होने के कारण रकम और पर्चा नंबर पर धुंधलापन है',
        'Handwritten Mandi slip - please confirm total amount and item rates',
      ],
    },
  },
  {
    id: 'inv-104',
    shop_id: 'shop-9821',
    vendor_name: 'Haldiram Snacks Pvt Ltd',
    vendor_normalized_name: 'haldiram snacks private limited',
    amount: 9800,
    gst_amount: 1176.0,
    cgst: 588.0,
    sgst: 588.0,
    invoice_date: '2026-08-25',
    invoice_number: 'HLD/UP/99120',
    source_channel: 'email_inbound',
    raw_image_url: createSampleInvoiceImage(
      'Haldiram Snacks Pvt Ltd (Agarwal Dist)',
      'HLD/UP/99120',
      '2026-08-25',
      9800,
      '09AAACH5567Q1ZL',
      [
        { name: 'Haldiram Bhujia Sev 400g (Ctn 30)', qty: 3, rate: 1400, total: 4200 },
        { name: 'Haldiram All in One Mixture 200g', qty: 4, rate: 800, total: 3200 },
        { name: 'Haldiram Gulab Jamun Tin 1kg', qty: 10, rate: 240, total: 2400 },
      ]
    ),
    extraction_confidence: 0.98,
    status: 'confirmed',
    created_at: '2026-08-25T14:20:00Z',
    hash: 'haldiram snacks private limited_9800_2026-08-25_09AAACH5567Q1ZL',
    gst_number: '09AAACH5567Q1ZL',
    payment_status: 'paid',
    items: [
      { name: 'Haldiram Bhujia Sev 400g (Ctn 30)', quantity: 3, unit: 'ctn', rate: 1400, total: 4200, hsn: '2106' },
      { name: 'Haldiram All in One Mixture 200g', quantity: 4, unit: 'ctn', rate: 800, total: 3200, hsn: '2106' },
      { name: 'Haldiram Gulab Jamun Tin 1kg', quantity: 10, unit: 'tin', rate: 240, total: 2400, hsn: '2106' },
    ],
  },
  {
    id: 'inv-105',
    shop_id: 'shop-9821',
    vendor_name: 'Amul Dairy (आनंद मिल्क डिपो)',
    vendor_normalized_name: 'amul dairy gujarat cooperative',
    amount: 8400,
    gst_amount: 400.0,
    cgst: 200.0,
    sgst: 200.0,
    invoice_date: '2026-08-28',
    invoice_number: 'AMUL-D-0828',
    source_channel: 'share_sheet',
    raw_image_url: createSampleInvoiceImage(
      'Amul Dairy (Anand Milk Depot)',
      'AMUL-D-0828',
      '2026-08-28',
      8400,
      '09AAACG1234F1ZQ',
      [
        { name: 'Amul Taaza T-Special Milk (Crate 24)', qty: 5, rate: 720, total: 3600 },
        { name: 'Amul Butter 500g (Case 20)', qty: 1, rate: 2800, total: 2800 },
        { name: 'Amul Masti Dahi 400g Pouch', qty: 40, rate: 50, total: 2000 },
      ]
    ),
    extraction_confidence: 0.91,
    status: 'duplicate_flagged',
    created_at: '2026-08-28T19:10:00Z',
    hash: 'amul dairy gujarat cooperative_8400_2026-08-28_09AAACG1234F1ZQ',
    gst_number: '09AAACG1234F1ZQ',
    payment_status: 'paid',
    is_duplicate: true,
    duplicate_of_id: 'inv-100-amul-prev',
    items: [
      { name: 'Amul Taaza T-Special Milk (Crate 24)', quantity: 5, unit: 'crate', rate: 720, total: 3600, hsn: '0401' },
      { name: 'Amul Butter 500g (Case 20)', quantity: 1, unit: 'case', rate: 2800, total: 2800, hsn: '0405' },
      { name: 'Amul Masti Dahi 400g Pouch', quantity: 40, unit: 'pouch', rate: 50, total: 2000, hsn: '0403' },
    ],
  },
];

// Pre-cooked sample WhatsApp conversations for the Share Sheet simulator
export const WHATSAPP_SAMPLE_CHATS = [
  {
    id: 'chat-1',
    sender: 'रमेश भाई (ITC डिस्ट्रीब्यूटर कानपुर)',
    phone: '+91 94150 12345',
    lastMessage: 'भैया आज का नया माल निकल गया है, बिल फोटो देख लो।',
    time: 'आज, 10:15 AM',
    unreadCount: 1,
    invoicePayload: {
      vendorName: 'ITC Limited (Ramesh Agency)',
      invoiceNo: 'ITC/KN/2026/0914',
      date: '2026-09-01',
      amount: 22800,
      gstin: '09AAACI1681G1ZM',
      items: [
        { name: 'Aashirvaad Select Sharbati Atta 5kg', qty: 20, rate: 310, total: 6200 },
        { name: 'Sunfeast Mom’s Magic Cashew & Almond', qty: 10, rate: 720, total: 7200 },
        { name: 'Savlon Antiseptic Liquid 500ml', qty: 15, rate: 180, total: 2700 },
        { name: 'Yippee Magic Masala Noodles (Ctn 48)', qty: 6, rate: 1116, total: 6700 },
      ],
      isHandwritten: false,
    },
  },
  {
    id: 'chat-2',
    sender: 'पटेल ब्रदर्स गल्ला मंडी (कच्चा आढ़त)',
    phone: '+91 98380 99887',
    lastMessage: 'गुप्ता जी, कल शाम की 12 बोरी चीनी और दाल का कच्चा पर्चा भेज रहा हूँ।',
    time: 'आज, 09:30 AM',
    unreadCount: 2,
    invoicePayload: {
      vendorName: 'पटेल ब्रदर्स गल्ला आढ़ती नया गंज',
      invoiceNo: 'PARCHA-908',
      date: '2026-09-01',
      amount: 41200,
      gstin: '09ABCDE9876K1Z2',
      items: [
        { name: 'उत्तम शुगर एम-30 (50kg बोरी)', qty: 6, rate: 2150, total: 12900 },
        { name: 'अरहर दाल फटका देसी (50kg बोरी)', qty: 4, rate: 5800, total: 23200 },
        { name: 'काबुली चना सुपर (25kg कट्टा)', qty: 2, rate: 2550, total: 5100 },
      ],
      isHandwritten: true,
    },
  },
  {
    id: 'chat-3',
    sender: 'श्री बालाजी ट्रेडर्स (पारले एग्रो)',
    phone: '+91 98390 67890',
    lastMessage: 'फ्रूटी और ऐपिज़ फिज़ की नई पेटी का पक्का टैक्स इनवॉइस।',
    time: 'कल, 04:45 PM',
    unreadCount: 0,
    invoicePayload: {
      vendorName: 'Parle Agro Pvt Ltd (Balaji Traders)',
      invoiceNo: 'PARLE-SEP-0012',
      date: '2026-08-31',
      amount: 15400,
      gstin: '09AAACP4123R1ZG',
      items: [
        { name: 'Frooti 1.2L Bottle (Pack of 12)', qty: 10, rate: 640, total: 6400 },
        { name: 'Appy Fizz 600ml (Pack of 24)', qty: 10, rate: 900, total: 9000 },
      ],
      isHandwritten: false,
    },
  },
];
