import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Info,
  ExternalLink,
  Code
} from 'lucide-react';
import { getTranslation } from '../locales/i18n';
import { Language, Shop } from '../types';
import { createSampleInvoiceImage } from '../data/sampleInvoices';

interface Channel3EmailIngestionProps {
  language: Language;
  shop: Shop;
  onIngestInvoice: (imageDataUrl: string, channel: 'email_inbound', hint?: any) => void;
}

export const Channel3EmailIngestion: React.FC<Channel3EmailIngestionProps> = ({
  language,
  shop,
  onIngestInvoice,
}) => {
  const t = getTranslation(language);
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [webhookLog, setWebhookLog] = useState<any | null>(null);

  const inboundAddress = `${shop.id}@ingestion.vyapar.in`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inboundAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateEmail = async () => {
    setIsSimulating(true);

    const emailPayload = {
      to_address: inboundAddress,
      from_address: 'billing@haldirams-distributor.in',
      subject: 'Tax Invoice: HLD/UP/99120 - Haldiram Snacks Pvt Ltd',
      attachments: [
        {
          filename: 'Invoice_HLD_99120.pdf',
          size_kb: 420,
        },
      ],
      body_text: 'Dear Merchant, please find attached the tax invoice for your recent supply order.',
      received_at: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/webhooks/email-inbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload),
      });
      const data = await res.json();
      setWebhookLog({ payload: emailPayload, response: data });

      // Ingest the sample email invoice
      const sampleImg = createSampleInvoiceImage(
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
      );

      setTimeout(() => {
        setIsSimulating(false);
        onIngestInvoice(sampleImg, 'email_inbound', {
          vendorName: 'Haldiram Snacks Pvt Ltd',
          invoiceNo: 'HLD/UP/99120',
          amount: 9800,
          date: '2026-08-25',
          gstin: '09AAACH5567Q1ZL',
        });
      }, 1000);
    } catch (e) {
      console.error('Email webhook error', e);
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Address Highlight Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t.channel3Title}</h3>
              <p className="text-xs text-slate-500">{t.channel3Desc}</p>
            </div>
          </div>
        </div>

        {/* Dedicated Address Box */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {t.channel3Address}
          </span>
          <div className="flex items-center justify-between gap-2">
            <code className="text-sm sm:text-base font-mono font-bold text-blue-700 break-all select-all">
              {inboundAddress}
            </code>
            <button
              id="copy-email-btn"
              onClick={handleCopy}
              className="shrink-0 bg-white hover:bg-slate-100 active:scale-95 text-slate-700 text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-bold transition border border-slate-200 shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? t.addressCopied : t.copyAddress}</span>
            </button>
          </div>
        </div>

        {/* Instructions for Suppliers */}
        <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-3.5 text-xs text-blue-900 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-blue-800">
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'hi' ? 'सप्लायर के लिए निर्देश' : 'How suppliers use this'}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-blue-800">
            {language === 'hi'
              ? 'सप्लायर को बताएं कि वे अपना PDF या फोटो बिल इसी ईमेल पते पर भेजें। आते ही AI बिल पढ़ लेगा।'
              : 'Suppliers can directly CC or forward PDF invoices to this email. Invoices land directly in your ledger queue.'}
          </p>
        </div>

        {/* Simulate Inbound Email Button */}
        <button
          id="simulate-email-btn"
          onClick={handleSimulateEmail}
          disabled={isSimulating}
          className="w-full bg-blue-700 hover:bg-blue-800 active:scale-98 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
        >
          {isSimulating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{language === 'hi' ? 'ईमेल आ रहा है...' : 'Receiving inbound email...'}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{t.simulateEmail} (Haldiram Snacks)</span>
            </>
          )}
        </button>
      </div>

      {/* Webhook Endpoint Payload Inspector */}
      {webhookLog && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs shadow-xs">
          <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-200 pb-2">
            <span className="flex items-center gap-1.5 text-blue-700 font-mono">
              <Code className="w-4 h-4" />
              POST /api/webhooks/email-inbound
            </span>
            <span className="text-emerald-800 text-[10px] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              HTTP 200 OK
            </span>
          </div>
          <pre className="bg-slate-50 border border-slate-200 p-3 rounded-xl font-mono text-[10px] text-slate-800 overflow-x-auto">
            {JSON.stringify(webhookLog, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
