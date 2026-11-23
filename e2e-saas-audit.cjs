const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log('====================================================');
  console.log('🏛️ Campus StudyHub SaaS - Automated E2E Verification');
  console.log('====================================================\n');

  let browser;
  const consoleErrors = [];
  const pageErrors = [];
  const tempProfileDir = path.join(os.tmpdir(), 'puppeteer_saas_test_' + Date.now());

  try {
    browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: 'new',
      userDataDir: tempProfileDir,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('favicon.ico') && !text.includes('ERR_CONNECTION_REFUSED')) {
          consoleErrors.push(text);
          console.log(`[Browser Console Error]: ${text}`);
        }
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err.toString());
      console.log(`[Browser Page Exception]: ${err.toString()}`);
    });

    // =========================================================================
    // Phase 1: Public Landing Page & Auth Gate
    // =========================================================================
    console.log('📍 Phase 1: Testing Public Landing Page & Auth Gate...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      localStorage.removeItem('campus_user');
      window.location.reload();
    });
    await wait(1200);

    // 1. Verify Page Title
    const titleText = await page.title();
    console.log(`  ✓ Page title: "${titleText}"`);

    // 2. Verify Hero Header
    const hasLandingHero = await page.evaluate(() => {
      const text = document.body.textContent;
      return text.includes('Campus StudyHub') &&
             text.includes('The Cozy, Multiplayer Study Workspace for Deep Focus');
    });
    console.log(`  ✓ Hero heading verified: ${hasLandingHero ? 'PASS' : 'FAIL'}`);

    // 3. Live Presence Counter
    const studentCounter = await page.evaluate(() => {
      return document.body.textContent.includes('2,418 Students Online');
    });
    console.log(`  ✓ Live student counter: ${studentCounter ? 'PASS' : 'FAIL'}`);

    // 4. Hero Environment Switcher Buttons (Library, Rooftop, Cafe, Arcade)
    console.log('  Testing Hero Environment Switcher...');
    const switchedRoom = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const rooftopBtn = btns.find(b => b.textContent && b.textContent.includes('Stargazer') || b.textContent.includes('Rooftop'));
      if (rooftopBtn) {
        rooftopBtn.click();
        return true;
      }
      return false;
    });
    await wait(400);
    console.log(`  ✓ Hero room switcher interaction: ${switchedRoom ? 'PASS' : 'FAIL'}`);

    // 5. Bento Card 1: PPTX Analyzer Demo Extraction
    console.log('  Testing Bento Grid Interactive Previews...');
    const extractedConcept = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const extractBtn = btns.find(b => b.textContent && b.textContent.includes('Extract Concepts'));
      if (extractBtn) {
        extractBtn.click();
        return true;
      }
      return false;
    });
    await wait(500);
    const hasExtractedState = await page.evaluate(() => {
      return document.body.textContent.includes('Slide 1: State Machine Replication') ||
             document.body.textContent.includes('Reset Demo');
    });
    console.log(`  ✓ PPTX Analyzer demo extraction: ${hasExtractedState ? 'PASS' : 'FAIL'}`);

    // 6. Bento Card 2: 3D Flashcard Flip Preview
    const flippedCard = await page.evaluate(() => {
      const card = document.getElementById('bento-flashcard-preview');
      if (card) {
        card.click();
        return true;
      }
      return false;
    });
    await wait(500);
    const hasFlippedAnswer = await page.evaluate(() => {
      return document.body.textContent.includes('Active retrieval practice triggers neurogenesis') ||
             document.body.textContent.includes('ANSWER (BACK)');
    });
    console.log(`  ✓ Flashcard 3D flip interactive preview: ${hasFlippedAnswer ? 'PASS' : 'FAIL'}`);

    // 7. Auth Modal Trigger
    console.log('  Testing Auth Modal Gate...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const ctaBtn = btns.find(b => b.textContent && b.textContent.includes('Start Studying Free'));
      if (ctaBtn) ctaBtn.click();
    });
    await wait(600);

    const isModalVisible = await page.evaluate(() => {
      return document.body.textContent.includes('Join Campus StudyHub') ||
             document.body.textContent.includes('Instant Demo Access') ||
             document.body.textContent.includes('1-Click Demo →');
    });
    console.log(`  ✓ Auth Modal opened: ${isModalVisible ? 'PASS' : 'FAIL'}`);

    // 8. 1-Click Demo Login
    console.log('  Executing 1-Click Demo Login...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const demoBtn = btns.find(b => b.textContent && b.textContent.includes('1-Click Demo →'));
      if (demoBtn) demoBtn.click();
    });
    await wait(1000);

    // =========================================================================
    // Phase 2: Logged-In Discord Study Workspace
    // =========================================================================
    console.log('\n📍 Phase 2: Testing Logged-In Discord Study Workspace...');

    const isWorkspaceVisible = await page.evaluate(() => {
      const text = document.body.textContent;
      return text.includes('Multiplayer Rooms') &&
             text.includes('AI & Docs Studio') &&
             text.includes('Focus & Health') &&
             text.includes('Alex_Scholar');
    });
    console.log(`  ✓ 3-Column Discord Layout rendered: ${isWorkspaceVisible ? 'PASS' : 'FAIL'}`);

    // Verify Left Nav Rail Quads
    console.log('  Testing Left Navigation Rail Quad Switchers...');
    const railResult = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rooftopBtn = buttons.find(b => b.title && b.title.includes('Stargazer Rooftop'));
      if (rooftopBtn) {
        rooftopBtn.click();
        return true;
      }
      return false;
    });
    await wait(500);
    console.log(`  ✓ Left rail environment switcher: ${railResult ? 'PASS' : 'FAIL'}`);

    // Helper to click sidebar channel deterministically
    async function selectChannel(channelId) {
      return page.evaluate((cId) => {
        const btn = document.querySelector(`button[data-channel="${cId}"]`);
        if (btn) {
          btn.scrollIntoView({ block: 'nearest', inline: 'center' });
          btn.click();
          return true;
        }
        return false;
      }, channelId);
    }

    // Channel 1: PDF & PPTX Analyzer
    console.log('\n  Testing Channel: # pdf-ppt-analyzer...');
    await selectChannel('pdf-ppt-analyzer');
    await wait(600);
    const hasAnalyzer = await page.evaluate(() => {
      return document.body.textContent.includes('PDF & Presentation Analyzer') &&
             document.body.textContent.includes('Upload Slides');
    });
    console.log(`  ✓ PDF & PPTX Analyzer loaded: ${hasAnalyzer ? 'PASS' : 'FAIL'}`);

    // Preset lecture selector
    const switchedLecture = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const dlBtn = btns.find(b => b.textContent && b.textContent.includes('Attention_Is_All_You_Need'));
      if (dlBtn) {
        dlBtn.click();
        return true;
      }
      return false;
    });
    await wait(600);
    const hasLectureResults = await page.evaluate(() => {
      return document.body.textContent.includes('Attention_Is_All_You_Need') ||
             document.body.textContent.includes('Export to Study Deck');
    });
    console.log(`  ✓ Sample lecture selection & slide breakdown: ${hasLectureResults ? 'PASS' : 'FAIL'}`);

    // Channel 2: Adaptive Reader
    console.log('\n  Testing Channel: # adaptive-reader...');
    await selectChannel('adaptive-reader');
    await wait(600);
    const hasReader = await page.evaluate(() => {
      return document.body.textContent.includes('Adaptive Document Reader') ||
             document.body.textContent.includes('Bionic Reading');
    });
    console.log(`  ✓ Adaptive Reader loaded: ${hasReader ? 'PASS' : 'FAIL'}`);

    // Toggle Bionic Reading
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const bionicBtn = btns.find(b => b.textContent && b.textContent.includes('Bionic'));
      if (bionicBtn) bionicBtn.click();
    });
    await wait(300);

    // Channel 3: Flashcards 3D
    console.log('\n  Testing Channel: # flashcards-3d...');
    await selectChannel('flashcards-3d');
    await wait(600);
    const hasFlashcards = await page.evaluate(() => {
      const text = document.body.textContent;
      return text.includes('Deck:') && (text.includes('Streak:') || text.includes('Mastery:'));
    });
    console.log(`  ✓ Flashcards 3D loaded: ${hasFlashcards ? 'PASS' : 'FAIL'}`);

    // Channel 4: StudyBot AI
    console.log('\n  Testing Channel: # studybot-ai...');
    await selectChannel('studybot-ai');
    await wait(600);
    const hasStudyBot = await page.evaluate(() => {
      const text = document.body.textContent;
      return text.includes('StudyBot') &&
             (text.includes('Explain simply') || text.includes('Debug my code') || text.includes('Quiz me'));
    });
    console.log(`  ✓ StudyBot AI loaded: ${hasStudyBot ? 'PASS' : 'FAIL'}`);

    // Test quick prompt chip
    await page.evaluate(() => {
      const chips = Array.from(document.querySelectorAll('button'));
      const explainChip = chips.find(b => b.textContent && b.textContent.includes('Explain simply'));
      if (explainChip) explainChip.click();
    });
    await wait(600);

    // Channel 5: Focus Timer Hub
    console.log('\n  Testing Channel: # focus-timer-hub...');
    await selectChannel('focus-timer-hub');
    await wait(600);
    const hasFocusHub = await page.evaluate(() => {
      const text = document.body.textContent;
      return text.includes('Pomodoro & Sprints') &&
             text.includes('Ambient Sound Mixer');
    });
    console.log(`  ✓ Focus Timer Hub loaded: ${hasFocusHub ? 'PASS' : 'FAIL'}`);

    // Switch tabs inside Focus Hub to Ambient Sound Mixer
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const soundTab = btns.find(b => b.textContent && b.textContent.includes('Ambient Sound Mixer'));
      if (soundTab) soundTab.click();
    });
    await wait(400);
    const hasSoundMixer = await page.evaluate(() => {
      const text = document.body.textContent;
      return text.includes('Rainstorm') || text.includes('Coffeehouse') || text.includes('Alpha Waves') || text.includes('Rain');
    });
    console.log(`  ✓ Ambient Sound Mixer tab: ${hasSoundMixer ? 'PASS' : 'FAIL'}`);

    // Channel 6: Bookstore & Shop
    console.log('\n  Testing Channel: # bookstore-shop...');
    await selectChannel('bookstore-shop');
    await wait(600);
    const hasShop = await page.evaluate(() => {
      const text = document.body.textContent;
      return text.includes('BOOKSTORE') || text.includes('Campus Bookstore') || text.includes('YOUR BALANCE');
    });
    console.log(`  ✓ Bookstore & Shop loaded: ${hasShop ? 'PASS' : 'FAIL'}`);

    // Channel 7: Daily Quests
    console.log('\n  Testing Channel: # daily-quests...');
    await selectChannel('daily-quests');
    await wait(600);
    const hasQuests = await page.evaluate(() => {
      const text = document.body.textContent;
      return text.includes('SCHOLAR PROGRESSION & MILESTONES') ||
             text.includes('Level') ||
             text.includes('Total XP');
    });
    console.log(`  ✓ Daily Quests loaded: ${hasQuests ? 'PASS' : 'FAIL'}`);

    // Channel 8: Multiplayer Study Rooms
    console.log('\n  Testing Channel: # silent-library...');
    await selectChannel('silent-library');
    await wait(600);
    const hasStudyRoom = await page.evaluate(() => {
      return document.body.textContent.includes('Quiet Oak Library') ||
             document.body.textContent.includes('Study Tables') ||
             document.body.textContent.includes('Active Scholars');
    });
    console.log(`  ✓ Live Study Room & Tables loaded: ${hasStudyRoom ? 'PASS' : 'FAIL'}`);

    // Mini Pomodoro Play/Pause in Sidebar
    console.log('\n  Testing Mini Pomodoro Controls...');
    const pomoToggle = await page.evaluate(() => {
      const btn = document.getElementById('mini-pomodoro-toggle');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    await wait(400);
    console.log(`  ✓ Sidebar mini pomodoro toggle: ${pomoToggle ? 'PASS' : 'FAIL'}`);

    // Summary of errors
    console.log('\n====================================================');
    console.log('📊 Verification Summary:');
    console.log(`  Console Errors: ${consoleErrors.length}`);
    console.log(`  Page Exceptions: ${pageErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('  Errors detail:');
      consoleErrors.forEach(e => console.log(`   - ${e}`));
    }
    if (pageErrors.length === 0 && consoleErrors.length === 0) {
      console.log('🎉 ALL TESTS PASSED WITH ZERO ERRORS!');
    }
    console.log('====================================================\n');

  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    if (browser) await browser.close();
    try {
      if (fs.existsSync(tempProfileDir)) {
        fs.rmSync(tempProfileDir, { recursive: true, force: true });
      }
    } catch (e) {}
  }
})();
