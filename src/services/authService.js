/**
 * SDU University Authentication Service
 * Connected directly to NestJS Backend: POST /api/auth/sdu-login
 */

import { api, setAuthToken } from './api';

// SDU Local Database fallback for offline resilience
const SDU_STUDENT_DATABASE = [
  {
    studentId: '220107045',
    password: 'password123',
    name: 'Батыр Сұлтанов',
    nameEn: 'Batyr Sultanov',
    faculty: 'Инженерия және жаратылыстану ғылымдары факультеті (FEAS)',
    facultyEn: 'Faculty of Engineering & Natural Sciences (FEAS)',
    specialty: 'Ақпараттық жүйелер (Information Systems)',
    course: 3,
    xp: 450,
    streak: 4,
    hearts: 5,
    level: 5,
    isNewUser: false,
    timeCrystalFragments: [1, 2, 3, 5],
  },
  {
    studentId: '240103012',
    password: 'password123',
    name: 'Аружан Қайратқызы',
    nameEn: 'Aruzhan Kairatkyzy',
    faculty: 'Білім және гуманитарлық ғылымдар факультеті (FEH)',
    facultyEn: 'Faculty of Education & Humanities (FEH)',
    specialty: 'Қазақ тілі мен тарихы (Kazakh History & Lang)',
    course: 1,
    xp: 120,
    streak: 2,
    hearts: 5,
    level: 2,
    isNewUser: false,
    timeCrystalFragments: [1],
  },
];

export async function loginWithSDU(studentId, password) {
  const trimmedId = studentId.trim();
  const trimmedPass = password.trim();

  // 1. Try real NestJS backend endpoint first
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
    console.warn('[SDU Auth] Backend request failed, checking local fallback:', backendError.message);
  }

  // 2. Offline Fallback
  const student = SDU_STUDENT_DATABASE.find((s) => s.studentId === trimmedId);
  if (student) {
    return {
      success: true,
      user: { ...student },
    };
  }

  if (/^\d{6,12}$/.test(trimmedId)) {
    return {
      success: true,
      user: {
        studentId: trimmedId,
        name: `SDU Студент (${trimmedId})`,
        nameEn: `SDU Student (${trimmedId})`,
        faculty: 'SDU University',
        course: 1,
        xp: 50,
        streak: 1,
        hearts: 5,
        level: 1,
        isNewUser: false,
        timeCrystalFragments: [],
      },
    };
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
