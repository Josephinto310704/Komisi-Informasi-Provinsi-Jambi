import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck, BookmarkCheck } from 'lucide-react';

import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Announcements from './components/Announcements.jsx';
import ScheduleSection from './components/ScheduleSection.jsx';
import VerdictSection from './components/VerdictSection.jsx';
import ContactFooter from './components/ContactFooter.jsx';

import { MOCK_JADWAL, MOCK_PENGUMUMAN, MOCK_PUTUSAN } from './data.js';

export default function App() {
  const [searchQueryFromHero, setSearchQueryFromHero] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Live datasets for searchability
  const [schedules] = useState(MOCK_JADWAL);
  const [announcements] = useState(MOCK_PENGUMUMAN);
  const [verdicts] = useState(MOCK_PUTUSAN);

  // Compute stats
  const activeSchedulesCount = schedules.filter(s => s.status !== 'Selesai').length;
  const newVerdictsCount = verdicts.length;
  const todaySchedulesCount = schedules.filter(s => s.tanggal === '2026-05-25').length;
  const ongoingSchedulesCount = schedules.filter(s => s.status === 'Sedang Berlangsung').length;

  const handleHeroSearchSubmit = (category, query) => {
    setSearchQueryFromHero(query);
    
    // Trigger smooth scroll to target section
    const targetId = category === 'sidang' ? 'schedules' : 'verdicts';
    const element = document.getElementById(targetId);
    
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      const categoryLabel = category === 'sidang' ? 'Jadwal Sidang' : 'Direktori Putusan';
      setToastMessage(`Menyaring ${categoryLabel} dengan kata kunci: "${query}"`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleHeaderSearchFocus = (type) => {
    const targetId = type === 'sidang' ? 'schedules' : 'verdicts';
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      const inputId = type === 'sidang' ? 'search-input' : 'verdict-controls';
      const inputEl = document.getElementById(inputId) || document.querySelector(`#${targetId} input`);
      if (inputEl) {
        inputEl.focus();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-gold-200 selection:text-slate-900">
      
      {/* Top sticky navigation bar */}
      <Header 
        onSearchFocus={handleHeaderSearchFocus} 
        activeSchedulesCount={activeSchedulesCount}
        newVerdictsCount={newVerdictsCount}
      />

      <main>
        {/* Hero visual elements with fast search input */}
        <Hero 
          onSearchSubmit={handleHeroSearchSubmit}
          todaySchedulesCount={todaySchedulesCount}
          ongoingSchedulesCount={ongoingSchedulesCount}
          totalVerdictsCount={newVerdictsCount}
        />

        {/* Dynamic floating query filter notifier */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 20, x: '-50%' }}
              className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2.5 rounded-full bg-slate-900 px-5 py-3 text-xs font-semibold text-white shadow-xl border border-slate-800"
              id="global-toast-message"
            >
              <BookmarkCheck className="h-4.5 w-4.5 text-gold-400 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. COURT SCHEDULES GRID CARD SECTION */}
        <div className="relative">
          <ScheduleSection 
            schedules={schedules} 
            searchQueryFromHero={searchQueryFromHero}
          />
        </div>

        {/* 2. BULLETIN MAKLUMAT OFFICIAL ANNOUNCEMENTS */}
        <div className="border-t border-b border-slate-200">
          <Announcements 
            announcements={announcements}
          />
        </div>

        {/* 3. VERDICTS DIRECTORY ARCHIVES SECTION */}
        <div>
          <VerdictSection 
            verdicts={verdicts}
            searchQueryFromHero={searchQueryFromHero}
          />
        </div>

        {/* 4. PUBLIC INTEREST GUIDELINES STATEMENET BANNER */}
        <section className="bg-slate-900 text-white border-t border-slate-850 py-12">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="rounded-2xl .bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
              <div className="space-y-3 max-w-2xl text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Sistem Keterbukaan Informasi Publik Jambi</span>
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl tracking-tight text-white leading-tight">
                  Tingkatkan Kesadaran dan Kepatuhan Informasi Publik
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Semua pengajuan permohonan penyelesaian sengketa informasi (PSI) terfasilitasi secara aman melalui SIPSI demi penegakan keterbukaan informasi yang adil, transparan, dan akuntabel di instansi pemerintah Provinsi Jambi.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <a
                  href="https://ki.jambiprov.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 text-xs font-bold transition-all shadow-md"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Kunjungi Portal Resmi KI Jambi</span>
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Main Footer contact/report module */}
      <ContactFooter />

    </div>
  );
}
