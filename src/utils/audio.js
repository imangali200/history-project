// Lightweight Web Audio API sound effects with Mute toggle support & Kazakh TTS

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.isMuted = typeof window !== 'undefined' ? localStorage.getItem('sdu_history_sound_muted') === 'true' : false;
    this.voices = [];
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices() || [];
    }
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sdu_history_sound_muted', this.isMuted ? 'true' : 'false');
    }
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  playCorrect() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // Audio not permitted or not supported
    }
  }

  playTileMatch() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(880.00, now + 0.08); // A5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  playTap() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  playWrong() {
    this.playError();
  }

  playError() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.setValueAtTime(180, now + 0.15); // F#3

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Audio not permitted
    }
  }

  playFanfare() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.5);
      });
    } catch {
      // Audio error ignored
    }
  }

  /**
   * Speak text using Web Speech API with Kazakh accent/voice priority
   */
  speak(text, lang = 'kk-KZ') {
    if (this.isMuted || !text) return;
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9; // Clear, calm teaching tempo
        utterance.pitch = 1.0;

        // Refresh voices if list is empty
        if (!this.voices || this.voices.length === 0) {
          this.voices = window.speechSynthesis.getVoices() || [];
        }

        const isKazakh = lang.startsWith('kk');

        if (isKazakh && this.voices.length > 0) {
          // 1. Try finding native Kazakh voice
          const kzVoice = this.voices.find(
            (v) =>
              v.lang.toLowerCase().startsWith('kk') ||
              v.name.toLowerCase().includes('kazakh') ||
              v.name.toLowerCase().includes('казах')
          );

          if (kzVoice) {
            utterance.voice = kzVoice;
            utterance.lang = kzVoice.lang || 'kk-KZ';
          } else {
            // 2. High-quality Turkic / Cyrillic voice fallback with best phonetics for Kazakh
            const fallbackVoice = this.voices.find(
              (v) =>
                v.lang.toLowerCase().startsWith('tr') ||
                v.lang.toLowerCase().startsWith('ru')
            );
            if (fallbackVoice) {
              utterance.voice = fallbackVoice;
            }
          }
        } else if (!isKazakh && this.voices.length > 0) {
          const enVoice = this.voices.find(
            (v) => v.lang.toLowerCase().startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural'))
          ) || this.voices.find((v) => v.lang.toLowerCase().startsWith('en'));

          if (enVoice) {
            utterance.voice = enVoice;
          }
        }

        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Speech not supported
    }
  }

  speakText(text, lang = 'kk-KZ') {
    this.speak(text, lang);
  }
}

export const sounds = new SoundEffects();
export default sounds;
