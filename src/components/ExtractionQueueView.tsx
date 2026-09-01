import React from 'react';
import {
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { QueueJob, Language } from '../types';
import { getTranslation } from '../locales/i18n';

interface ExtractionQueueViewProps {
  language: Language;
  jobs: QueueJob[];
  onOpenReview: (invoiceId: string) => void;
  onRetryJob?: (jobId: string) => void;
}

export const ExtractionQueueView: React.FC<ExtractionQueueViewProps> = ({
  language,
  jobs,
  onOpenReview,
  onRetryJob,
}) => {
  const t = getTranslation(language);

  return (
    <div className="space-y-4">
      {/* Queue Pipeline Architecture Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t.queueTitle}</h3>
              <p className="text-xs text-slate-500 font-mono">Worker: BullMQ + Gemini 3.7 Flash Vision</p>
            </div>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full font-bold">
            {jobs.filter((j) => j.status === 'active' || j.status === 'waiting').length} {language === 'hi' ? 'कतार में' : 'Active'}
          </span>
        </div>

        {/* Pipeline Stages Indicator */}
        <div className="grid grid-cols-4 gap-1 text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
          <div className="p-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
            1. Ingestion
          </div>
          <div className="p-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
            2. Vision LLM
          </div>
          <div className="p-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
            3. Dedup Check
          </div>
          <div className="p-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
            4. Auto-Route
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-2.5">
        {jobs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">{t.emptyQueue}</h4>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'नया बिल जोड़ने के लिए नीचे "बिल जोड़ें" टैब पर जाएं।'
                : 'Tap "Add Bill" below to ingest a new invoice.'}
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className={`bg-white border rounded-2xl p-4 space-y-3 transition shadow-xs ${
                job.status === 'active'
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : job.status === 'completed'
                  ? 'border-slate-200'
                  : 'border-rose-200 bg-rose-50/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={job.image_url}
                      alt="Queue Thumbnail"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        {job.image_name || (language === 'hi' ? 'सप्लायर बिल' : 'Supplier Invoice')}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono uppercase border border-slate-200">
                        {job.source_channel.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{job.stage_message}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {job.status === 'active' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t.processing}</span>
                    </span>
                  )}
                  {job.status === 'completed' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'पूर्ण ✓' : 'Done'}</span>
                    </span>
                  )}
                  {job.status === 'failed' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'त्रुटि' : 'Failed'}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar if active */}
              {job.status === 'active' && (
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-300"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              )}

              {/* Direct Action after completion */}
              {job.result_invoice_id && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-500">
                    {language === 'hi' ? 'खाता रिकॉर्ड आईडी:' : 'Record ID:'}{' '}
                    <code className="text-slate-800 font-mono">{job.result_invoice_id}</code>
                  </span>
                  <button
                    onClick={() => onOpenReview(job.result_invoice_id!)}
                    className="bg-slate-100 hover:bg-slate-200 text-emerald-800 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition border border-slate-200"
                  >
                    <span>{t.viewDetails}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
