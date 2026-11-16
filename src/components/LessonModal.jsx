import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { getLessonById, submitLessonResult } from '../services/lessonService';
import sounds from '../utils/audio';
import { useAuth } from '../context/AuthContext';

export default function LessonModal({
  isOpen,
  lessonId = 'stone-age-1',
  onClose,
  onCompleteLesson,
  userHearts = 5
}) {
  const { i18n } = useTranslation();
  const { askAITutor, completeLesson } = useAuth();
  const lang = i18n.language === 'en' ? 'en' : 'kk';

  // Lesson data fetched from decoupled service/JSON
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Flow State: 'video' (1. Дәріс) | 'vocabulary' (2. Сөздік) | 'question' (3. Тест) | 'celebration' (4. Жеңіс)
  const [phase, setPhase] = useState('video');
  const [questionIdx, setQuestionIdx] = useState(0);

  // Smart Video Player state (auto-detect YouTube / HTML5)
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState('0:00');
  const [activeVideoTab, setActiveVideoTab] = useState('notes'); // 'notes' | 'chapters'

  // Question interaction state
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [selectedVocabCard, setSelectedVocabCard] = useState(null);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Match Pairs Question State
  const [selectedLeftPair, setSelectedLeftPair] = useState(null);
  const [matchedPairIds, setMatchedPairIds] = useState([]);
  const [wrongMatchIds, setWrongMatchIds] = useState([]);
  const [shuffledLeft, setShuffledLeft] = useState([]);
  const [shuffledRight, setShuffledRight] = useState([]);

  // Hearts & Game Over state
  const [hearts, setHearts] = useState(userHearts);
  const [showHeartMinus, setShowHeartMinus] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Performance stats
  const [correctCount, setCorrectCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Load lesson from service
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);

    getLessonById(lessonId)
      .then((data) => {
        if (!isMounted) return;
        setLesson(data);
        setTotalQuestions(data.questions?.length || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load lesson:', err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, lessonId]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setPhase('video');
      setQuestionIdx(0);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setIsCurrentCorrect(null);
      setShowHint(false);
      setHearts(userHearts);
      setCorrectCount(0);
      setElapsedSeconds(0);
      setIsPlaying(false);
      setVideoProgress(0);
      setIsGameOver(false);
      setMatchedPairIds([]);
      setSelectedLeftPair(null);
    }
  }, [isOpen, userHearts]);

  // Timer while in question phase
  useEffect(() => {
    let interval = null;
    if (phase === 'question' && !isGameOver) {
      if (!startTime) setStartTime(Date.now());
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase, startTime, isGameOver]);

  // Shuffle match pairs whenever current question changes to match_pairs
  useEffect(() => {
    if (lesson?.questions?.[questionIdx]?.type === 'match_pairs') {
      const q = lesson.questions[questionIdx];
      const leftItems = (q.pairs || []).map((p) => ({ id: p.id, text: p.leftObj || p.left }));
      const rightItems = (q.pairs || []).map((p) => ({ id: p.id, text: p.right }));

      setShuffledLeft([...leftItems].sort(() => Math.random() - 0.5));
      setShuffledRight([...rightItems].sort(() => Math.random() - 0.5));
      setMatchedPairIds([]);
      setSelectedLeftPair(null);
      setWrongMatchIds([]);
    }
  }, [lesson, questionIdx]);

  // Video event handlers
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setVideoProgress((current / duration) * 100);

    const m = Math.floor(current / 60);
    const s = Math.floor(current % 60);
    setVideoCurrentTime(`${m}:${s < 10 ? '0' : ''}${s}`);
  };

  const handleVideoSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const duration = videoRef.current.duration || 225;
    videoRef.current.currentTime = pos * duration;
  };

  const handleJumpToChapter = (timeString) => {
    if (!videoRef.current) return;
    const parts = timeString.split(':').map(Number);
    const totalSec = (parts[0] || 0) * 60 + (parts[1] || 0);
    videoRef.current.currentTime = totalSec;
    if (!isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!isOpen) return null;

  if (loading || !lesson) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-label-lg text-on-surface">
            {lang === 'en' ? 'Loading lesson materials...' : 'Сабақ материалдары жүктелуде...'}
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = lesson.questions?.[questionIdx];

  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Progress percentage across 4 phases
  let progressPercent = 10;
  if (phase === 'video') progressPercent = 15;
  else if (phase === 'vocabulary') progressPercent = 30;
  else if (phase === 'question') progressPercent = 35 + (questionIdx / (totalQuestions || 1)) * 55;
  else if (phase === 'celebration') progressPercent = 100;

  const handleToggleLang = (newLang) => {
    i18n.changeLanguage(newLang);
  };

  const handleStartQuiz = () => {
    if (videoRef.current) videoRef.current.pause();
    setIsPlaying(false);
    setPhase('question');
    setQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setIsCurrentCorrect(null);
    setShowHint(false);
    setStartTime(Date.now());
  };

  const handleDeductHeart = () => {
    sounds.playError();
    setShowHeartMinus(true);
    setTimeout(() => setShowHeartMinus(false), 1400);

    setHearts((h) => {
      const nextHearts = h - 1;
      if (nextHearts <= 0) {
        setIsGameOver(true);
        return 0;
      }
      return nextHearts;
    });
  };

  // Multiple choice selection
  const handleSelectOption = (idx) => {
    if (isAnswerChecked) return;
    setSelectedOption(idx);
  };

  // Check answer for standard questions
  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswerChecked) return;

    const chosen = currentQuestion.options[selectedOption];
    const isCorrect = !!chosen.isCorrect;

    setIsAnswerChecked(true);
    setIsCurrentCorrect(isCorrect);

    if (isCorrect) {
      sounds.playCorrect();
      setCorrectCount((prev) => prev + 1);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.75 }
      });
    } else {
      handleDeductHeart();
    }
  };

  // Match Pairs interaction logic (Duolingo tile matching)
  const handleSelectLeftTile = (id) => {
    if (matchedPairIds.includes(id) || isAnswerChecked) return;
    setSelectedLeftPair(id);
    setWrongMatchIds([]);
  };

  const handleSelectRightTile = (rightId) => {
    if (!selectedLeftPair || matchedPairIds.includes(rightId) || isAnswerChecked) return;

    if (selectedLeftPair === rightId) {
      // Correct Match!
      sounds.playTileMatch();
      const updated = [...matchedPairIds, rightId];
      setMatchedPairIds(updated);
      setSelectedLeftPair(null);
      setWrongMatchIds([]);

      // Check if all pairs matched
      const totalPairs = currentQuestion.pairs?.length || 4;
      if (updated.length >= totalPairs) {
        setIsAnswerChecked(true);
        setIsCurrentCorrect(true);
        setCorrectCount((prev) => prev + 1);
        sounds.playCorrect();
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 }
        });
      }
    } else {
      // Mismatched
      setWrongMatchIds([selectedLeftPair, rightId]);
      handleDeductHeart();
      setTimeout(() => {
        setSelectedLeftPair(null);
        setWrongMatchIds([]);
      }, 700);
    }
  };

  // Next Question
  const handleNextStep = () => {
    if (questionIdx + 1 < totalQuestions) {
      setQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setIsCurrentCorrect(null);
      setShowHint(false);
    } else {
      setPhase('celebration');
      sounds.playFanfare();

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 350);

      const accuracyRate = Math.round((correctCount / (totalQuestions || 1)) * 100);
      submitLessonResult(lesson.id, {
        xpEarned: lesson.baseXp + lesson.bonusXp,
        accuracy: accuracyRate,
        timeSpentSeconds: elapsedSeconds,
        heartsRemaining: hearts
      });
    }
  };

  const handleFinishAndReturn = () => {
    const totalXp = lesson.baseXp + lesson.bonusXp;
    completeLesson(lesson.id, totalXp);
    onCompleteLesson(totalXp);
    onClose();
  };

  const handleRestartLesson = () => {
    setPhase('video');
    setQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setIsCurrentCorrect(null);
    setShowHint(false);
    setCorrectCount(0);
    setElapsedSeconds(0);
    setStartTime(null);
    setHearts(5);
    setIsGameOver(false);
  };

  const handleRefillAndContinue = () => {
    setHearts(5);
    setIsGameOver(false);
  };

  const handleSpeakText = (text) => {
    sounds.speak(text, lang === 'en' ? 'en-US' : 'kk-KZ');
  };

  const handleAskAIAboutMistake = () => {
    const qText = currentQuestion.question?.[lang] || '';
    const explanation = currentQuestion.explanation?.[lang] || '';
    const prompt = `Сәлем, AI Тарихшы! Мына сабақ сұрағы бойынша түсіндіріп берші: «${qText}». Неге бұл жердегі дұрыс жауап: «${explanation}» болады?`;
    askAITutor(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface font-body-md text-on-surface overflow-y-auto selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* 3D Top Header */}
      <header className="sticky top-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-b border-surface-container shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <div className="h-18 max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">
          <button
            onClick={onClose}
            aria-label="Close lesson"
            className="w-10 h-10 rounded-xl bg-surface-container-lowest text-on-surface-variant flex items-center justify-center transition-all hover:bg-surface-container-high hover:text-on-surface active:translate-y-0.5 shadow-[0_3px_0_0_#dcdad2] active:shadow-none cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>

          {/* Progress Bar + Phase Tabs Indicator */}
          <div className="flex-1 max-w-[500px] flex flex-col gap-1 px-1">
            <div className="flex items-center justify-between text-[11px] font-headline font-bold text-outline">
              <span className={phase === 'video' ? 'text-primary font-black' : ''}>
                1. 🎥 {lang === 'en' ? 'Video' : 'Видео'}
              </span>
              <span className={phase === 'vocabulary' ? 'text-primary font-black' : ''}>
                2. 📖 {lang === 'en' ? 'Vocab' : 'Сөздік'}
              </span>
              <span className={phase === 'question' ? 'text-primary font-black' : ''}>
                3. ✍️ {lang === 'en' ? 'Quiz' : 'Тест'}
              </span>
              <span className={phase === 'celebration' ? 'text-secondary font-black' : ''}>
                4. 🏆 {lang === 'en' ? 'Result' : 'Нәтиже'}
              </span>
            </div>

            <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden p-0.5 relative shadow-inner">
              <div
                className="h-full bg-primary-container rounded-full relative transition-all duration-500 ease-out shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute top-0.5 inset-x-1.5 h-1 bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Hearts Pill + Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-[0_2px_0_0_#dcdad2]">
              <span className="material-symbols-outlined text-error text-[18px] sm:text-[20px] select-none fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
              <span className="font-label-md text-xs sm:text-sm text-on-surface font-black">
                {hearts}
              </span>

              {showHeartMinus && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-error text-white font-label-sm text-xs font-black shadow-lg animate-bounce">
                  <span className="material-symbols-outlined text-xs">heart_broken</span>
                  <span>-1</span>
                </div>
              )}
            </div>

            <div className="flex items-center rounded-full bg-surface-container p-1 text-on-surface-variant">
              <button
                onClick={() => handleToggleLang('kk')}
                className={`px-2 py-0.5 rounded-full font-label-sm text-xs font-extrabold transition-all cursor-pointer ${
                  lang === 'kk'
                    ? 'bg-surface-container-lowest text-on-surface shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                KZ
              </button>
              <button
                onClick={() => handleToggleLang('en')}
                className={`px-2 py-0.5 rounded-full font-label-sm text-xs font-extrabold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-surface-container-lowest text-on-surface shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Stage */}
      <main className="w-full flex-1 flex flex-col items-center justify-between pt-4 pb-28">
        
        {/* ========================================================================= */}
        {/* PHASE 1: SMART VIDEO LESSON PLAYER (YouTube & MP4 / Chapters / Notes)      */}
        {/* ========================================================================= */}
        {phase === 'video' && lesson.videoLesson && (
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex-1 flex flex-col gap-6 py-2 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/15 text-primary font-label-sm text-xs font-black uppercase mb-1">
                  <span className="material-symbols-outlined text-sm">smart_display</span>
                  <span>{lesson.badge?.[lang] || '1-БӨЛІМ • ВИДЕО ДӘРІС'}</span>
                </div>
                <h1 className="font-headline-lg text-xl sm:text-2xl md:text-3xl text-on-surface font-black">
                  {lesson.videoLesson.title?.[lang]}
                </h1>
                <p className="font-body-sm text-xs sm:text-sm text-outline mt-0.5">
                  {lesson.videoLesson.instructor} • ⏱ {lesson.videoLesson.duration}
                </p>
              </div>

              {/* Skip to Vocab button */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  onClick={() => setPhase('vocabulary')}
                  className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface shadow-[0_2px_0_0_#dcdad2] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">dictionary</span>
                  <span>{lang === 'en' ? 'Vocab' : 'Сөздік'}</span>
                </button>
              </div>
            </div>

            {/* Smart Video Player Screen — auto-detects YouTube vs MP4 */}
            <div className="relative w-full rounded-3xl overflow-hidden bg-black shadow-[0_6px_0_0_#dcdad2] border border-surface-container group">
              {(() => {
                // Auto-detect: check if the primary videoUrl is a YouTube link
                const rawUrl = lesson.videoLesson.videoUrl || '';
                const embedUrl = lesson.videoLesson.embedYoutube || '';
                const isYouTube = /youtube\.com|youtu\.be/i.test(rawUrl) || !!embedUrl;

                // Determine the iframe src for YouTube (autoplay=0: does not auto-start on modal open)
                const youtubeEmbedSrc = embedUrl
                  ? `${embedUrl}?autoplay=0&rel=0`
                  : rawUrl.includes('youtu.be')
                    ? `https://www.youtube.com/embed/${rawUrl.split('/').pop().split('?')[0]}?autoplay=0&rel=0`
                    : rawUrl.includes('youtube.com/watch')
                      ? `https://www.youtube.com/embed/${new URLSearchParams(rawUrl.split('?')[1]).get('v')}?autoplay=0&rel=0`
                      : `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0`;

                if (isYouTube) {
                  return (
                    <div className="w-full h-64 sm:h-96 md:h-[420px] bg-black">
                      <iframe
                        src={youtubeEmbedSrc}
                        title="Historical Video Lesson"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  );
                }

                // HTML5 interactive player for MP4 / direct video files
                return (
                  <div className="relative">
                  <video
                    ref={videoRef}
                    src={rawUrl}
                    poster={lesson.videoLesson.poster}
                    onTimeUpdate={handleTimeUpdate}
                    muted={isMuted}
                    playsInline
                    className="w-full h-64 sm:h-96 md:h-[420px] object-cover cursor-pointer"
                    onClick={handlePlayPause}
                  />

                  {!isPlaying && (
                    <div
                      onClick={handlePlayPause}
                      className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center cursor-pointer transition-all hover:bg-black/30"
                    >
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-primary-container text-white flex items-center justify-center shadow-[0_6px_0_0_#1e5000] hover:scale-105 active:scale-95 transition-all">
                        <span className="material-symbols-outlined text-4xl sm:text-5xl ml-1">play_arrow</span>
                      </div>
                    </div>
                  )}

                  {/* Video Controls Bar */}
                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2">
                    <div
                      onClick={handleVideoSeek}
                      className="w-full h-2 bg-white/30 rounded-full cursor-pointer relative hover:h-2.5 transition-all"
                    >
                      <div
                        className="h-full bg-primary-container rounded-full relative"
                        style={{ width: `${videoProgress}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-white text-xs font-bold">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handlePlayPause}
                          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xl">
                            {isPlaying ? 'pause' : 'play_arrow'}
                          </span>
                        </button>

                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-lg">
                            {isMuted ? 'volume_off' : 'volume_up'}
                          </span>
                        </button>

                        <span>{videoCurrentTime} / {lesson.videoLesson.duration}</span>
                      </div>

                      <span className="hidden sm:inline px-2 py-0.5 rounded bg-white/20 text-[10px] uppercase">
                        HD • SDU HIST-101
                      </span>
                    </div>
                  </div>
                </div>
                );
              })()}
            </div>

            {/* Lecture Notes & Video Chapters (Clean full-width layout without side coach box) */}
            <div className="w-full flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-surface-container pb-2">
                <button
                  onClick={() => setActiveVideoTab('notes')}
                  className={`px-4 py-1.5 rounded-full font-headline text-xs font-extrabold transition-all cursor-pointer ${
                    activeVideoTab === 'notes'
                      ? 'bg-primary-container text-white shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  📝 {lang === 'en' ? 'Lecture Key Points' : 'Сабақ тезистері (Конспект)'}
                </button>
                <button
                  onClick={() => setActiveVideoTab('chapters')}
                  className={`px-4 py-1.5 rounded-full font-headline text-xs font-extrabold transition-all cursor-pointer ${
                    activeVideoTab === 'chapters'
                      ? 'bg-primary-container text-white shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  ⏱ {lang === 'en' ? 'Video Chapters' : 'Видео бөлімдері'}
                </button>
              </div>

              {activeVideoTab === 'notes' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lesson.videoLesson.keyTakeaways?.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-[0_3px_0_0_#dcdad2] flex items-start gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary-container/15 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-xl">{note.icon || 'star'}</span>
                      </div>
                      <div>
                        <h3 className="font-headline text-sm font-extrabold text-on-surface">
                          {note.title?.[lang]}
                        </h3>
                        <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                          {note.text?.[lang]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeVideoTab === 'chapters' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {lesson.videoLesson.chapters?.map((ch, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleJumpToChapter(ch.time)}
                      className="p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low border border-surface-container shadow-[0_2px_0_0_#dcdad2] flex items-center justify-between gap-3 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-xl bg-surface-container text-xs font-headline font-black text-secondary">
                          {ch.time}
                        </span>
                        <div>
                          <div className="font-headline text-xs font-black text-on-surface">
                            {ch.title?.[lang]}
                          </div>
                          <div className="font-body-sm text-[11px] text-outline">
                            {ch.desc?.[lang]}
                          </div>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-base text-primary">play_circle</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PHASE 2: VOCABULARY PREVIEW CARDS                                         */}
        {/* ========================================================================= */}
        {phase === 'vocabulary' && (
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex-1 flex flex-col gap-6 py-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/15 text-primary font-label-sm text-xs font-black uppercase mb-1">
                  <span>2-КЕЗЕҢ • СӨЗДІК КАРТОЧКАЛАРЫ</span>
                </div>
                <h1 className="font-headline text-2xl font-black text-on-surface">
                  {lang === 'en' ? 'Vocabulary Preview' : 'Сабақтағы Негізгі Ұғымдар'}
                </h1>
                <p className="font-body-sm text-xs text-outline">
                  {lang === 'en' ? 'Tap each card to pronounce and inspect meaning' : 'Әр карточканы басып, дауысын тыңдап, мағынасын оқып ал'}
                </p>
              </div>

              <button
                onClick={() => setPhase('video')}
                className="px-3 py-1.5 rounded-xl bg-surface-container text-xs font-bold text-on-surface hover:bg-surface-container-high transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">smart_display</span>
                <span>{lang === 'en' ? 'Back to Video' : 'Видеоға қайту'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lesson.vocabulary?.map((vocab, vIdx) => {
                const isSelected = selectedVocabCard === vocab.id;
                const termText = vocab.term?.[lang] || vocab.term?.kk || '';
                const defText = vocab.definition?.[lang] || vocab.definition?.kk || '';
                const fullVocabText = `${termText}. ${defText}`;

                return (
                  <div
                    key={vocab.id || vIdx}
                    onClick={() => {
                      setSelectedVocabCard(vocab.id);
                      handleSpeakText(fullVocabText);
                    }}
                    className={`group relative rounded-2xl bg-surface-container-lowest p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 shadow-[0_4px_0_0_#2b6c00] translate-y-[-2px]'
                        : 'border-surface-container hover:border-outline-variant shadow-[0_4px_0_0_#dcdad2] hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="w-full h-32 rounded-xl overflow-hidden bg-surface-container relative">
                        <img
                          src={vocab.image}
                          alt={vocab.term?.[lang]}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-inverse-surface/70 backdrop-blur-sm text-inverse-on-surface font-label-sm text-[10px] font-bold">
                          {vocab.tag?.[lang]}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-[11px] text-tertiary font-bold">
                            {vocab.partOfSpeech?.[lang]} • {vocab.pronunciation}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeakText(fullVocabText);
                            }}
                            className="w-7 h-7 rounded-full bg-surface-container text-tertiary hover:bg-tertiary hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">volume_up</span>
                          </button>
                        </div>
                        <h3 className="font-headline-md text-base text-on-surface font-extrabold mt-0.5">
                          {vocab.term?.[lang]}{' '}
                          <span className="text-on-surface-variant font-normal text-xs">
                            ({vocab.term?.[lang === 'kk' ? 'en' : 'kk']})
                          </span>
                        </h3>
                        <p className="font-body-sm text-xs text-on-surface-variant mt-1 line-clamp-2">
                          {vocab.definition?.[lang]}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-surface-container flex items-center gap-1.5 text-outline text-[11px]">
                      <span className="material-symbols-outlined text-xs text-secondary">info</span>
                      <span className="truncate">{vocab.context?.[lang]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PHASE 3: INTERACTIVE QUIZ QUESTIONS (Multiple Choice, Match Pairs, Artifact) */}
        {/* ========================================================================= */}
        {phase === 'question' && currentQuestion && (
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex-1 flex flex-col justify-between py-2 animate-fadeIn">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed shadow-sm">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  history_edu
                </span>
                <span className="font-label-sm text-xs font-black uppercase tracking-wider">
                  {currentQuestion.badge?.[lang] || `СҰРАҚ ${questionIdx + 1}/${totalQuestions}`}
                </span>
              </div>

              <h1 className="font-headline-lg text-xl sm:text-2xl md:text-3xl text-on-surface font-extrabold max-w-2xl px-2">
                {currentQuestion.question?.[lang]}
              </h1>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-xl">
                {currentQuestion.question?.[lang === 'kk' ? 'en' : 'kk']}
              </p>

              {/* Hint & Audio buttons */}
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high text-xs font-bold transition-all shadow-[0_2px_0_0_#dcdad2] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm text-secondary">lightbulb</span>
                  <span>{lang === 'en' ? 'Hint' : 'Көмек'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSpeakText(currentQuestion.question?.[lang])}
                  className="w-7 h-7 rounded-full bg-surface-container text-tertiary hover:bg-tertiary-fixed flex items-center justify-center transition-all shadow-[0_2px_0_0_#dcdad2] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">volume_up</span>
                </button>
              </div>

              {showHint && (
                <div className="mt-2 p-3 bg-secondary-container/20 border border-secondary/30 rounded-2xl text-xs text-on-secondary-container max-w-lg flex items-center gap-2 shadow-sm animate-fadeIn">
                  <span className="material-symbols-outlined text-secondary text-base">psychology</span>
                  <span>{currentQuestion.hint?.[lang]}</span>
                </div>
              )}
            </div>

            {/* VARIANT 1: MATCH PAIRS QUESTION (Duolingo tile matching mechanic) */}
            {currentQuestion.type === 'match_pairs' && (
              <div className="w-full my-4 max-w-3xl mx-auto">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {/* Left Column (Historical Sites / Concepts) */}
                  <div className="flex flex-col gap-3">
                    <span className="font-label-sm text-xs text-outline font-black uppercase text-center">
                      {lang === 'en' ? 'Historical Sites' : 'Тарихи орындар'}
                    </span>
                    {shuffledLeft.map((item) => {
                      const isMatched = matchedPairIds.includes(item.id);
                      const isSelected = selectedLeftPair === item.id;
                      const isWrong = wrongMatchIds.includes(item.id);

                      let style = 'bg-surface-container-lowest border-surface-container shadow-[0_4px_0_0_#dcdad2] hover:-translate-y-0.5 cursor-pointer';
                      if (isMatched) {
                        style = 'bg-primary-container/20 border-primary-container text-primary font-bold opacity-60 pointer-events-none shadow-none';
                      } else if (isWrong) {
                        style = 'bg-error-container/40 border-error text-error animate-shake shadow-none';
                      } else if (isSelected) {
                        style = 'bg-tertiary-fixed/30 border-tertiary ring-2 ring-tertiary shadow-[0_4px_0_0_#4abdff] translate-y-[-2px]';
                      }

                      return (
                        <div
                          key={`left-${item.id}`}
                          onClick={() => handleSelectLeftTile(item.id)}
                          className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between font-headline text-sm font-extrabold ${style}`}
                        >
                          <span>{typeof item.text === 'object' ? item.text[lang] : item.text}</span>
                          {isMatched && <span className="material-symbols-outlined text-primary text-base">check</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column (Hallmark discoveries) */}
                  <div className="flex flex-col gap-3">
                    <span className="font-label-sm text-xs text-outline font-black uppercase text-center">
                      {lang === 'en' ? 'Archaeological Milestones' : 'Табылған жәдігерлер'}
                    </span>
                    {shuffledRight.map((item) => {
                      const isMatched = matchedPairIds.includes(item.id);
                      const isWrong = wrongMatchIds.includes(item.id);

                      let style = 'bg-surface-container-lowest border-surface-container shadow-[0_4px_0_0_#dcdad2] hover:-translate-y-0.5 cursor-pointer';
                      if (isMatched) {
                        style = 'bg-primary-container/20 border-primary-container text-primary font-bold opacity-60 pointer-events-none shadow-none';
                      } else if (isWrong) {
                        style = 'bg-error-container/40 border-error text-error animate-shake shadow-none';
                      }

                      return (
                        <div
                          key={`right-${item.id}`}
                          onClick={() => handleSelectRightTile(item.id)}
                          className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between font-headline text-sm font-extrabold ${style}`}
                        >
                          <span>{typeof item.text === 'object' ? item.text[lang] : item.text}</span>
                          {isMatched && <span className="material-symbols-outlined text-primary text-base">check</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* VARIANT 2: STANDARD MULTIPLE CHOICE */}
            {currentQuestion.type !== 'artifact' && currentQuestion.type !== 'match_pairs' && (
              <div className="w-full flex flex-col items-center gap-6 my-4">
                {currentQuestion.image && (
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-surface-container-low p-2 shadow-[0_4px_0_0_#dcdad2] border border-surface-container flex items-center justify-center overflow-hidden">
                    <img
                      src={currentQuestion.image}
                      alt="Question context"
                      className="w-full h-full object-contain rounded-xl drop-shadow"
                    />
                  </div>
                )}

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-3xl">
                  {currentQuestion.options?.map((opt, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    let cardStyle = 'bg-surface-container-lowest border-surface-container shadow-[0_4px_0_0_#dcdad2] hover:-translate-y-0.5 hover:bg-surface-container-low';

                    if (isSelected && !isAnswerChecked) {
                      cardStyle = 'bg-tertiary-fixed/20 border-tertiary ring-2 ring-tertiary/20 shadow-[0_4px_0_0_#4abdff] translate-y-[-2px]';
                    } else if (isAnswerChecked) {
                      if (opt.isCorrect) {
                        cardStyle = 'bg-primary-container/15 border-primary ring-2 ring-primary/30 shadow-[0_4px_0_0_#2b6c00] translate-y-[-2px]';
                      } else if (isSelected && !opt.isCorrect) {
                        cardStyle = 'bg-error-container/25 border-error ring-2 ring-error/30 shadow-[0_4px_0_0_#ba1a1a] translate-y-[-2px]';
                      } else {
                        cardStyle = 'bg-surface-container-lowest opacity-60 border-surface-container';
                      }
                    }

                    return (
                      <div
                        key={opt.id || optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`cursor-pointer rounded-2xl p-4 flex items-center justify-between gap-3 border transition-all duration-200 select-none ${cardStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-label-md text-xs font-black shadow-sm shrink-0 transition-colors ${
                              isSelected ? 'bg-primary text-white' : 'bg-surface-container-highest text-on-surface-variant'
                            }`}
                          >
                            {opt.letter || String.fromCharCode(65 + optIdx)}
                          </span>

                          <div className="flex flex-col">
                            <span className="font-headline-md text-sm sm:text-base text-on-surface font-extrabold leading-tight">
                              {opt.text?.[lang]}
                            </span>
                            <span className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                              {opt.subtext?.[lang]}
                            </span>
                          </div>
                        </div>

                        {isAnswerChecked && opt.isCorrect && (
                          <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm shrink-0">
                            <span className="material-symbols-outlined text-sm font-black">check</span>
                          </div>
                        )}
                        {isAnswerChecked && isSelected && !opt.isCorrect && (
                          <div className="w-7 h-7 rounded-full bg-error text-white flex items-center justify-center shadow-sm shrink-0">
                            <span className="material-symbols-outlined text-sm font-black">close</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VARIANT 3: MUSEUM ARTIFACT RECOGNITION BENTO */}
            {currentQuestion.type === 'artifact' && (
              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch my-3">
                <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-surface-container-low p-4 shadow-[0_4px_0_0_#dcdad2] border border-surface-container relative overflow-hidden">
                  <div className="flex items-center justify-between z-10 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-[11px] font-bold">
                      <span className="material-symbols-outlined text-xs text-primary">verified</span>
                      ЭКСПОНАТ #{currentQuestion.specimenId || 'KZ-784'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeakText(currentQuestion.question?.[lang])}
                      className="w-8 h-8 rounded-full bg-surface-container-lowest text-tertiary flex items-center justify-center shadow-[0_2px_0_0_#dcdad2] hover:bg-tertiary-fixed transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">volume_up</span>
                    </button>
                  </div>

                  <div className="relative my-2 flex flex-col items-center justify-center">
                    <div className="w-full h-52 sm:h-56 rounded-xl overflow-hidden shadow-sm relative group bg-surface-container">
                      <img
                        src={currentQuestion.image}
                        alt="Artifact specimen"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => setIsZoomModalOpen(true)}
                        className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-inverse-surface/80 text-inverse-on-surface backdrop-blur-sm font-label-sm text-xs flex items-center gap-1 shadow-sm hover:bg-black cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">zoom_in</span>
                        <span>{lang === 'en' ? '3D Look' : 'Үлкейту'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl bg-surface-container p-2.5 flex items-center gap-2.5 z-10 mt-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-lowest text-secondary flex items-center justify-center shadow-[0_2px_0_0_#dcdad2] shrink-0">
                      <span className="material-symbols-outlined text-lg">location_on</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-label-md text-xs text-on-surface font-extrabold truncate">
                        {currentQuestion.location?.[lang]}
                      </p>
                      <p className="font-body-sm text-[11px] text-on-surface-variant truncate">
                        {currentQuestion.location?.[lang === 'kk' ? 'en' : 'kk']}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col justify-between gap-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
                    {currentQuestion.options?.map((opt, optIdx) => {
                      const isSelected = selectedOption === optIdx;
                      let cardStyle = 'bg-surface-container-lowest border-surface-container shadow-[0_4px_0_0_#dcdad2] hover:bg-surface-container-low hover:-translate-y-0.5';

                      if (isSelected && !isAnswerChecked) {
                        cardStyle = 'bg-gradient-to-b from-tertiary-fixed/30 to-surface-container-lowest border-tertiary shadow-[0_4px_0_0_#4abdff] translate-y-[-2px]';
                      } else if (isAnswerChecked) {
                        if (opt.isCorrect) {
                          cardStyle = 'bg-gradient-to-b from-primary-fixed/30 to-surface-container-lowest border-primary shadow-[0_4px_0_0_#2b6c00] translate-y-[-2px]';
                        } else if (isSelected && !opt.isCorrect) {
                          cardStyle = 'bg-error-container/20 border-error shadow-[0_4px_0_0_#ba1a1a] translate-y-[-2px]';
                        } else {
                          cardStyle = 'bg-surface-container-lowest opacity-60 border-surface-container';
                        }
                      }

                      return (
                        <div
                          key={opt.id || optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`cursor-pointer rounded-xl p-3.5 flex flex-col justify-between border transition-all duration-200 ${cardStyle}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-label-md text-xs font-black shrink-0 ${
                                isSelected ? 'bg-tertiary text-white' : 'bg-surface-container-highest text-on-surface-variant'
                              }`}
                            >
                              {opt.letter || String.fromCharCode(65 + optIdx)}
                            </span>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-tertiary text-white flex items-center justify-center shadow-inner">
                                <span className="material-symbols-outlined text-xs">check</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-2">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[10px] uppercase tracking-wide mb-1">
                              {opt.subtext?.[lang]}
                            </span>
                            <h2 className="font-headline-md text-sm text-on-surface font-black">
                              {opt.text?.[lang]}
                            </h2>
                            <p className="font-body-sm text-[11px] text-on-surface-variant mt-1 line-clamp-2">
                              {opt.description?.[lang]}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="w-full rounded-xl bg-surface-container p-2.5 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-sm">lightbulb</span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface truncate">
                      <strong>{lang === 'en' ? 'Historical fact:' : 'Тарихи дерек:'}</strong>{' '}
                      {currentQuestion.factoid?.[lang]}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PHASE 4: CELEBRATION FINALE                                               */}
        {/* ========================================================================= */}
        {phase === 'celebration' && (
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex-1 flex flex-col items-center justify-center text-center py-6 animate-fadeIn relative">
            <div className="relative flex items-center justify-center pt-2">
              <div className="absolute w-44 h-44 sm:w-56 sm:h-56 bg-gradient-to-tr from-secondary-fixed/40 via-primary-fixed/30 to-tertiary-fixed/40 rounded-full blur-2xl animate-pulse"></div>

              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full p-2 flex items-center justify-center">
                <img
                  src={lesson.mascot?.celebrateAvatar}
                  alt="Barys Mascot Celebration"
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_16px_rgba(43,108,0,0.18)] select-none transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -top-1 -right-2 bg-secondary-container text-on-secondary-container p-2 rounded-full shadow-[0_4px_0_0_#6e5400] flex items-center justify-center animate-bounce">
                  <span className="material-symbols-outlined text-[20px]">celebration</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center max-w-xl mx-auto mt-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-xs uppercase tracking-wider shadow-[0_2px_0_0_#f4bf00]">
                <span className="material-symbols-outlined text-[15px]">stars</span>
                <span>
                  {lesson.title?.[lang]} • {lesson.level}-{lang === 'en' ? 'Level' : 'Деңгей'}
                </span>
              </div>

              <h1 className="font-headline-xl text-2xl sm:text-3xl md:text-4xl text-on-surface font-extrabold tracking-tight mt-2">
                {lesson.celebration?.trophyTitle?.[lang] || 'Керемет нәтиже, Батыр! 🏆'}
              </h1>
              <p className="font-body-lg text-sm sm:text-base text-on-surface-variant max-w-md mx-auto mt-1">
                {lesson.celebration?.subtitle?.[lang]}
              </p>
            </div>

            {/* 3 Golden Stars */}
            <div className="flex flex-col items-center justify-center pt-3">
              <div className="flex items-center justify-center gap-3 sm:gap-4 py-1">
                <div className="w-13 h-13 sm:w-15 sm:h-15 p-3 rounded-2xl bg-secondary-container text-white flex items-center justify-center shadow-[0_5px_0_0_#6e5400] transform -rotate-12 transition-transform hover:-translate-y-1">
                  <span className="material-symbols-outlined text-[32px] sm:text-[38px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                </div>
                <div className="w-15 h-15 sm:w-18 sm:h-18 p-3 rounded-2xl bg-secondary-container text-white flex items-center justify-center shadow-[0_6px_0_0_#6e5400] transform -translate-y-2 transition-transform hover:-translate-y-3">
                  <span className="material-symbols-outlined text-[40px] sm:text-[46px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                </div>
                <div className="w-13 h-13 sm:w-15 sm:h-15 p-3 rounded-2xl bg-secondary-container text-white flex items-center justify-center shadow-[0_5px_0_0_#6e5400] transform rotate-12 transition-transform hover:-translate-y-1">
                  <span className="material-symbols-outlined text-[32px] sm:text-[38px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                </div>
              </div>

              <div className="mt-2 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary-container text-white font-label-md text-xs font-black shadow-[0_3px_0_0_#1e5000]">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>
                  {Math.round((correctCount / (totalQuestions || 1)) * 100)}%{' '}
                  {lang === 'en' ? 'Excellent Score' : 'Керемет нәтиже'}
                </span>
              </div>
            </div>

            {/* 4 Bento Performance Stats */}
            <div className="w-full max-w-3xl grid grid-cols-2 lg:grid-cols-4 gap-3 text-left pt-4">
              <div className="bg-surface-container-lowest rounded-2xl p-3.5 flex flex-col justify-between shadow-[0_4px_0_0_#dcdad2] border border-surface-container">
                <span className="font-label-sm text-[11px] uppercase text-outline font-black">
                  {lang === 'en' ? 'Total XP' : 'Жинаған XP'}
                </span>
                <div className="mt-2 font-headline-md text-xl text-secondary font-black">
                  +{lesson.celebration?.xpTotal || 30} XP
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-3.5 flex flex-col justify-between shadow-[0_4px_0_0_#dcdad2] border border-surface-container">
                <span className="font-label-sm text-[11px] uppercase text-outline font-black">
                  {lang === 'en' ? 'Accuracy' : 'Дәлдік'}
                </span>
                <div className="mt-2 font-headline-md text-xl text-tertiary font-black">
                  {Math.round((correctCount / (totalQuestions || 1)) * 100)}%
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-3.5 flex flex-col justify-between shadow-[0_4px_0_0_#dcdad2] border border-surface-container">
                <span className="font-label-sm text-[11px] uppercase text-outline font-black">
                  {lang === 'en' ? 'Time' : 'Уақыт'}
                </span>
                <div className="mt-2 font-headline-md text-xl text-on-surface font-black">
                  {formatTime(elapsedSeconds || 215)}
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-3.5 flex flex-col justify-between shadow-[0_4px_0_0_#dcdad2] border border-surface-container">
                <span className="font-label-sm text-[11px] uppercase text-outline font-black">
                  {lang === 'en' ? 'Streak' : 'Күн тізбегі'}
                </span>
                <div className="mt-2 font-headline-md text-xl text-error font-black">
                  1 {lang === 'en' ? 'DAY! 🔥' : 'КҮН! 🔥'}
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            {lesson.celebration?.badge && (
              <div className="w-full max-w-3xl bg-surface-container-low rounded-2xl p-4 flex items-center gap-3.5 shadow-[0_3px_0_0_#dcdad2] border border-surface-container text-left mt-3">
                <div className="w-13 h-13 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 shadow-[0_3px_0_0_#f4bf00]">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {lesson.celebration.badge.icon || 'explore'}
                  </span>
                </div>
                <div>
                  <div className="inline-block px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-black uppercase">
                    {lesson.celebration.badge.tag?.[lang]}
                  </div>
                  <div className="font-label-lg text-sm sm:text-base text-on-surface font-black mt-0.5">
                    {lesson.celebration.badge.title?.[lang]}
                  </div>
                  <div className="font-body-sm text-xs text-on-surface-variant">
                    {lesson.celebration.badge.description?.[lang]}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 3D TACTILE BOTTOM ACTION BAR / FEEDBACK DRAWER                            */}
      {/* ========================================================================= */}
      <footer className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-surface-container shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        {/* Phase A: Video Lesson -> Proceed to Quiz or Vocab */}
        {phase === 'video' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            <button
              onClick={() => setPhase('vocabulary')}
              className="px-5 py-2.5 rounded-2xl text-on-surface-variant font-label-md text-sm font-bold hover:bg-surface-container transition-all cursor-pointer"
            >
              {lang === 'en' ? 'Preview Vocab' : 'Сөздікті қарау'}
            </button>

            <button
              onClick={handleStartQuiz}
              className="px-8 py-3 rounded-2xl bg-primary-container text-white font-label-lg text-sm sm:text-base font-black shadow-[0_4px_0_0_#1e5000] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{lang === 'en' ? 'Understood! Start Quiz' : 'Түсіндім! Тестке өту'}</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Phase B: Vocabulary -> Start Quiz */}
        {phase === 'vocabulary' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            <button
              onClick={() => setPhase('video')}
              className="px-5 py-2.5 rounded-2xl text-on-surface-variant font-label-md text-sm font-bold hover:bg-surface-container transition-all cursor-pointer"
            >
              {lang === 'en' ? 'Back to Video' : 'Видеоға оралу'}
            </button>

            <button
              onClick={handleStartQuiz}
              className="px-8 py-3 rounded-2xl bg-primary-container text-white font-label-lg text-sm sm:text-base font-black shadow-[0_4px_0_0_#1e5000] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{lang === 'en' ? 'Start Quiz' : 'Тестті бастау'}</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Phase C: Question - Before Check */}
        {phase === 'question' && !isAnswerChecked && currentQuestion.type !== 'match_pairs' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-2xl text-on-surface-variant font-label-md text-sm font-bold hover:bg-surface-container transition-all cursor-pointer"
            >
              {lang === 'en' ? 'Skip' : 'Өткізу'}
            </button>

            <button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className={`px-8 py-3 rounded-2xl font-label-lg text-sm sm:text-base font-black transition-all flex items-center gap-2 ${
                selectedOption === null
                  ? 'bg-surface-container-highest text-on-surface-variant/40 cursor-not-allowed shadow-none'
                  : 'bg-primary-container text-white shadow-[0_4px_0_0_#1e5000] hover:brightness-105 active:translate-y-1 active:shadow-none cursor-pointer'
              }`}
            >
              <span>{lang === 'en' ? 'Check' : 'Тексеру'}</span>
              <span className="material-symbols-outlined text-lg">check_circle</span>
            </button>
          </div>
        )}

        {/* Phase C2: Question (Match Pairs active bar) */}
        {phase === 'question' && !isAnswerChecked && currentQuestion.type === 'match_pairs' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            <div className="text-xs font-bold text-outline">
              {matchedPairIds.length} / {currentQuestion.pairs?.length || 4} {lang === 'en' ? 'pairs matched' : 'жұп табылды'}
            </div>
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-2xl text-on-surface-variant font-label-md text-sm font-bold hover:bg-surface-container transition-all cursor-pointer"
            >
              {lang === 'en' ? 'Skip' : 'Өткізу'}
            </button>
          </div>
        )}

        {/* Phase D: Question - Checked & Correct */}
        {phase === 'question' && isAnswerChecked && isCurrentCorrect && (
          <div className="bg-[#eaf8e1] border-t-2 border-primary-container animate-slideUp">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-[0_3px_0_0_#1e5000]">
                  <span className="material-symbols-outlined text-2xl font-black">check</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-base sm:text-lg text-primary font-black">
                    {lang === 'en' ? 'Awesome! Correct Answer!' : 'Керемет! Дұрыс жауап!'}
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-0.5 max-w-xl">
                    {currentQuestion.explanation?.[lang]}
                  </p>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-primary text-white font-label-lg text-sm sm:text-base font-black shadow-[0_4px_0_0_#1e5000] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>{lang === 'en' ? 'Continue' : 'Жалғастыру'}</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Phase E: Question - Checked & Incorrect with AI Tutor CTA! */}
        {phase === 'question' && isAnswerChecked && !isCurrentCorrect && (
          <div className="bg-[#fdf0ee] border-t-2 border-error animate-slideUp">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-error text-white flex items-center justify-center shrink-0 shadow-[0_3px_0_0_#93000a]">
                  <span className="material-symbols-outlined text-2xl font-black">close</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-base sm:text-lg text-error font-black">
                    {lang === 'en' ? "Don't give up! Keep going!" : 'Қателеспейтін адам болмайды!'}
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-0.5 max-w-xl">
                    {currentQuestion.options?.[selectedOption]?.wrongFeedback?.[lang] ||
                      currentQuestion.explanation?.[lang]}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <p className="font-label-sm text-xs text-primary font-black">
                      {lang === 'en' ? 'Correct answer:' : 'Дұрыс жауабы:'}{' '}
                      {currentQuestion.options?.find((o) => o.isCorrect)?.text?.[lang]}
                    </p>

                    {/* Ask AI Tarihshy button right inside the feedback banner */}
                    <button
                      type="button"
                      onClick={handleAskAIAboutMistake}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-headline text-xs font-black shadow-sm hover:scale-105 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">psychology</span>
                      <span>{lang === 'en' ? 'Ask AI Tarihshy why' : 'AI Тарихшыдан сұрау'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-error text-white font-label-lg text-sm sm:text-base font-black shadow-[0_4px_0_0_#93000a] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>{lang === 'en' ? 'Got It' : 'Түсіндім'}</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Phase F: Celebration Finish */}
        {phase === 'celebration' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleRestartLesson}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl text-on-surface-variant font-label-md text-sm font-bold hover:bg-surface-container transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              <span>{lang === 'en' ? 'Review Lesson' : 'Сабақты қайталау'}</span>
            </button>

            <button
              onClick={handleFinishAndReturn}
              className="w-full sm:w-auto px-10 py-3 rounded-2xl bg-primary-container text-white font-label-lg text-sm sm:text-base font-black shadow-[0_4px_0_0_#1e5000] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{lang === 'en' ? 'Continue to Map' : 'Картаға оралу'}</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        )}
      </footer>

      {/* GAME OVER MODAL (Hearts = 0) */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-container flex flex-col items-center text-center relative">
            <div className="w-20 h-20 rounded-full bg-error-container/40 text-error flex items-center justify-center mb-3 animate-bounce">
              <span className="material-symbols-outlined text-5xl">heart_broken</span>
            </div>

            <h2 className="font-headline text-2xl font-black text-on-surface">
              {lang === 'en' ? 'You ran out of hearts!' : 'Жүрекшелеріңіз бітті!'}
            </h2>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-2 max-w-xs">
              {lang === 'en'
                ? 'Review the lecture video to strengthen your knowledge, or refill your hearts and try again!'
                : 'Көңіліңді түсірме, Батыр! Видео сабақты қайта көріп, біліміңді бекіт немесе жүрекшені толтырып, сынақты қайта баста!'}
            </p>

            <div className="w-full flex flex-col gap-2.5 mt-6">
              <button
                onClick={handleRefillAndContinue}
                className="w-full py-3 rounded-2xl bg-primary-container text-white font-headline text-sm font-black shadow-[0_4px_0_0_#1e5000] hover:brightness-105 active:translate-y-1 cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">favorite</span>
                <span>{lang === 'en' ? 'Refill Hearts & Try Again (+5)' : 'Жүрекшелерді толтыру (+5)'}</span>
              </button>

              <button
                onClick={() => {
                  setIsGameOver(false);
                  setHearts(5);
                  setPhase('video');
                }}
                className="w-full py-2.5 rounded-2xl bg-surface-container text-on-surface font-headline text-xs font-bold hover:bg-surface-container-high cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">smart_display</span>
                <span>{lang === 'en' ? 'Review Video Lecture' : 'Видео дәріске оралу'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Artifact Zoom Inspection Modal */}
      {isZoomModalOpen && currentQuestion?.image && (
        <div
          onClick={() => setIsZoomModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-container-lowest max-w-xl w-full rounded-3xl p-5 shadow-2xl flex flex-col items-center gap-4 relative"
          >
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
            <h3 className="font-headline-md text-lg text-on-surface font-black">
              {currentQuestion.specimenId ? `ЭКСПОНАТ #${currentQuestion.specimenId}` : 'Артефакт 3D'}
            </h3>
            <div className="w-full h-80 rounded-2xl overflow-hidden bg-surface-container">
              <img
                src={currentQuestion.image}
                alt="Zoomed artifact"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant text-center">
              {currentQuestion.location?.[lang]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
