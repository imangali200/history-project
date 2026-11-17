/**
 * SDU University Authentication Service
 * Connected directly to NestJS Backend: POST /api/auth/sdu-login
 */

import { api, setAuthToken } from './api';

export async function loginWithSDU(studentId, password) {
  const trimmedId = studentId.trim();
  const trimmedPass = password.trim();

  // Call the real NestJS backend endpoint
  try {
    const data = await api.post('/auth/sdu-login', {
      studentId: trimmedId,
      password: trimmedPass,
    });

    if (data?.tokens?.accessToken) {
      setAuthToken(data.tokens.accessToken);
    }

    if (data?.user) {
      return {
        success: true,
        user: data.user,
        token: data?.tokens?.accessToken,
      };
    }
  } catch (backendError) {
    // If it's a 401/403 from the backend, propagate the real error
    if (backendError?.status === 401 || backendError?.status === 403) {
      throw new Error('Student ID немесе құпия сөз қате. Қайталап көріңіз.');
    }
    // Network or server error — propagate it too
    console.error('[SDU Auth] Backend error:', backendError.message);
    throw new Error('Сервермен байланыс орнатылмады. Интернет қосылымын тексеріңіз.');
  }

  throw new Error('Student ID немесе құпия сөз қате. Қайталап көріңіз.');
}

export async function getCurrentUserProfile() {
  try {
    const user = await api.get('/auth/me');
    return user;
  } catch {
    return null;
  }
}

export default {
  loginWithSDU,
  getCurrentUserProfile,
};
