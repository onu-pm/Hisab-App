import React, { useState } from 'react';
import {
  Share2,
  Send,
  CheckCircle2,
  Smartphone,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Upload,
  MessageCircle,
  FileCheck,
  ChevronRight,
  FileText
} from 'lucide-react';
import { WHATSAPP_SAMPLE_CHATS, createSampleInvoiceImage } from '../data/sampleInvoices';
import { getTranslation } from '../locales/i18n';
import { Language } from '../types';

interface Channel1ShareSheetProps {
  language: Language;
  onIngestInvoice: (imageDataUrl: string, channel: 'share_sheet', hint?: any) => void;
}

export const Channel1ShareSheet: React.FC<Channel1ShareSheetProps> = ({
  language,
  onIngestInvoice,
}) => {
  const t = getTranslation(language);
  const [selectedChatIndex, setSelectedChatIndex] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [justShared, setJustShared] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);

  const currentChat = WHATSAPP_SAMPLE_CHATS[selectedChatIndex];

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleSelectVyaparTarget = () => {
    setIsShareModalOpen(false);
    setJustShared(true);

    const payload = currentChat.invoicePayload;
    const sampleImage = customImage || createSampleInvoiceImage(
      payload.vendorName,
      payload.invoiceNo,
      payload.date,
      payload.amount,
      payload.gstin,
      payload.items,
      payload.isHandwritten
    );

    setTimeout(() => {
      setJustShared(false);
      onIngestInvoice(sampleImage, 'share_sheet', payload);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setCustomImage(url);
        onIngestInvoice(url, 'share_sheet', {
          vendorName: file.name.replace(/\.[^/.]+$/, ''),
          isHandwritten: false,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Intent Architecture Info Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-900 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-950 text-sm">
                {language === 'hi' ? 'प्राथमिक MVP फ्लो: OS Share Intent Target' : 'Primary MVP Flow: OS Share Intent Target'}
              </span>
              <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full font-mono font-medium">
                Android ACTION_SEND
              </span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {language === 'hi'
                ? 'दुकानदार को किसी भी ऐप (व्हाट्सएप/गैलरी) से सीधे "Share → व्यापार बिल" चुनने पर बिल बिना टाइप किए बहीखाते में चला जाता है।'
                : 'When a shopkeeper taps "Share → Vyapar Bill" in WhatsApp or Gallery, the invoice photo instantly streams to ingestion.'}
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp Simulator Screen */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {/* WhatsApp Green Top Header */}
        <div className="bg-emerald-700 px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center font-bold text-sm">
              {currentChat.sender.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-sm leading-none">{currentChat.sender}</h3>
              <span className="text-[11px] text-emerald-100">WhatsApp Business • {currentChat.phone}</span>
            </div>
          </div>
          <span className="text-xs bg-emerald-800/80 px-2 py-1 rounded text-emerald-100 font-mono">
            {currentChat.time}
          </span>
        </div>

        {/* WhatsApp Chat Selector Pills */}
        <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex gap-2 overflow-x-auto">
          {WHATSAPP_SAMPLE_CHATS.map((chat, idx) => (
            <button
              key={chat.id}
              onClick={() => {
                setSelectedChatIndex(idx);
                setCustomImage(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedChatIndex === idx
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {chat.sender.split(' ')[0]} ({chat.invoicePayload.isHandwritten ? (language === 'hi' ? 'कच्चा पर्चा' : 'Handwritten') : (language === 'hi' ? 'GST बिल' : 'Tax Bill')})
            </button>
          ))}
        </div>

        {/* Chat Message Stream */}
        <div className="p-4 bg-slate-100 min-h-[300px] flex flex-col justify-end space-y-3">
          {/* Supplier text message */}
          <div className="self-start max-w-[85%] bg-white text-slate-800 border border-slate-200 px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-xs shadow-xs">
            <p className="font-bold text-emerald-700 text-[11px] mb-0.5">{currentChat.sender}</p>
            <p className="text-slate-800 leading-snug">{currentChat.lastMessage}</p>
            <span className="text-[10px] text-slate-400 float-right mt-1">{currentChat.time}</span>
          </div>

          {/* Invoice Image Attachment Bubble */}
          <div className="self-start max-w-[90%] bg-white border border-slate-200 p-2.5 rounded-2xl rounded-tl-sm shadow-xs space-y-2">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
              <img
                src={
                  customImage ||
                  createSampleInvoiceImage(
                    currentChat.invoicePayload.vendorName,
                    currentChat.invoicePayload.invoiceNo,
                    currentChat.invoicePayload.date,
                    currentChat.invoicePayload.amount,
                    currentChat.invoicePayload.gstin,
                    currentChat.invoicePayload.items,
                    currentChat.invoicePayload.isHandwritten
                  )
                }
                alt="WhatsApp Invoice Attachment"
                className="w-full h-44 object-cover object-top filter group-hover:brightness-95 transition"
              />
              <div className="absolute top-2 right-2 bg-slate-900/90 text-white px-2 py-0.5 rounded text-[10px] font-mono shadow-xs">
                ₹{currentChat.invoicePayload.amount.toLocaleString('en-IN')}
              </div>
              <div className="absolute bottom-2 left-2 bg-emerald-50 border border-emerald-300 text-emerald-900 px-2 py-0.5 rounded text-[11px] font-bold shadow-xs">
                {currentChat.invoicePayload.isHandwritten ? (language === 'hi' ? '📝 कच्चा पर्चा' : '📝 Mandi Slip') : (language === 'hi' ? '🧾 पक्का GST बीजक' : '🧾 Tax Invoice')}
              </div>
            </div>

            {/* Tap to Share Action in WhatsApp */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 font-medium">
                {currentChat.invoicePayload.items.length} {t.itemsCount} • ₹{currentChat.invoicePayload.amount.toLocaleString('en-IN')}
              </span>
              
              <button
                id="whatsapp-share-btn"
                onClick={handleShareClick}
                className="bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition"
              >
                <Share2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'शेयर करें (Share)' : 'Share Intent'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery / File Fallback Option */}
        <div className="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>{language === 'hi' ? 'या अपनी फोन गैलरी से बिल फोटो चुनें:' : 'Or choose photo from device storage:'}</span>
          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition border border-slate-200">
            <Upload className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.uploadFromGallery}</span>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {/* Android Native Share Sheet Overlay Modal Simulation */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 space-y-4 shadow-xl animate-in slide-in-from-bottom duration-200">
            {/* Share Sheet Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-50 rounded-xl text-emerald-700 border border-emerald-200">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {language === 'hi' ? 'शेयर करें (Share target)' : 'Share image via...'}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    intent.setAction(Intent.ACTION_SEND)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            {/* Target Apps Grid */}
            <div className="grid grid-cols-4 gap-3 py-2">
              {/* PRIMARY VYAPAR BILL TARGET */}
              <button
                id="target-vyapar-app"
                onClick={handleSelectVyaparTarget}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-emerald-50 border-2 border-emerald-600 hover:bg-emerald-100 active:scale-95 transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
                  <FileCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-emerald-950 text-center leading-tight">
                  व्यापार बिल
                </span>
                <span className="text-[9px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded-full font-bold">
                  Auto-Ingest
                </span>
              </button>

              {/* Dummy other apps */}
              <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl opacity-40">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                  <Send className="w-5 h-5" />
                </div>
                <span className="text-[11px] text-slate-600 text-center">Messages</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl opacity-40">
                <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[11px] text-slate-600 text-center">Drive</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl opacity-40">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] text-slate-600 text-center">Bluetooth</span>
              </div>
            </div>

            {/* Quick Action Info */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
              <span>
                {language === 'hi' ? 'टैप करते ही AI बिल पढ़कर खाते में जोड़ देगा' : 'AI will automatically extract fields and post to queue'}
              </span>
              <button
                onClick={handleSelectVyaparTarget}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs"
              >
                <span>{language === 'hi' ? 'व्यापार बिल चुनें' : 'Choose Vyapar'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {justShared && (
        <div className="bg-emerald-700 text-white p-3 rounded-xl flex items-center gap-2 shadow-xs animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{t.sharedSuccess}</span>
        </div>
      )}
    </div>
  );
};
