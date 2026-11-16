import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loginWithSDU } from '../services/authService';
import Logo from './Logo';

export default function LoginPage({ onLogin }) {
  const { t, i18n } = useTranslation();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const currentLang = i18n.language || 'kk';

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!studentId.trim() || !password.trim()) {
      setErrorMsg(t('auth.error_required'));
      return;
    }

    if (!/^\d+$/.test(studentId.trim())) {
      setErrorMsg(t('auth.error_invalid_id'));
      return;
    }

    try {
      setIsLoading(true);
      const res = await loginWithSDU(studentId, password);
      if (res.success) {
        onLogin(res.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Қате орын алды');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoId) => {
    setStudentId(demoId);
    setPassword('password123');
    setIsLoading(true);
    try {
      const res = await loginWithSDU(demoId, 'password123');
      if (res.success) {
        onLogin(res.user);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-primary-container selection:text-on-primary">
      {/* Top Header */}
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b border-surface-container-high bg-surface-container-lowest/80 backdrop-blur-md sticky top-0 z-50">
        {/* Brand Logo */}
        <div className="flex items-center">
          <Logo size="lg" />
        </div>

        {/* Language switch */}
        <div className="flex items-center bg-surface-container-high p-1 rounded-full gap-1">
          <button
            onClick={() => toggleLanguage('kk')}
            className={`px-3 py-1 rounded-full font-label-sm text-xs font-bold transition-all ${
              currentLang === 'kk'
                ? 'bg-surface-container-lowest text-on-surface shadow-[0_2px_0_0_#dcdad2]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            🇰🇿 ҚАЗ
          </button>
          <button
            onClick={() => toggleLanguage('en')}
            className={`px-3 py-1 rounded-full font-label-sm text-xs font-bold transition-all ${
              currentLang === 'en'
                ? 'bg-surface-container-lowest text-on-surface shadow-[0_2px_0_0_#dcdad2]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            🇬🇧 ENG
          </button>
        </div>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Mascot & Lore */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            {/* Speech bubble */}
            <div className="relative bg-surface-container-lowest p-5 rounded-3xl shadow-[0_4px_0_0_#dcdad2] border border-surface-container mb-4 max-w-md">
              <p className="font-headline text-base text-on-surface leading-snug font-bold">
                {currentLang === 'kk'
                  ? '«Сәлем, болашақ Батыр! Қазақстан тарихын меңгеруге қош келдің!» 🐾'
                  : '"Welcome, future Batyr! Ready to explore Kazakhstan\'s rich history?" 🐾'}
              </p>
              <span className="font-body text-xs text-outline block mt-1">
                {currentLang === 'kk'
                  ? 'Өз ID-іңіз бен құпия сөзіңізбен жүйеге кіріңіз.'
                  : 'Enter your ID and password to log in.'}
              </span>
              <div className="hidden lg:block absolute -bottom-3 left-10 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-surface-container-lowest"></div>
            </div>

            {/* Mascot Image */}
            <div className="relative flex items-center justify-center my-2">
              <div className="absolute -inset-4 bg-secondary-fixed/40 rounded-full blur-2xl"></div>
              <img
                alt="Барыс Маскоты"
                className="relative w-44 h-44 sm:w-52 sm:h-52 object-contain filter drop-shadow-lg transition-transform hover:scale-105 duration-300"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRV2v68VtTYs3MdaTasAutUrXhUjI1XQ775hwq88ApP0tkKLncoF9ZjXQzC-qav-aF2eDXSDEYnAbim0TgJVJy1G-K1HGtwaPfq7WfRoC2zLtE6EDP6PJoD8YUPmKtFHO5QwMk3Hi1-Ogx5D7pxuWJXBbGy4gRgyFqoHz1q4LaT8pgiTuGXaM2f4du3urgozeMKxA7QuapUNKRfg3egzOAsYHPRuJmrDDS3HPuZlrF"
              />
            </div>

            {/* Quick Demo Access Box */}
            <div className="mt-4 p-3.5 rounded-2xl bg-secondary-fixed/30 border border-secondary-fixed flex flex-col gap-2 w-full max-w-md">
              <span className="font-headline text-[11px] text-on-secondary-fixed-variant uppercase font-extrabold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">flash_on</span>
                {t('auth.demo_title')}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('220107045')}
                  className="py-2 px-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-headline text-[11px] font-bold shadow-[0_2px_0_0_#dcdad2] hover:bg-surface-container active:translate-y-0.5 text-left truncate"
                >
                  {t('auth.demo_btn_1')}
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('240103012')}
                  className="py-2 px-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-headline text-[11px] font-bold shadow-[0_2px_0_0_#dcdad2] hover:bg-surface-container active:translate-y-0.5 text-left truncate"
                >
                  {t('auth.demo_btn_2')}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Login Form */}
          <div className="lg:col-span-7 w-full max-w-md mx-auto order-1 lg:order-2">
            <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-[0_6px_0_0_#dcdad2] border border-surface-container">
              
              {/* Form Title */}
              <div className="text-left mb-6">
                <h1 className="font-headline text-2xl font-extrabold text-on-surface">
                  {t('auth.title')}
                </h1>
                <p className="font-body text-on-surface-variant text-sm mt-1">
                  {t('auth.subtitle')}
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-2xl bg-error-container text-on-error-container text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                
                {/* Student ID */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-headline text-xs text-on-surface font-bold">
                    {t('auth.student_id_label')}
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-xl pointer-events-none">
                      badge
                    </span>
                    <input
                      type="text"
                      maxLength={12}
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder={t('auth.student_id_placeholder')}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:bg-surface-container-lowest text-on-surface font-body text-sm font-semibold outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-headline text-xs text-on-surface font-bold">
                      {t('auth.password_label')}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="font-headline text-xs text-primary hover:underline font-bold"
                    >
                      {t('auth.forgot_password')}
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-xl pointer-events-none">
                      lock
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('auth.password_placeholder')}
                      className="w-full pl-11 pr-11 py-3 rounded-2xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:bg-surface-container-lowest text-on-surface font-body text-sm outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-outline hover:text-on-surface focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-primary-container focus:ring-primary border-surface-container-highest cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="font-body text-xs text-on-surface-variant font-semibold cursor-pointer">
                    {t('auth.remember_me')}
                  </label>
                </div>

                {/* Main 3D Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 w-full py-3.5 px-6 rounded-2xl bg-primary-container text-on-primary font-headline text-base font-extrabold shadow-[0_5px_0_0_#46a302] hover:bg-[#4eb502] active:translate-y-1 active:shadow-[0_1px_0_0_#46a302] transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-wait uppercase tracking-wide"
                >
                  {isLoading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                      <span>{t('auth.authenticating')}</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl">login</span>
                      <span>{t('auth.login_btn')}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Security Note */}
              <div className="mt-5 pt-4 border-t border-surface-container-high text-center">
                <p className="font-body text-[11px] text-outline flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
                  <span>Қауіпсіз жүйемен қорғалған • Secure Authentication</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-3xl p-6 shadow-2xl border border-surface-container">
            <div className="flex items-center gap-2 text-primary mb-2">
              <span className="material-symbols-outlined text-2xl">help</span>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                {t('auth.forgot_password')}
              </h3>
            </div>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              {t('auth.forgot_help')}
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-headline text-sm font-bold shadow-[0_2px_0_0_#dcdad2]"
            >
              Түсінікті / Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-outline border-t border-surface-container-high bg-surface-container-lowest/50">
        <p>{t('auth.footer')}</p>
      </footer>
    </div>
  );
}
