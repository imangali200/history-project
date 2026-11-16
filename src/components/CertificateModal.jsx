import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function CertificateModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'kk';
  const certRef = useRef(null);

  if (!isOpen || !user) return null;

  const today = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'kk-KZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-surface-container-lowest w-full max-w-3xl rounded-3xl shadow-2xl border border-surface-container overflow-hidden flex flex-col relative max-h-[95vh]">
        {/* Top Actions */}
        <div className="p-4 px-6 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-2xl">workspace_premium</span>
            <span className="font-headline text-sm font-black text-on-surface">
              {lang === 'en' ? 'Official Course Certificate' : 'Ресми СДУ Сертификаты'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-primary-container text-white font-headline text-xs font-black shadow-[0_2px_0_0_#1e5000] flex items-center gap-1.5 cursor-pointer hover:brightness-105"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>{lang === 'en' ? 'Print / PDF' : 'Басып шығару'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Certificate Canvas Area */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-amber-50/40">
          <div
            ref={certRef}
            className="relative bg-white border-8 border-double border-[#755b00]/40 rounded-2xl p-6 sm:p-10 text-center shadow-lg overflow-hidden"
          >
            {/* Watermark Kazakh Ornament */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-[320px] text-secondary">verified</span>
            </div>

            {/* University Header */}
            <div className="flex flex-col items-center">
              <div className="mb-2">
                <Logo size="lg" showText={false} />
              </div>
              <span className="font-label-sm text-[11px] font-black uppercase tracking-widest text-[#755b00]">
                СҮЛЕЙМЕН ДЕМИРЕЛ УНИВЕРСИТЕТІ • SULEYMAN DEMIREL UNIVERSITY
              </span>
              <span className="font-body-sm text-xs text-outline">
                Қазақстан тарихы және қоғамдық ғылымдар кафедрасы
              </span>
            </div>

            {/* Title */}
            <div className="my-6">
              <h1 className="font-headline text-3xl sm:text-4xl font-extrabold uppercase tracking-wider text-primary">
                СЕРТИФИКАТ
              </h1>
              <p className="font-body text-xs text-on-surface-variant uppercase tracking-widest mt-1">
                CERTIFICATE OF HISTORICAL EXCELLENCE
              </p>
            </div>

            {/* Recipient */}
            <div className="my-4">
              <p className="font-body text-xs text-outline">Бұл сертификат марапатталады:</p>
              <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface mt-1 border-b-2 border-primary/30 inline-block px-8 pb-1">
                {lang === 'en' && user.nameEn ? user.nameEn : (user.name || user.fullName || 'Студент')}
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant mt-2 font-bold">
                Студенттік ID: {user.studentId || '220107045'} • {user.faculty || 'Инженерия және Жаратылыстану факультеті'}
              </p>
            </div>

            {/* Achievement text */}
            <p className="font-body text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto my-4 leading-relaxed">
              Қазақстан тарихы курсының <strong>«Ежелгі Қазақстан: Тас дәуірі және Сақтар өркениеті»</strong> бөлімінің барлық видеодәрістері мен интерактивті сынақтарын <strong>100% үздік нәтижемен</strong> аяқтағанын растайды.
            </p>

            {/* Signatures & QR stamp */}
            <div className="mt-8 pt-6 border-t border-surface-container flex items-center justify-between text-left text-xs">
              <div>
                <div className="font-headline font-black text-on-surface">SDU Тарих кафедрасы</div>
                <div className="font-body text-[11px] text-outline">Курс жетекшісі</div>
                <div className="font-body text-[10px] text-outline mt-1">{today}</div>
              </div>

              {/* Gold Medal Badge */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#fec700] to-secondary-container flex items-center justify-center text-on-secondary-container shadow-md border-2 border-white">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>

              <div className="text-right">
                <div className="font-headline font-black text-primary">SDU-HIST-CERT-2026</div>
                <div className="font-body text-[11px] text-outline">Тіркеу нөмірі: #KZ-8842</div>
                <div className="font-label-sm text-[10px] text-secondary font-extrabold mt-1">Тексерілген ✓</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
