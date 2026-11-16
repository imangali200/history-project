// AI Service supporting real Google Gemini API with NestJS Backend AI Tutor
import { api } from './api';

export const getGeminiApiKey = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('qazhistory_gemini_key');
    if (stored && stored.trim().length > 10) return stored.trim();
  }
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

export const setGeminiApiKey = (key) => {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem('qazhistory_gemini_key', key.trim());
    } else {
      localStorage.removeItem('qazhistory_gemini_key');
    }
  }
};

export async function askGeminiAPI(userQuery, chatHistory = [], lang = 'kk') {
  const apiKey = getGeminiApiKey();

  // 1. If direct Gemini API key is provided by student, call Google Gemini directly
  if (apiKey) {
    const systemInstruction =
      lang === 'en'
        ? 'You are QAZHISTORY AI Tutor, an expert historian of Kazakhstan and Eurasian nomadic civilization. Answer the student warmly, accurately, with historical dates, rulers, and structured bullet points.'
        : 'Сен — QAZHISTORY білім беру платформасының арнайы AI Тарихшысысың (Барыс AI). Қазақстан тарихы мен Ұлы Дала өркениетінің білгірісің. Оқушының сұрағына қазақ тілінде нақты, сауатты, тарихи деректермен жауап бер.';

    const contents = [];
    const recentHistory = chatHistory.slice(-6);
    recentHistory.forEach((msg) => {
      if (msg.sender === 'user') {
        contents.push({ role: 'user', parts: [{ text: msg.text }] });
      } else if (msg.sender === 'ai' && msg.id !== 'welcome-01') {
        contents.push({ role: 'model', parts: [{ text: msg.text }] });
      }
    });
    contents.push({ role: 'user', parts: [{ text: userQuery }] });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    }
  }

  // 2. Call NestJS Backend AI Tarihshy endpoint: POST /api/ai-tutor/chat
  try {
    const backendRes = await api.post('/ai-tutor/chat', { message: userQuery });
    if (backendRes?.reply) {
      return backendRes.reply;
    }
  } catch (err) {
    console.warn('[AI Service] Backend AI Tarihshy error:', err.message);
  }

  throw new Error('AI жауап бере алмады.');
}

export default {
  getGeminiApiKey,
  setGeminiApiKey,
  askGeminiAPI,
};
