export interface IndianState {
  code: string; // 2-digit GST state code e.g. '09'
  name: string;
  hindiName: string;
  zone: 'North' | 'South' | 'East' | 'West' | 'Central' | 'North-East' | 'Union Territory';
}

export const INDIAN_STATES_GST: IndianState[] = [
  { code: '01', name: 'Jammu & Kashmir', hindiName: 'जम्मू और कश्मीर', zone: 'North' },
  { code: '02', name: 'Himachal Pradesh', hindiName: 'हिमाचल प्रदेश', zone: 'North' },
  { code: '03', name: 'Punjab', hindiName: 'पंजाब', zone: 'North' },
  { code: '04', name: 'Chandigarh', hindiName: 'चंडीगढ़', zone: 'Union Territory' },
  { code: '05', name: 'Uttarakhand', hindiName: 'उत्तराखंड', zone: 'North' },
  { code: '06', name: 'Haryana', hindiName: 'हरियाणा', zone: 'North' },
  { code: '07', name: 'Delhi', hindiName: 'दिल्ली (NCR)', zone: 'Union Territory' },
  { code: '08', name: 'Rajasthan', hindiName: 'राजस्थान', zone: 'North' },
  { code: '09', name: 'Uttar Pradesh', hindiName: 'उत्तर प्रदेश', zone: 'North' },
  { code: '10', name: 'Bihar', hindiName: 'बिहार', zone: 'East' },
  { code: '11', name: 'Sikkim', hindiName: 'सिक्किम', zone: 'North-East' },
  { code: '12', name: 'Arunachal Pradesh', hindiName: 'अरुणाचल प्रदेश', zone: 'North-East' },
  { code: '13', name: 'Nagaland', hindiName: 'नागालैंड', zone: 'North-East' },
  { code: '14', name: 'Manipur', hindiName: 'मणिपुर', zone: 'North-East' },
  { code: '15', name: 'Mizoram', hindiName: 'मिज़ोरम', zone: 'North-East' },
  { code: '16', name: 'Tripura', hindiName: 'त्रिपुरा', zone: 'North-East' },
  { code: '17', name: 'Meghalaya', hindiName: 'मेघालय', zone: 'North-East' },
  { code: '18', name: 'Assam', hindiName: 'असम', zone: 'North-East' },
  { code: '19', name: 'West Bengal', hindiName: 'पश्चिम बंगाल', zone: 'East' },
  { code: '20', name: 'Jharkhand', hindiName: 'झारखंड', zone: 'East' },
  { code: '21', name: 'Odisha', hindiName: 'ओडिशा', zone: 'East' },
  { code: '22', name: 'Chhattisgarh', hindiName: 'छत्तीसगढ़', zone: 'Central' },
  { code: '23', name: 'Madhya Pradesh', hindiName: 'मध्य प्रदेश', zone: 'Central' },
  { code: '24', name: 'Gujarat', hindiName: 'गुजरात', zone: 'West' },
  { code: '25', name: 'Daman & Diu', hindiName: 'दमन और दीव', zone: 'Union Territory' },
  { code: '26', name: 'Dadra & Nagar Haveli', hindiName: 'दादरा और नगर हवेली', zone: 'Union Territory' },
  { code: '27', name: 'Maharashtra', hindiName: 'महाराष्ट्र', zone: 'West' },
  { code: '28', name: 'Andhra Pradesh (Old)', hindiName: 'आंध्र प्रदेश', zone: 'South' },
  { code: '29', name: 'Karnataka', hindiName: 'कर्नाटक', zone: 'South' },
  { code: '30', name: 'Goa', hindiName: 'गोवा', zone: 'West' },
  { code: '31', name: 'Lakshadweep', hindiName: 'लक्षद्वीप', zone: 'Union Territory' },
  { code: '32', name: 'Kerala', hindiName: 'केरल', zone: 'South' },
  { code: '33', name: 'Tamil Nadu', hindiName: 'तमिलनाडु', zone: 'South' },
  { code: '34', name: 'Puducherry', hindiName: 'पुडुचेरी', zone: 'Union Territory' },
  { code: '35', name: 'Andaman & Nicobar Islands', hindiName: 'अंडमान और निकोबार', zone: 'Union Territory' },
  { code: '36', name: 'Telangana', hindiName: 'तेलंगाना', zone: 'South' },
  { code: '37', name: 'Andhra Pradesh (New)', hindiName: 'आंध्र प्रदेश (नया)', zone: 'South' },
  { code: '38', name: 'Ladakh', hindiName: 'लद्दाख', zone: 'Union Territory' },
];

export interface GstSlab {
  rate: number;
  label: string;
  hindiLabel: string;
  description: string;
  examples: string[];
}

export const GST_SLABS: GstSlab[] = [
  {
    rate: 0,
    label: '0% (Nil / Exempt)',
    hindiLabel: '0% (कर मुक्त - अनाज, दूध, सब्जियां)',
    description: 'Essential unprocessed staples & grains',
    examples: ['खुला अनाज (Wheat, Rice)', 'ताज़ा दूध (Fresh Milk)', 'दालें (Unbranded Pulses)', 'नमक (Salt)'],
  },
  {
    rate: 5,
    label: '5% (Essential Items)',
    hindiLabel: '5% (आवश्यक दैनिक वस्तुएं)',
    description: 'Basic packaged foods, edible oils, tea, sugar',
    examples: ['चीनी (Sugar)', 'चायपत्ती (Tea)', 'खाद्य तेल (Mustard/Refined Oil)', 'पैकेट आटा (Branded Atta)', 'पनीर (Packaged Paneer)'],
  },
  {
    rate: 12,
    label: '12% (Standard Foods)',
    hindiLabel: '12% (प्रसंस्कृत खाद्य पदार्थ)',
    description: 'Processed food, ghee, butter, fruit juices',
    examples: ['देसी घी (Pure Desi Ghee)', 'मक्खन (Butter)', 'मेवे (Almonds/Cashew)', 'टूथपेस्ट (Ayurvedic paste)', 'जैम (Fruit Jam)'],
  },
  {
    rate: 18,
    label: '18% (Standard FMCG & Retail)',
    hindiLabel: '18% (दुकान की अधिकांश वस्तुएं - साबुन, बिस्कुट)',
    description: 'Most packaged retail FMCG, toiletries, stationary',
    examples: ['साबुन (Toilet Soaps)', 'डिटर्जेंट पाउडर (Detergent)', 'शैम्पू (Shampoo)', 'बिस्कुट (Biscuits/Snacks)', 'स्टेशनरी (Pens/Notebooks)'],
  },
  {
    rate: 28,
    label: '28% (Luxury & Carbonated)',
    hindiLabel: '28% (शीतल पेय व विलासिता सामान)',
    description: 'Aerated soft drinks, tobacco, luxury items',
    examples: ['कोल्ड ड्रिंक्स (Aerated Soft Drinks)', 'एनर्जी ड्रिंक (Energy Drinks)', 'पान मसाला (Pan Masala)', 'इलेक्ट्रॉनिक उत्पाद (Electronics)'],
  },
];

export function getGstBreakdown(
  taxableAmount: number,
  gstRate: number,
  shopStateCode: string,
  customerStateCode: string,
  isInclusive = false
) {
  let baseTaxable = taxableAmount;
  let taxAmount = 0;

  if (isInclusive) {
    baseTaxable = (taxableAmount * 100) / (100 + gstRate);
    taxAmount = taxableAmount - baseTaxable;
  } else {
    taxAmount = (taxableAmount * gstRate) / 100;
  }

  const isIntraState = shopStateCode === customerStateCode;

  if (isIntraState) {
    const halfTax = taxAmount / 2;
    return {
      taxableAmount: Math.round(baseTaxable * 100) / 100,
      totalTax: Math.round(taxAmount * 100) / 100,
      cgst: Math.round(halfTax * 100) / 100,
      sgst: Math.round(halfTax * 100) / 100,
      igst: 0,
      cgstRate: gstRate / 2,
      sgstRate: gstRate / 2,
      igstRate: 0,
      isIntraState: true,
      grandTotal: Math.round((baseTaxable + taxAmount) * 100) / 100,
    };
  } else {
    return {
      taxableAmount: Math.round(baseTaxable * 100) / 100,
      totalTax: Math.round(taxAmount * 100) / 100,
      cgst: 0,
      sgst: 0,
      igst: Math.round(taxAmount * 100) / 100,
      cgstRate: 0,
      sgstRate: 0,
      igstRate: gstRate,
      isIntraState: false,
      grandTotal: Math.round((baseTaxable + taxAmount) * 100) / 100,
    };
  }
}
