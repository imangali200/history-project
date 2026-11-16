import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function QuestsPage() {
  const { i18n } = useTranslation();
  const { user, completedQuests, dailyGoalProgress, addXp } = useAuth();
  const lang = i18n.language === 'en' ? 'en' : 'kk';

  const QUESTS = [
    {
      id: 'q1',
      title: { kk: '1 сабақ аяқтау', en: 'Complete 1 lesson' },
      desc: { kk: 'Тас дәуірі немесе Сақтар бөлімінен сабақ өт', en: 'Finish a lesson from Stone Age or Saka era' },
      xp: 15,
      progress: completedQuests >= 1 ? 1 : 0,
      target: 1,
      icon: 'school',
      done: completedQuests >= 1
    },
    {
      id: 'q2',
      title: { kk: 'Тарихшыға 1 сұрақ қою', en: 'Ask AI Tarihshy 1 question' },
      desc: { kk: 'AI тарихшыдан көне дәуірлер туралы сұра', en: 'Ask AI tutor about ancient steppe civilizations' },
      xp: 10,
      progress: completedQuests >= 2 ? 1 : 0,
      target: 1,
      icon: 'psychology',
      done: completedQuests >= 2
    },
    {
      id: 'q3',
      title: { kk: '90%+ дәлдікпен тапсыру', en: 'Score with 90%+ accuracy' },
      desc: { kk: 'Сұрақтарға қатесіз жауап беріп, жұлдыз ал', en: 'Answer historical questions with precision' },
      xp: 20,
      progress: completedQuests >= 3 ? 1 : 0,
      target: 1,
      icon: 'verified',
      done: completedQuests >= 3
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface">
          {lang === 'en' ? 'Daily History Quests' : 'Күнделікті Тарихи Тапсырмалар'}
        </h1>
        <p className="font-body text-sm text-on-surface-variant mt-1">
          {lang === 'en'
            ? 'Complete daily challenges to earn bonus XP, extend your streak, and unlock steppe badges.'
            : 'Күн сайын жаңа тапсырмаларды орындап, қосымша XP ұтып ал және серияңды сақта!'}
        </p>
      </div>

      {/* Daily Progress Card */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-[0_4px_0_0_#dcdad2] mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-2xl">local_fire_department</span>
            <span className="font-headline text-base font-extrabold text-on-surface">
              {lang === 'en' ? 'Daily Goal Progress' : 'Күндік мақсат орындалуы'}
            </span>
          </div>
          <span className="font-headline text-sm font-black text-primary">
            {dailyGoalProgress}%
          </span>
        </div>
        <div className="w-full h-4 bg-surface-container-highest rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-primary-container rounded-full transition-all duration-500 shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
            style={{ width: `${dailyGoalProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Quests List */}
      <div className="grid grid-cols-1 gap-4">
        {QUESTS.map((quest) => (
          <div
            key={quest.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              quest.done
                ? 'bg-[#f4fbe9] border-primary-container/40 shadow-[0_3px_0_0_#a8e063]'
                : 'bg-surface-container-lowest border-surface-container shadow-[0_3px_0_0_#dcdad2]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  quest.done ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">{quest.icon}</span>
              </div>
              <div>
                <h3 className="font-headline text-base font-extrabold text-on-surface">
                  {quest.title[lang]}
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                  {quest.desc[lang]}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs font-bold text-outline">
                  <span>
                    {quest.progress}/{quest.target}
                  </span>
                  <div className="w-24 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-container"
                      style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <span className="px-3 py-1.5 rounded-xl bg-secondary-container/20 text-on-secondary-container font-headline text-xs font-black">
                +{quest.xp} XP
              </span>
              {quest.done && (
                <span className="material-symbols-outlined text-primary text-2xl font-black">
                  check_circle
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
