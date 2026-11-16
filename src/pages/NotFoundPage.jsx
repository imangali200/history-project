import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'kk';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 rounded-3xl bg-secondary-fixed/40 flex items-center justify-center text-secondary text-5xl mb-4 shadow-sm">
        <span className="material-symbols-outlined text-5xl">explore_off</span>
      </div>
      <h1 className="font-headline text-3xl sm:text-4xl font-black text-on-surface">
        404 • {lang === 'en' ? 'Page Not Found' : 'Бұл бет табылмады'}
      </h1>
      <p className="font-body text-sm text-on-surface-variant max-w-md mt-2">
        {lang === 'en'
          ? 'The historical path you are looking for has vanished in the steppe sands. Return to your expedition dashboard.'
          : 'Сіз іздеген тарихи жол дала құмына сіңіп кеткендей. Басты экспедиция картасына оралыңыз.'}
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-6 px-8 py-3 rounded-2xl bg-primary-container text-white font-headline text-sm font-black shadow-[0_4px_0_0_#1e5000] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-lg">home</span>
        <span>{lang === 'en' ? 'Back to Dashboard' : 'Басты бетке оралу'}</span>
      </button>
    </div>
  );
}
