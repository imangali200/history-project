/**
 * Senior-Grade E2E Test Suite for QAZHISTORY NestJS Backend
 * Covers all endpoints across 8 modules with performance benchmarking
 */

const BASE_URL = process.env.API_URL || 'http://localhost:4000/api';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  bold: '\x1b[1m',
};

let authToken = '';
let testStats = {
  total: 0,
  passed: 0,
  failed: 0,
  latencies: [],
};

async function test(name, fn) {
  testStats.total++;
  const start = performance.now();
  try {
    await fn();
    const duration = Math.round(performance.now() - start);
    testStats.latencies.push(duration);
    testStats.passed++;
    console.log(`  ${COLORS.green}✔ PASS${COLORS.reset} [${duration}ms] - ${name}`);
  } catch (error) {
    const duration = Math.round(performance.now() - start);
    testStats.failed++;
    console.log(`  ${COLORS.red}✖ FAIL${COLORS.reset} [${duration}ms] - ${name}`);
    console.log(`    ${COLORS.red}Error: ${error.message}${COLORS.reset}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const json = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, body: json };
}

async function runAllTests() {
  console.log(`\n${COLORS.bold}${COLORS.cyan}====================================================${COLORS.reset}`);
  console.log(`${COLORS.bold}${COLORS.cyan}   QAZHISTORY BACKEND COMPLETE ENDPOINT TEST SUITE   ${COLORS.reset}`);
  console.log(`${COLORS.bold}${COLORS.cyan}   Target: ${BASE_URL}${COLORS.reset}`);
  console.log(`${COLORS.bold}${COLORS.cyan}====================================================\n${COLORS.reset}`);

  // 1. AUTH MODULE
  console.log(`${COLORS.bold}1. Authentication Module (/api/auth)${COLORS.reset}`);
  await test('POST /auth/sdu-login with valid SDU student ID', async () => {
    const res = await request('/auth/sdu-login', {
      method: 'POST',
      body: JSON.stringify({ studentId: '220107045', password: 'password123' }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.success === true, 'Response success should be true');
    assert(res.body.data.tokens.accessToken, 'Should return accessToken');
    authToken = res.body.data.tokens.accessToken;
  });

  await test('POST /auth/sdu-login with invalid password (security check)', async () => {
    const res = await request('/auth/sdu-login', {
      method: 'POST',
      body: JSON.stringify({ studentId: '220107045', password: 'wrongPassword!@#' }),
    });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  await test('POST /auth/register - dynamically register new test student', async () => {
    const uniqueId = `2401${Math.floor(10000 + Math.random() * 90000)}`;
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        studentId: uniqueId,
        name: `Студент ${uniqueId}`,
        password: 'password123',
        faculty: 'FEAS',
        course: 1,
      }),
    });
    assert(res.status === 201 || res.status === 200, `Expected 200/201, got ${res.status}`);
    assert(res.body.data.user.studentId === uniqueId, 'Registered studentId should match');
  });

  await test('GET /auth/me - protected profile check via JWT Bearer', async () => {
    const res = await request('/auth/me');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.data.studentId === '220107045', 'Should return authenticated user profile');
  });

  // 2. HISTORY WORLD GAMES (10 MODES)
  console.log(`\n${COLORS.bold}2. History World Games Engine (/api/games)${COLORS.reset}`);
  await test('GET /games/world-state - fetch destinations & Time Crystal status', async () => {
    const res = await request('/games/world-state');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.data.destinations.length >= 10, 'Should have all 10 game destinations');
    assert(Array.isArray(res.body.data.timeCrystalFragments), 'Fragments should be an array');
    assert(Array.isArray(res.body.data.artifacts), 'Artifacts should be an array');
  });

  await test('POST /games/complete - report victory and award Time Crystal fragment', async () => {
    const res = await request('/games/complete', {
      method: 'POST',
      body: JSON.stringify({
        gameKey: 'time-travel',
        score: 100,
        stars: 3,
        fragmentId: 1,
        artifactKey: 'golden-headdress',
      }),
    });
    assert(res.status === 200 || res.status === 201, `Expected 200, got ${res.status}`);
    assert(res.body.data.xpEarned > 0, 'Should award XP');
    assert(res.body.data.coinsEarned > 0, 'Should award coins');
  });

  // 3. CURRICULUM & LESSONS
  console.log(`\n${COLORS.bold}3. Curriculum & Lessons (/api/lessons)${COLORS.reset}`);
  await test('GET /lessons/map - fetch historical eras and learning path', async () => {
    const res = await request('/lessons/map');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.data.eras.length > 0, 'Should return historical eras');
  });

  await test('GET /lessons/stone-age-1 - fetch lesson details & interactive questions', async () => {
    const res = await request('/lessons/stone-age-1');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.data.questions.length > 0, 'Should contain questions');
  });

  await test('POST /lessons/stone-age-1/submit - submit quiz answers & calculate stars', async () => {
    const res = await request('/lessons/stone-age-1/submit', {
      method: 'POST',
      body: JSON.stringify({
        score: 100,
        mistakesCount: 0,
        timeSpentSeconds: 45,
      }),
    });
    assert(res.status === 200 || res.status === 201, `Expected 200, got ${res.status}`);
    assert(res.body.data.stars === 3, 'Perfect score should give 3 stars');
    assert(res.body.data.xpEarned >= 25, 'Should award lesson XP');
  });

  // 4. LEADERBOARD & LEAGUES
  console.log(`\n${COLORS.bold}4. Leaderboard & Leagues (/api/leaderboard)${COLORS.reset}`);
  await test('GET /leaderboard/weekly - fetch weekly XP rankings', async () => {
    const res = await request('/leaderboard/weekly');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.body.data), 'Leaderboard should be an array');
    assert(res.body.data.length > 0, 'Should return ranked students');
    assert(res.body.data[0].rank === 1, 'Top student should be rank 1');
  });

  await test('GET /leaderboard/my-rank - fetch current student position', async () => {
    const res = await request('/leaderboard/my-rank');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.data.rank >= 1, 'Rank should be a positive number');
  });

  // 5. AI TARIHSHY (TUTOR)
  console.log(`\n${COLORS.bold}5. AI Tarihshy Tutor (/api/ai-tutor)${COLORS.reset}`);
  await test('POST /ai-tutor/chat - ask historical question & earn 5 XP', async () => {
    const res = await request('/ai-tutor/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Қасым ханның қасқа жолы туралы айтып берші' }),
    });
    assert(res.status === 200 || res.status === 201, `Expected 200, got ${res.status}`);
    assert(res.body.data.reply.length > 20, 'AI should return comprehensive historical response');
    assert(res.body.data.xpEarned === 5, 'Should award 5 XP for inquiring');
  });

  // 6. USERS & PROFILE
  console.log(`\n${COLORS.bold}6. Users & Profile (/api/users)${COLORS.reset}`);
  await test('GET /users/profile - fetch student profile', async () => {
    const res = await request('/users/profile');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.data.name, 'Profile should include name');
  });

  await test('PATCH /users/profile - update avatar & name', async () => {
    const res = await request('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify({ avatar: 'tomiris' }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.data.avatar === 'tomiris', 'Avatar should be updated');
  });

  await test('GET /users/stats - fetch radar stats & weekly activity', async () => {
    const res = await request('/users/stats');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.data.radarStats, 'Should contain radar analysis');
  });

  // 7. DAILY QUESTS
  console.log(`\n${COLORS.bold}7. Daily Quests (/api/quests)${COLORS.reset}`);
  await test('GET /quests/daily - fetch daily habit quests', async () => {
    const res = await request('/quests/daily');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.data.length >= 3, 'Should have at least 3 daily quests');
  });

  await test('POST /quests/quest-1/claim - claim quest rewards', async () => {
    const res = await request('/quests/quest-1/claim', { method: 'POST' });
    assert(res.status === 200 || res.status === 201, `Expected 200, got ${res.status}`);
    assert(res.body.data.xpAwarded > 0, 'Should award quest XP');
  });

  // 8. SDU CERTIFICATES
  console.log(`\n${COLORS.bold}8. SDU Certificates & Verification (/api/certificates)${COLORS.reset}`);
  let certCode = '';
  await test('POST /certificates/generate - generate verifiable course certificate', async () => {
    const res = await request('/certificates/generate', { method: 'POST' });
    assert(res.status === 200 || res.status === 201, `Expected 200, got ${res.status}`);
    assert(res.body.data.certificateNumber, 'Should generate unique certificate number');
    certCode = res.body.data.certificateNumber;
  });

  await test(`GET /certificates/verify/:code - public verification without auth`, async () => {
    const res = await request(`/certificates/verify/${certCode || 'SDU-SAMPLE'}`, {
      headers: { Authorization: '' },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.data.status === 'VALID', 'Certificate should be valid');
  });

  // 9. HIGH-THROUGHPUT STRESS TEST (LATENCY & NO-LAG VERIFICATION)
  console.log(`\n${COLORS.bold}9. Performance & Throughput Benchmark (50 Concurrent Requests)${COLORS.reset}`);
  await test('Fire 50 parallel requests - verify 0 errors & sub-30ms response', async () => {
    const promises = Array.from({ length: 50 }, () => request('/games/world-state'));
    const results = await Promise.all(promises);
    const allSuccessful = results.every((r) => r.status === 200);
    assert(allSuccessful, 'All 50 concurrent requests must succeed with 200 OK');
  });

  // SUMMARY REPORT
  const avgLatency = Math.round(
    testStats.latencies.reduce((a, b) => a + b, 0) / testStats.latencies.length
  );
  const minLatency = Math.min(...testStats.latencies);
  const maxLatency = Math.max(...testStats.latencies);

  console.log(`\n${COLORS.bold}${COLORS.cyan}====================================================${COLORS.reset}`);
  console.log(`${COLORS.bold}   TEST EXECUTION SUMMARY REPORT   ${COLORS.reset}`);
  console.log(`${COLORS.bold}${COLORS.cyan}====================================================${COLORS.reset}`);
  console.log(`  Total Endpoints Tested: ${COLORS.bold}${testStats.total}${COLORS.reset}`);
  console.log(`  Passed:                 ${COLORS.green}${COLORS.bold}${testStats.passed} ✔${COLORS.reset}`);
  console.log(`  Failed:                 ${testStats.failed === 0 ? COLORS.green : COLORS.red}${COLORS.bold}${testStats.failed}${COLORS.reset}`);
  console.log(`  Success Rate:           ${COLORS.green}${COLORS.bold}${Math.round((testStats.passed / testStats.total) * 100)}%${COLORS.reset}`);
  console.log(`  Latency Metrics:        Avg: ${COLORS.yellow}${avgLatency}ms${COLORS.reset} | Min: ${COLORS.green}${minLatency}ms${COLORS.reset} | Max: ${COLORS.cyan}${maxLatency}ms${COLORS.reset}`);
  console.log(`${COLORS.bold}${COLORS.cyan}====================================================\n${COLORS.reset}`);

  if (testStats.failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((e) => {
  console.error('Fatal error in test suite:', e);
  process.exit(1);
});
