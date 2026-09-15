import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  online: string;
  offline: string;
  offlineSyncPending: string;
  syncNow: string;
  allSynced: string;
  
  // Navigation & Tabs
  tabLedger: string;
  tabCustomers: string;
  tabFinancials: string;
  tabGstOptions: string;
  tabCapture: string;
  tabQueue: string;
  tabAnalytics: string;
  tabSettings: string;
  tabSalesBills: string;
  
  // Dashboard & Ledger
  totalSpend: string;
  claimableGst: string;
  pendingReview: string;
  totalInvoices: string;
  filterAll: string;
  filterReview: string;
  filterConfirmed: string;
  filterGst: string;
  filterDuplicate: string;
  searchPlaceholder: string;
  noInvoicesFound: string;
  viewDetails: string;
  reviewBill: string;
  confirmedBadge: string;
  pendingBadge: string;
  duplicateBadge: string;
  inputGstCredit: string;
  date: string;
  billNo: string;
  vendor: string;
  amount: string;
  itemsCount: string;
  
  // Ingestion Channels
  captureHeading: string;
  captureSubheading: string;
  channel1Title: string;
  channel1Desc: string;
  channel1Action: string;
  channel2Title: string;
  channel2Desc: string;
  channel2Action: string;
  channel3Title: string;
  channel3Desc: string;
  channel3Action: string;
  channel3Address: string;
  copyAddress: string;
  addressCopied: string;
  simulateEmail: string;
  
  // Camera & Scanner
  cameraTitle: string;
  alignDocumentPrompt: string;
  takePhoto: string;
  retake: string;
  autoEdgeDetected: string;
  adjustCorners: string;
  enhanceDocument: string;
  cropAndProcess: string;
  uploadFromGallery: string;
  
  // Share Intent Simulation
  whatsappSimulatorTitle: string;
  whatsappSimulatorDesc: string;
  senderName: string;
  shareToApp: string;
  sharedSuccess: string;
  
  // Review & Correction UI
  reviewTitle: string;
  originalBill: string;
  extractedDetails: string;
  vendorName: string;
  invoiceDate: string;
  invoiceNumber: string;
  totalAmount: string;
  gstAmount: string;
  gstin: string;
  itemsList: string;
  itemName: string;
  qty: string;
  rate: string;
  total: string;
  addItem: string;
  removeItem: string;
  confidenceScore: string;
  highConfidence: string;
  lowConfidenceWarning: string;
  duplicateWarningTitle: string;
  duplicateWarningDesc: string;
  keepBoth: string;
  discardThis: string;
  confirmAndSave: string;
  saveChanges: string;
  cancel: string;
  loggedForImprovement: string;
  
  // Extraction Queue
  queueTitle: string;
  queueSubheading: string;
  processing: string;
  waitingInQueue: string;
  extractingAi: string;
  checkingDedup: string;
  autoPosted: string;
  sentToReview: string;
  retryJob: string;
  emptyQueue: string;
  
  // GST & Analytics
  analyticsTitle: string;
  gstSummaryTitle: string;
  cgst: string;
  sgst: string;
  igst: string;
  topVendors: string;
  spendShare: string;
  downloadReport: string;
  shareLedgerWhatsapp: string;
  
  // Auth & Profile
  phoneLoginTitle: string;
  phoneLoginDesc: string;
  enterMobileNumber: string;
  getOtp: string;
  enterOtp: string;
  verifyAndLogin: string;
  resendOtp: string;
  shopDetails: string;
  changeLanguage: string;
  logout: string;
  signIn: string;
  signUp: string;
  createAccount: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  businessName: string;
  ownerName: string;
  emailAddress: string;
  selectState: string;
  businessType: string;
  
  // Quick Actions & Tooltips
  tapToScan: string;
  quickCapture: string;
  audioGuide: string;

  // Customers & Khata
  customersTitle: string;
  totalUdhaarOutstanding: string;
  totalCustomers: string;
  collectedThisMonth: string;
  addCustomer: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerState: string;
  customerGstin: string;
  customerType: string;
  creditLimit: string;
  pendingUdhaar: string;
  recordPayment: string;
  paymentMode: string;
  paymentAmount: string;
  whatsappReminder: string;
  whatsappReminderSent: string;
  settleKhata: string;
  customerHistory: string;
  
  // Sales Invoices & Billing
  createSalesBill: string;
  salesBillsTitle: string;
  taxInclusive: string;
  taxExclusive: string;
  nonGstBill: string;
  grossRevenue: string;
  grossProfit: string;
  profitMargin: string;
  costPrice: string;
  sellingPrice: string;
  profitEarned: string;
  intraStateGst: string;
  interStateGst: string;
  
  // Financial Analytics Periods
  periodMonthly: string;
  periodQuarterly: string;
  periodYearly: string;
  monthlySales: string;
  monthlyRevenue: string;
  monthlyProfit: string;
  quarterlySales: string;
  quarterlyRevenue: string;
  quarterlyProfit: string;
  yearlySales: string;
  yearlyRevenue: string;
  yearlyProfit: string;
  
  // GST Statewise & Schemes
  gstOptionsTitle: string;
  statewiseRules: string;
  taxSchemeRegular: string;
  taxSchemeComposition: string;
  taxSchemeUnregistered: string;
  originState: string;
  destinationState: string;
  outputGstSales: string;
  inputGstPurchases: string;
  netGstPayableGovt: string;
  compositionTurnoverTax: string;

  // Onboarding & Indian Regulatory Compliance
  onboardingTitle: string;
  stepLanguage: string;
  stepAuth: string;
  stepKyc: string;
  stepBusinessType: string;
  stepGovtCompliance: string;
  stepShopProfile: string;
  digilockerKycTitle: string;
  digilockerKycDesc: string;
  connectDigiLocker: string;
  digilockerVerified: string;
  aadhaarMasked: string;
  panVerified: string;
  businessTypeQuestion: string;
  registeredGstTitle: string;
  registeredGstDesc: string;
  unregisteredRetailTitle: string;
  unregisteredRetailDesc: string;
  freelancerTitle: string;
  freelancerDesc: string;
  compositionTitle: string;
  compositionDesc: string;
  gstCheckQuestion: string;
  hasGstYes: string;
  hasGstNo: string;
  udyamNumberLabel: string;
  gumastaLabel: string;
  fssaiLabel: string;
  freelancerNote: string;
}

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English (Primary)' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'hinglish', label: 'Hinglish', nativeLabel: 'Hinglish' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
];

export const translations: Record<string, TranslationDictionary> = {
  hi: {
    appName: 'हिसाब ऐप',
    appTagline: 'दुकानदारों के लिए ऑटो-बिल, ग्राहक खाता, GST व मुनाफ़ा',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन (डेटा सुरक्षित)',
    offlineSyncPending: 'बिल सिंक होना बाकी है',
    syncNow: 'अभी सिंक करें',
    allSynced: 'सभी बिल सिंक हो चुके हैं',
    
    tabLedger: 'ख़रीद बहीखाता',
    tabCustomers: 'ग्राहक (उधारी खाता)',
    tabFinancials: 'हिसाब व मुनाफ़ा',
    tabGstOptions: 'GST व टैक्स',
    tabCapture: 'बिल जोड़ें',
    tabQueue: 'प्रोसेसिंग',
    tabAnalytics: 'ITC रिपोर्ट',
    tabSettings: 'दुकान',
    tabSalesBills: 'बिक्री बिल',
    
    totalSpend: 'कुल खरीदारी (Purchases)',
    claimableGst: 'GST इनपुट क्लेम (ITC)',
    pendingReview: 'समीक्षा बाकी',
    totalInvoices: 'कुल बिल',
    filterAll: 'सभी बिल',
    filterReview: 'जाँच बाकी',
    filterConfirmed: 'पुष्ट (पक्के)',
    filterGst: 'GST बिल',
    filterDuplicate: 'संभावित डुप्लीकेट',
    searchPlaceholder: 'सप्लायर, ग्राहक, बिल नंबर या रकम खोजें...',
    noInvoicesFound: 'कोई बिल नहीं मिला। नीचे बटन दबाकर नया बिल जोड़ें।',
    viewDetails: 'बिल देखें',
    reviewBill: 'जाँच करें व पुष्टि दें',
    confirmedBadge: 'खाते में दर्ज',
    pendingBadge: 'जाँच आवश्यक',
    duplicateBadge: 'डुप्लीकेट अलर्ट',
    inputGstCredit: 'GST क्रेडिट',
    date: 'तारीख',
    billNo: 'बिल नं.',
    vendor: 'सप्लायर (पार्टी)',
    amount: 'कुल रकम',
    itemsCount: 'सामान (आइटम)',
    
    captureHeading: 'नया बिल कैसे जोड़ना चाहते हैं?',
    captureSubheading: 'व्हाट्सएप से शेयर करें, कैमरे से फोटो खींचें, या ईमेल से मंगाएं',
    channel1Title: '1. व्हाट्सएप से सीधा शेयर (Share-Sheet)',
    channel1Desc: 'सप्लायर ने व्हाट्सएप पर फोटो भेजी? सीधे "Share" दबाकर हिसाब ऐप चुनें।',
    channel1Action: 'व्हाट्सएप शेयर आज़माएं',
    channel2Title: '2. कैमरे से स्कैन करें (Auto-Crop)',
    channel2Desc: 'कागज़ी बिल की फोटो खींचें, किनारे अपने-आप कट जाएंगे व साफ़ हो जाएंगे।',
    channel2Action: 'कैमरा चालू करें',
    channel3Title: '3. दुकान की ईमेल पर मंगाएं (Inbound Email)',
    channel3Desc: 'सप्लायर को अपनी खास दुकान ईमेल दें, बिल सीधे यहाँ आ जाएगा।',
    channel3Action: 'ईमेल पता देखें',
    channel3Address: 'दुकान ईमेल:',
    copyAddress: 'ईमेल कॉपी करें',
    addressCopied: 'ईमेल कॉपी हो गया!',
    simulateEmail: 'सप्लायर से ईमेल टेस्ट करें',
    
    cameraTitle: 'बिल का फ़ोटो लें',
    alignDocumentPrompt: 'बिल को चौखट के अंदर रखें। किनारे अपने आप पहचाने जाएंगे।',
    takePhoto: 'फोटो खींचे',
    retake: 'दोबारा लें',
    autoEdgeDetected: 'किनारे पहचान लिए गए ✓',
    adjustCorners: 'कोनों को आवश्यकतानुसार ठीक करें',
    enhanceDocument: 'दस्तावेज़ साफ़ करें (B&W)',
    cropAndProcess: 'काटें और प्रोसेस करें',
    uploadFromGallery: 'गैलरी / फ़ाइल से चुनें',
    
    whatsappSimulatorTitle: 'व्हाट्सएप शेयर-शीट डेमो',
    whatsappSimulatorDesc: 'देखें कैसे व्हाट्सएप पर आए बिल को 1-टैप में सीधे बहीखाते में लाया जाता है',
    senderName: 'रमेश ट्रेडिंग / ITC डिस्ट्रीब्यूटर',
    shareToApp: 'हिसाब ऐप में शेयर करें',
    sharedSuccess: 'बिल सफलतापूर्वक प्रोसेसिंग कतार में जुड़ गया!',
    
    reviewTitle: 'बिल की जाँच करें',
    originalBill: 'मूल बिल फ़ोटो',
    extractedDetails: 'पहचाने गए विवरण',
    vendorName: 'सप्लायर (पार्टी का नाम)',
    invoiceDate: 'बिल की तारीख',
    invoiceNumber: 'बिल नंबर (Invoice No)',
    totalAmount: 'कुल रकम (₹)',
    gstAmount: 'GST टैक्स रकम (₹)',
    gstin: 'GSTIN नंबर',
    itemsList: 'सामानों की सूची',
    itemName: 'सामान का नाम',
    qty: 'मात्रा',
    rate: 'दर (₹)',
    total: 'रकम (₹)',
    addItem: '+ सामान जोड़ें',
    removeItem: 'हटाएं',
    confidenceScore: 'AI पहचान स्तर:',
    highConfidence: 'उच्च सटीकता (High Confidence) - स्वतः पुष्ट',
    lowConfidenceWarning: 'कृपया हाइलाइट किए गए बॉक्स की जाँच कर लें',
    duplicateWarningTitle: 'सावधान: यह बिल पहले भी दर्ज किया जा चुका है',
    duplicateWarningDesc: 'समान सप्लायर, रकम और तारीख का बिल बहीखाते में पहले से मौजूद है।',
    keepBoth: 'दोनों रखें (अलग बिल है)',
    discardThis: 'रद्द करें (डुप्लीकेट)',
    confirmAndSave: 'पुष्टि करें और बहीखाते में जोड़ें',
    saveChanges: 'बदलाव सुरक्षित करें',
    cancel: 'रद्द करें',
    loggedForImprovement: 'सुधार दर्ज हो गया।',
    
    queueTitle: 'बिल निष्कर्षण कतार (Queue)',
    queueSubheading: 'बैकग्राउंड में AI विजन मॉडल बिलों को पढ़ रहा है...',
    processing: 'प्रोसेसिंग जारी...',
    waitingInQueue: 'कतार में प्रतीक्षारत',
    extractingAi: 'Vision LLM विवरण निकाल रहा है...',
    checkingDedup: 'डुप्लीकेट बिल की जाँच...',
    autoPosted: 'उच्च विश्वास - स्वतः दर्ज ✓',
    sentToReview: 'समीक्षा हेतु भेजा गया ⚠️',
    retryJob: 'दोबारा कोशिश करें',
    emptyQueue: 'कतार में कोई बिल बाकी नहीं है। सभी बिल बहीखाते में दर्ज हो चुके हैं।',
    
    analyticsTitle: 'GST व हिसाब-किताब',
    gstSummaryTitle: 'इस अवधि का GST इनपुट टैक्स क्रेडिट (ITC Claimable)',
    cgst: 'CGST (केन्द्रीय कर)',
    sgst: 'SGST (राज्य कर)',
    igst: 'IGST (एकीकृत कर)',
    topVendors: 'मुख्य सप्लायर और खरीद हिस्सा',
    spendShare: 'हिस्सा',
    downloadReport: 'रिपोर्ट डाउनलोड करें (Excel/CSV)',
    shareLedgerWhatsapp: 'व्हाट्सएप पर रिपोर्ट भेजें',
    
    phoneLoginTitle: 'दुकानदार लॉगिन',
    phoneLoginDesc: 'अपना 10-अंकों का मोबाइल नंबर दर्ज करें। पासवर्ड की जरूरत नहीं।',
    enterMobileNumber: 'मोबाइल नंबर',
    getOtp: 'OTP प्राप्त करें',
    enterOtp: '4 अंकों का OTP डालें',
    verifyAndLogin: 'सत्यापित करें व आगे बढ़ें',
    resendOtp: 'दोबारा OTP भेजें',
    shopDetails: 'दुकान की जानकारी',
    changeLanguage: 'भाषा बदलें',
    logout: 'लॉग आउट',
    signIn: 'साइन इन (Sign In)',
    signUp: 'साइन अप / नया खाता (Sign Up)',
    createAccount: 'नया खाता बनाएं',
    alreadyHaveAccount: 'पहले से खाता है? साइन इन करें',
    dontHaveAccount: 'नया खाता चाहिए? यहाँ साइन अप करें',
    businessName: 'दुकान / फर्म का नाम',
    ownerName: 'दुकानदार / मालिक का नाम',
    emailAddress: 'ईमेल पता (वैकल्पिक)',
    selectState: 'राज्य चुनें (State)',
    businessType: 'व्यापार का प्रकार',
    
    tapToScan: 'बिल स्कैन करें',
    quickCapture: 'बिल जोड़ें +',
    audioGuide: 'हिंदी में सुनें',

    // Customers & Khata
    customersTitle: 'ग्राहक व उधारी खाता (Customer Khata)',
    totalUdhaarOutstanding: 'बाजार में कुल उधारी (बाकी)',
    totalCustomers: 'कुल दर्ज ग्राहक',
    collectedThisMonth: 'इस महीने वसूली',
    addCustomer: '+ नया ग्राहक जोड़ें',
    customerName: 'ग्राहक का नाम',
    customerPhone: 'मोबाइल नंबर',
    customerAddress: 'पता / मोहल्ला',
    customerState: 'राज्य (State)',
    customerGstin: 'ग्राहक का GSTIN (वैकल्पिक)',
    customerType: 'ग्राहक प्रकार',
    creditLimit: 'उधारी सीमा (Credit Limit)',
    pendingUdhaar: 'बाक़ी उधारी',
    recordPayment: 'रकम जमा करें',
    paymentMode: 'भुगतान माध्यम (Cash / UPI / Bank)',
    paymentAmount: 'जमा की गई रकम (₹)',
    whatsappReminder: 'व्हाट्सएप तकादा भेजें',
    whatsappReminderSent: 'तकादा संदेश भेजा गया!',
    settleKhata: 'खाता चुकता करें',
    customerHistory: 'लेन-देन इतिहास',
    
    // Sales Invoices & Billing
    createSalesBill: '+ नया बिक्री बिल (POS)',
    salesBillsTitle: 'बिक्री बिल रजिस्टर',
    taxInclusive: 'MRP में GST शामिल (Inclusive)',
    taxExclusive: 'अलग से GST जोड़ें (Exclusive)',
    nonGstBill: 'बिना टैक्स का सादा बिल (Bill of Supply)',
    grossRevenue: 'कुल बिक्री (Revenue)',
    grossProfit: 'कुल मुनाफ़ा (Profit)',
    profitMargin: 'मुनाफ़ा मार्जिन (%)',
    costPrice: 'खरीद भाव (लागत)',
    sellingPrice: 'बिक्री भाव',
    profitEarned: 'कमाई / मुनाफ़ा',
    intraStateGst: 'राज्य के भीतर (CGST + SGST)',
    interStateGst: 'दूसरे राज्य में बिक्री (IGST)',
    
    // Financial Analytics Periods
    periodMonthly: 'मासिक हिसाब (Monthly)',
    periodQuarterly: 'तिमाही हिसाब (Quarterly)',
    periodYearly: 'सालाना हिसाब (Yearly)',
    monthlySales: 'मासिक कुल बिक्री',
    monthlyRevenue: 'मासिक आय / रेवेन्यू',
    monthlyProfit: 'मासिक शुद्ध मुनाफ़ा',
    quarterlySales: 'तिमाही बिक्री (Q1/Q2/Q3/Q4)',
    quarterlyRevenue: 'तिमाही रेवेन्यू',
    quarterlyProfit: 'तिमाही मुनाफ़ा',
    yearlySales: 'सालाना कुल बिक्री (FY)',
    yearlyRevenue: 'सालाना रेवेन्यू',
    yearlyProfit: 'सालाना कुल मुनाफ़ा',
    
    // GST Statewise & Schemes
    gstOptionsTitle: 'GST सेटिंग्स व राज्यवार नियम',
    statewiseRules: 'राज्यवार GST कोड व नियम',
    taxSchemeRegular: 'रेगुलर GST (इनपुट क्रेडिट क्लेम योग्य)',
    taxSchemeComposition: 'कंपोजिशन स्कीम (1% टर्नओवर टैक्स - बिना ITC)',
    taxSchemeUnregistered: 'असंगठित / बिना GST वाली दुकान',
    originState: 'दुकान का राज्य (Origin State)',
    destinationState: 'सप्लाई / बिक्री का राज्य (Place of Supply)',
    outputGstSales: 'बिक्री पर वसूला गया GST (Output GST)',
    inputGstPurchases: 'खरीदारी पर चुकाया गया GST (Input ITC)',
    netGstPayableGovt: 'सरकार को देय शुद्ध टैक्स (Net GST Payable)',
    compositionTurnoverTax: 'कंपोजिशन टर्नओवर टैक्स',

    // Onboarding & Indian Regulatory Compliance
    onboardingTitle: 'भारतीय व्यापार ऑनबोर्डिंग',
    stepLanguage: 'भाषा',
    stepAuth: 'फोन OTP',
    stepKyc: 'डिजिलॉकर KYC',
    stepBusinessType: 'व्यापार प्रकार',
    stepGovtCompliance: 'सरकारी नियम व टैक्स',
    stepShopProfile: 'दुकान प्रोफाइल',
    digilockerKycTitle: 'डिजिलॉकर पहचान सत्यापन (भारत सरकार)',
    digilockerKycDesc: 'कागज़ात के बिना डिजिलॉकर e-KYC द्वारा आधार / पैन तुरंत सत्यापित करें।',
    connectDigiLocker: 'डिजिलॉकर से सत्यापित करें',
    digilockerVerified: 'पहचान डिजिलॉकर द्वारा सत्यापित ✓',
    aadhaarMasked: 'आधार संख्या (UID)',
    panVerified: 'सत्यापित पैन कार्ड',
    businessTypeQuestion: 'आप भारत में किस प्रकार का व्यापार चलाते हैं?',
    registeredGstTitle: 'GST रजिस्टर्ड व्यापार (15 अंकों का GSTIN)',
    registeredGstDesc: 'GSTIN मौजूद है। इनपुट टैक्स क्रेडिट (ITC) व मासिक GSTR फाइलिंग चालू होगी।',
    unregisteredRetailTitle: 'छोटी दुकान / किराना (₹40 लाख तक GST छूट)',
    unregisteredRetailDesc: 'भारतीय कानून के तहत ₹40 लाख तक टर्नओवर पर GST अनिवार्य नहीं है। उद्यम MSME / गुमाश्ता मान्य।',
    freelancerTitle: 'फ्रीलांसर / स्वतंत्र पेशेवर (Freelancer)',
    freelancerDesc: 'सॉफ्टवेयर, डिज़ाइन या पेशेवर सेवाएं (टर्नओवर < ₹20 लाख)। GST व शॉप एक्ट से कानूनी छूट।',
    compositionTitle: 'कंपोजिशन स्कीम व्यापारी',
    compositionDesc: 'धारा 10 के तहत केवल 1% फिक्स टर्नओवर टैक्स चुकाने वाला छोटा व्यापारी।',
    gstCheckQuestion: 'क्या आपके पास GST नंबर (GSTIN) है?',
    hasGstYes: 'हाँ, मेरे पास GST नंबर है',
    hasGstNo: 'नहीं, मैं GST छूट / बिना GST के हूँ',
    udyamNumberLabel: 'उद्यम रजिस्ट्रेशन नंबर (MSME Udyam)',
    gumastaLabel: 'शॉप व प्रतिष्ठान लाइसेंस (गुमाश्ता / Shop Act)',
    fssaiLabel: 'FSSAI खाद्य सुरक्षा लाइसेंस नंबर',
    freelancerNote: 'भारतीय कानूनी नियम: ₹20 लाख से कम टर्नओवर वाले फ्रीलांसर्स को GST या शॉप एक्ट की आवश्यकता नहीं होती।',
  },
  en: {
    appName: 'Hisab App',
    appTagline: 'Auto-Invoice Capture, Customer Khata & Profit Manager',
    online: 'Online',
    offline: 'Offline (Data Safe)',
    offlineSyncPending: 'Invoices pending sync',
    syncNow: 'Sync Now',
    allSynced: 'All invoices synced',
    
    tabLedger: 'Purchases Ledger',
    tabCustomers: 'Customers (Khata)',
    tabFinancials: 'Profit & Revenue',
    tabGstOptions: 'GST & Taxes',
    tabCapture: 'Add Bill',
    tabQueue: 'Processing',
    tabAnalytics: 'ITC Reports',
    tabSettings: 'Shop',
    tabSalesBills: 'Sales Bills',
    
    totalSpend: 'Total Purchases',
    claimableGst: 'GST Input Tax Credit (ITC)',
    pendingReview: 'Review Pending',
    totalInvoices: 'Total Bills',
    filterAll: 'All Bills',
    filterReview: 'Review Needed',
    filterConfirmed: 'Confirmed',
    filterGst: 'GST Bills',
    filterDuplicate: 'Possible Duplicates',
    searchPlaceholder: 'Search supplier, customer, invoice no, or amount...',
    noInvoicesFound: 'No invoices found. Click below to add your first bill.',
    viewDetails: 'View Bill',
    reviewBill: 'Review & Verify',
    confirmedBadge: 'Posted to Ledger',
    pendingBadge: 'Review Required',
    duplicateBadge: 'Duplicate Alert',
    inputGstCredit: 'GST Credit',
    date: 'Date',
    billNo: 'Bill No.',
    vendor: 'Supplier / Vendor',
    amount: 'Total Amount',
    itemsCount: 'Items',
    
    captureHeading: 'How do you want to add this bill?',
    captureSubheading: 'Share directly from WhatsApp, scan with camera, or receive via shop email',
    channel1Title: '1. Share directly from WhatsApp (Share Sheet)',
    channel1Desc: 'Received a bill photo on WhatsApp? Tap Share and choose Hisab App.',
    channel1Action: 'Try WhatsApp Share Demo',
    channel2Title: '2. Scan with Smart Camera (Auto-Crop)',
    channel2Desc: 'Snap physical paper invoices with automatic boundary detection and perspective flattening.',
    channel2Action: 'Open Camera Scanner',
    channel3Title: '3. Inbound Shop Email Address',
    channel3Desc: 'Give your suppliers your dedicated shop email to receive digital invoices automatically.',
    channel3Action: 'View Inbound Email',
    channel3Address: 'Shop Inbound Email:',
    copyAddress: 'Copy Address',
    addressCopied: 'Address Copied!',
    simulateEmail: 'Simulate Inbound Supplier Email',
    
    cameraTitle: 'Scan Invoice Document',
    alignDocumentPrompt: 'Position the invoice within the frame. Edges are detected automatically.',
    takePhoto: 'Take Photo',
    retake: 'Retake',
    autoEdgeDetected: 'Edges Detected ✓',
    adjustCorners: 'Adjust corners if necessary',
    enhanceDocument: 'Enhance Document Contrast',
    cropAndProcess: 'Crop & Process',
    uploadFromGallery: 'Upload from Files / Gallery',
    
    whatsappSimulatorTitle: 'WhatsApp Share-Sheet Demo',
    whatsappSimulatorDesc: 'Simulate receiving a supplier invoice on WhatsApp and sharing it instantly to Hisab App',
    senderName: 'Ramesh Trading Co. / ITC Distributor',
    shareToApp: 'Share to Hisab App',
    sharedSuccess: 'Bill successfully queued for AI extraction!',
    
    reviewTitle: 'Review & Verify Invoice',
    originalBill: 'Original Invoice Photo',
    extractedDetails: 'Extracted Details',
    vendorName: 'Supplier / Vendor Name',
    invoiceDate: 'Invoice Date',
    invoiceNumber: 'Invoice Number',
    totalAmount: 'Grand Total Amount (₹)',
    gstAmount: 'GST Tax Amount (₹)',
    gstin: 'GSTIN Number',
    itemsList: 'Itemized Breakdown',
    itemName: 'Item Name',
    qty: 'Qty',
    rate: 'Rate (₹)',
    total: 'Total (₹)',
    addItem: '+ Add Item',
    removeItem: 'Delete',
    confidenceScore: 'Extraction Confidence:',
    highConfidence: 'High Confidence (Auto-Verified)',
    lowConfidenceWarning: 'Please review highlighted fields carefully before confirming',
    duplicateWarningTitle: 'Warning: Possible Duplicate Bill Detected',
    duplicateWarningDesc: 'An invoice with the same vendor, amount and date was already recorded.',
    keepBoth: 'Keep Both (Different Bill)',
    discardThis: 'Discard as Duplicate',
    confirmAndSave: 'Confirm & Post to Ledger',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    loggedForImprovement: 'Corrections logged for model improvement.',
    
    queueTitle: 'Ingestion & Extraction Queue',
    queueSubheading: 'Background worker running OCR & Vision LLM extraction pipeline...',
    processing: 'Processing...',
    waitingInQueue: 'Waiting in Queue',
    extractingAi: 'Vision LLM extracting fields...',
    checkingDedup: 'Checking for duplicate invoices...',
    autoPosted: 'High Confidence - Auto Posted ✓',
    sentToReview: 'Sent to Review Queue ⚠️',
    retryJob: 'Retry Job',
    emptyQueue: 'No pending items in queue. All invoices processed.',
    
    analyticsTitle: 'GST & Spend Reconciliation',
    gstSummaryTitle: 'Input Tax Credit (ITC) Claimable This Period',
    cgst: 'CGST (Central)',
    sgst: 'SGST (State)',
    igst: 'IGST (Integrated)',
    topVendors: 'Top Suppliers & Spend Share',
    spendShare: 'Share',
    downloadReport: 'Export Report (PDF/Excel)',
    shareLedgerWhatsapp: 'Share Summary on WhatsApp',
    
    phoneLoginTitle: 'Shopkeeper Login',
    phoneLoginDesc: 'Enter your 10-digit mobile number. No email or password needed.',
    enterMobileNumber: 'Mobile Number',
    getOtp: 'Get OTP',
    enterOtp: 'Enter 4-digit OTP',
    verifyAndLogin: 'Verify & Continue',
    resendOtp: 'Resend OTP',
    shopDetails: 'Shop Profile',
    changeLanguage: 'Change Language',
    logout: 'Log Out',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    createAccount: 'Create Merchant Account',
    alreadyHaveAccount: 'Already have an account? Sign In',
    dontHaveAccount: "Don't have an account? Sign Up Free",
    businessName: 'Business / Shop Name',
    ownerName: 'Merchant / Owner Name',
    emailAddress: 'Email Address (Optional)',
    selectState: 'Select State / Region',
    businessType: 'Business Scheme',
    
    tapToScan: 'Scan Bill',
    quickCapture: 'Add Bill +',
    audioGuide: 'Listen in Hindi',

    // Customers & Khata
    customersTitle: 'Customer Udhaar & Khata Ledger',
    totalUdhaarOutstanding: 'Total Market Udhaar (Outstanding)',
    totalCustomers: 'Total Active Customers',
    collectedThisMonth: 'Collected This Month',
    addCustomer: '+ Add New Customer',
    customerName: 'Customer Name',
    customerPhone: 'Phone Number',
    customerAddress: 'Address / Area',
    customerState: 'State (Place of Supply)',
    customerGstin: 'Customer GSTIN (Optional)',
    customerType: 'Customer Type',
    creditLimit: 'Credit Limit (₹)',
    pendingUdhaar: 'Outstanding Balance',
    recordPayment: 'Record Payment',
    paymentMode: 'Payment Mode',
    paymentAmount: 'Amount Received (₹)',
    whatsappReminder: 'Send WhatsApp Reminder',
    whatsappReminderSent: 'Reminder Sent via WhatsApp!',
    settleKhata: 'Settle Khata',
    customerHistory: 'Transaction History',
    
    // Sales Invoices & Billing
    createSalesBill: '+ New Sales Invoice (POS)',
    salesBillsTitle: 'Sales Bill Register',
    taxInclusive: 'GST Inclusive (MRP includes tax)',
    taxExclusive: 'GST Exclusive (Tax added on top)',
    nonGstBill: 'Non-GST / Bill of Supply (0% tax)',
    grossRevenue: 'Total Sales Revenue',
    grossProfit: 'Gross Profit',
    profitMargin: 'Profit Margin (%)',
    costPrice: 'Cost Price (Purchase Rate)',
    sellingPrice: 'Selling Price',
    profitEarned: 'Profit Earned',
    intraStateGst: 'Intra-State (CGST + SGST)',
    interStateGst: 'Inter-State (IGST)',
    
    // Financial Analytics Periods
    periodMonthly: 'Monthly Stats',
    periodQuarterly: 'Quarterly Stats (Q1-Q4)',
    periodYearly: 'Yearly Stats (FY)',
    monthlySales: 'Monthly Total Sales',
    monthlyRevenue: 'Monthly Revenue',
    monthlyProfit: 'Monthly Net Profit',
    quarterlySales: 'Quarterly Sales',
    quarterlyRevenue: 'Quarterly Revenue',
    quarterlyProfit: 'Quarterly Profit',
    yearlySales: 'Yearly Total Sales',
    yearlyRevenue: 'Yearly Revenue',
    yearlyProfit: 'Yearly Net Profit',
    
    // GST Statewise & Schemes
    gstOptionsTitle: 'GST Settings & Statewise Rules',
    statewiseRules: 'Statewise GST Codes & Inter/Intra Matrix',
    taxSchemeRegular: 'Regular GST (ITC Eligible, GSTR-1 & 3B)',
    taxSchemeComposition: 'Composition Scheme (1% Flat Turnover Tax, No ITC)',
    taxSchemeUnregistered: 'Unregistered / Small Kirana (< ₹40L exempt)',
    originState: 'Shop Origin State',
    destinationState: 'Place of Supply / Destination State',
    outputGstSales: 'Output GST Collected from Sales',
    inputGstPurchases: 'Input GST Paid on Purchases (ITC)',
    netGstPayableGovt: 'Net GST Payable to Govt (Output - Input)',
    compositionTurnoverTax: 'Composition Turnover Tax',

    // Onboarding & Indian Regulatory Compliance
    onboardingTitle: 'Indian Business Onboarding',
    stepLanguage: 'Language',
    stepAuth: 'Phone OTP',
    stepKyc: 'DigiLocker KYC',
    stepBusinessType: 'Business Type',
    stepGovtCompliance: 'Govt Compliance',
    stepShopProfile: 'Shop Profile',
    digilockerKycTitle: 'DigiLocker Identity Verification (Govt of India)',
    digilockerKycDesc: 'Securely verify your identity via DigiLocker e-KYC (Aadhaar / PAN) without paperwork.',
    connectDigiLocker: 'Verify with DigiLocker',
    digilockerVerified: 'Identity Verified via DigiLocker ✓',
    aadhaarMasked: 'Aadhaar (UID)',
    panVerified: 'Verified PAN',
    businessTypeQuestion: 'What type of business do you run in India?',
    registeredGstTitle: 'Registered Business with GSTIN',
    registeredGstDesc: 'You have a 15-digit GSTIN. Input Tax Credit (ITC) & monthly GSTR filing enabled.',
    unregisteredRetailTitle: 'Small Retail Shop / Kirana (Exempt under ₹40L)',
    unregisteredRetailDesc: 'Under Indian GST law, turnover under ₹40 Lakhs is exempt. Requires Udyam MSME, Gumasta, or FSSAI.',
    freelancerTitle: 'Freelancer / Individual Professional',
    freelancerDesc: 'Providing software, design, or professional services under ₹20 Lakhs. Exempt from GST & Shop Act.',
    compositionTitle: 'Composition Scheme Dealer',
    compositionDesc: 'Small trader paying flat 1% turnover tax under Section 10 of GST Act.',
    gstCheckQuestion: 'Do you have an active GST Number (GSTIN)?',
    hasGstYes: 'Yes, I have GSTIN',
    hasGstNo: 'No, I am exempt / without GST',
    udyamNumberLabel: 'Udyam Registration Number (MSME)',
    gumastaLabel: 'Shop & Establishment License (Gumasta)',
    fssaiLabel: 'FSSAI Food License Number',
    freelancerNote: 'Indian Regulatory Exemption: Freelancers with annual revenue under ₹20 Lakhs do not need GST or Shop & Establishment registration in India.',
  },
};

// Fallback to English (Primary) or requested Indian Language
export const getTranslation = (lang: Language): TranslationDictionary => {
  if (translations[lang]) {
    return translations[lang];
  }
  return translations.en || translations.hi;
};
