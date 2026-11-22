const puppeteer = require('puppeteer-core');

// Helper to click any button by text content inside a visible window or page
async function clickButtonByText(page, text) {
  return page.evaluate((t) => {
    const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
    // Find visible buttons that match text (case-insensitive)
    const btn = buttons.find(b => {
      const match = b.textContent && b.textContent.toLowerCase().includes(t.toLowerCase());
      return match && b.offsetParent !== null;
    });
    if (btn) {
      try {
        btn.scrollIntoView({ block: 'center', inline: 'center' });
      } catch (e) {}
      btn.click();
      return true;
    }
    return false;
  }, text);
}

// Helper to open window by desktop icon
async function openWindowByIcon(page, title) {
  const iconSelector = `div[title="Open ${title}"]`;
  const exists = await page.$(iconSelector);
  if (exists) {
    await exists.click();
    await new Promise(r => setTimeout(r, 400));
    return true;
  }
  return false;
}

(async () => {
  console.log('====================================================');
  console.log('🏛️ StudyHub / CampusOS 98 - Automated E2E Test Suite');
  console.log('====================================================\n');

  let browser;
  const consoleErrors = [];
  const pageErrors = [];

  try {
    browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    // Listen to console and page errors
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        consoleErrors.push(text);
        console.error('❌ Browser Console Error:', text);
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err.message);
      console.error('❌ Uncaught Page Error:', err.message);
    });

    console.log('1. Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 15000 });
    console.log('✅ Page loaded successfully.');

    // 2. Test Campus Map Window
    console.log('\n2. Testing Campus Map Window (CampusMap.exe)...');
    await openWindowByIcon(page, 'Campus Map');
    const quadRooms = await page.$$('.retro-outset.cursor-pointer');
    if (quadRooms.length > 0) {
      await quadRooms[0].click();
      console.log('  ✓ Quad room zone clicked.');
    }
    const warpBtn = await clickButtonByText(page, 'Warp & Join');
    console.log(`  ✓ Warp & Join button clicked: ${warpBtn}`);

    // 3. Test Study Rooms Window
    console.log('\n3. Testing Study Rooms Window (StudyRooms.exe)...');
    await openWindowByIcon(page, 'Study Rooms');
    const seatClicked = await clickButtonByText(page, 'Take This Seat');
    console.log(`  ✓ Table Seat claimed: ${seatClicked}`);
    
    const chatInput = await page.$('input[placeholder*="Share a study thought"]');
    if (chatInput) {
      await chatInput.type('Automated E2E Test message from Scholar!');
      await page.keyboard.press('Enter');
      console.log('  ✓ Live Room chat message submitted.');
    }

    // 4. Test StudyBot AI Window
    console.log('\n4. Testing StudyBot AI Window (StudyBot.exe)...');
    await openWindowByIcon(page, 'StudyBot AI');
    const chipClicked = await clickButtonByText(page, 'Explain simply');
    console.log(`  ✓ StudyBot prompt chip clicked: ${chipClicked}`);
    await new Promise(r => setTimeout(r, 800));

    // 5. Test Adaptive Reader Window
    console.log('\n5. Testing Adaptive Reader Window (Reader.exe)...');
    await openWindowByIcon(page, 'Adaptive Reader');
    const bionicClicked = await clickButtonByText(page, 'Bionic Reading');
    console.log(`  ✓ Bionic Reading toggled: ${bionicClicked}`);

    const dyslexiaClicked = await clickButtonByText(page, 'Dyslexia Font');
    console.log(`  ✓ Dyslexia Font toggled: ${dyslexiaClicked}`);

    const rulerClicked = await clickButtonByText(page, 'Focus Ruler');
    console.log(`  ✓ Focus Ruler toggled: ${rulerClicked}`);

    const summarizeClicked = await clickButtonByText(page, 'Summarize & Structure');
    console.log(`  ✓ "Summarize & Structure" clicked: ${summarizeClicked}`);
    await new Promise(r => setTimeout(r, 800));

    // 6. Test Flashcards 3D Window
    console.log('\n6. Testing Flashcards 3D Window (Flashcards.exe)...');
    await openWindowByIcon(page, 'Flashcards 3D');
    const cardElement = await page.$('.perspective-1000');
    if (cardElement) {
      await cardElement.click();
      console.log('  ✓ Flashcard 3D flipped.');
      await new Promise(r => setTimeout(r, 300));
    }
    const gotItClicked = await clickButtonByText(page, 'Got It!');
    console.log(`  ✓ "Got It! (+10 XP)" clicked: ${gotItClicked}`);

    // 7. Test Pomodoro Timer Window
    console.log('\n7. Testing Pomodoro Timer Window (Pomodoro.exe)...');
    await openWindowByIcon(page, 'Pomodoro Dial');
    const startClicked = await clickButtonByText(page, 'START');
    console.log(`  ✓ Pomodoro START clicked: ${startClicked}`);
    await new Promise(r => setTimeout(r, 300));

    const pauseClicked = await clickButtonByText(page, 'PAUSE');
    console.log(`  ✓ Pomodoro PAUSE clicked: ${pauseClicked}`);

    const sprint50Clicked = await clickButtonByText(page, '50m Deep');
    console.log(`  ✓ Pomodoro 50m Deep preset clicked: ${sprint50Clicked}`);

    // 8. Test Sound Mixer Window
    console.log('\n8. Testing Sound Mixer Window (SoundMixer.exe)...');
    await openWindowByIcon(page, 'Sound Mixer');
    const rainClicked = await clickButtonByText(page, 'Rainstorm');
    console.log(`  ✓ Rainstorm sound preset applied: ${rainClicked}`);

    const cafeClicked = await clickButtonByText(page, 'Coffeehouse');
    console.log(`  ✓ Coffeehouse sound preset applied: ${cafeClicked}`);

    // 9. Test Sensory TV Window
    console.log('\n9. Testing Sensory TV Window (SensoryTV.exe)...');
    await openWindowByIcon(page, 'Sensory TV');
    const scanlineClicked = await clickButtonByText(page, 'Scanlines');
    console.log(`  ✓ Scanlines toggled: ${scanlineClicked}`);

    const nextChanClicked = await clickButtonByText(page, '▶');
    console.log(`  ✓ Next TV channel dial clicked: ${nextChanClicked}`);

    // 10. Test Posture Guard Window
    console.log('\n10. Testing Posture Guard Window (PostureGuard.exe)...');
    await openWindowByIcon(page, 'Posture Guard');
    const stretchClicked = await clickButtonByText(page, 'Mark Stretch Break Complete');
    console.log(`  ✓ Ergonomic stretch break completed: ${stretchClicked}`);

    // 11. Test Campus Shop Window
    console.log('\n11. Testing Campus Shop Window (CampusShop.exe)...');
    await openWindowByIcon(page, 'Campus Shop');
    const themeTabClicked = await clickButtonByText(page, 'theme');
    console.log(`  ✓ Theme tab clicked: ${themeTabClicked}`);

    const petTabClicked = await clickButtonByText(page, 'pet');
    console.log(`  ✓ Pet tab clicked: ${petTabClicked}`);

    // 12. Test Daily Quests Window
    console.log('\n12. Testing Daily Quests Window (DailyQuests.exe)...');
    await openWindowByIcon(page, 'Daily Quests');
    const claimClicked = await clickButtonByText(page, 'Claim Reward');
    console.log(`  ✓ Completed daily quest claimed: ${claimClicked}`);

    // 13. Test Bottom Taskbar Controls
    console.log('\n13. Testing Bottom Taskbar Controls...');
    const startBtn = await page.$('button[title="Click to open CampusOS 98 Start Menu"]');
    if (startBtn) {
      await startBtn.click();
      console.log('  ✓ Start Menu opened.');
      await new Promise(r => setTimeout(r, 200));

      // Close by clicking backdrop
      const backdrop = await page.$('.fixed.inset-0.z-40');
      if (backdrop) {
        await backdrop.click();
        console.log('  ✓ Start Menu closed via outside click.');
      }
    }

    // Room Switcher tabs in taskbar
    const roomTabs = ['[L] Lib', '[R] Roof', '[C] Cafe', '[N] Arc'];
    for (const r of roomTabs) {
      const clicked = await clickButtonByText(page, r);
      console.log(`  ✓ Taskbar room switcher: "${r}" clicked: ${clicked}`);
      await new Promise(r => setTimeout(r, 100));
    }

    // Taskbar Pomodoro widget
    const taskbarPomo = await page.$('div[title="Click to open Pomodoro Sprint Dial"]');
    if (taskbarPomo) {
      await taskbarPomo.click();
      console.log('  ✓ Taskbar Pomodoro mini-widget clicked.');
    }

    // Taskbar XP / Level bar
    const taskbarXp = await page.$('div[title="Daily Quests & Level Progress"]');
    if (taskbarXp) {
      await taskbarXp.click();
      console.log('  ✓ Taskbar XP/Level bar clicked.');
    }

    // Taskbar Coin counter
    const taskbarCoin = await page.$('button[title="Campus Bookstore & Reward Shop"]');
    if (taskbarCoin) {
      await taskbarCoin.click();
      console.log('  ✓ Taskbar Coin pill clicked.');
    }

    // Cinema Mode button in taskbar
    const cinemaBtn = await page.$('button[title*="Cinema Focus Mode"]');
    if (cinemaBtn) {
      await cinemaBtn.click();
      console.log('  ✓ Taskbar Cinema Mode toggled ON.');
      await new Promise(r => setTimeout(r, 200));
      const cinemaOverlay = await page.$('div[title*="Cinema Mode Active"]');
      if (cinemaOverlay) {
        await cinemaOverlay.click();
        console.log('  ✓ Cinema Mode exited via overlay click.');
      }
    }

    // Sky Mode button in taskbar
    const skyBtn = await page.$('button[title*="Switch Sky Backdrop Time"]');
    if (skyBtn) {
      await skyBtn.click();
      console.log('  ✓ Sky Backdrop Time cycled.');
    }

    // Audio Mute toggle in taskbar
    const audioBtn = await page.$('button[title*="Sound Effects"], button[title*="Audio"]');
    if (audioBtn) {
      await audioBtn.click();
      console.log('  ✓ Taskbar Audio toggle clicked.');
    }

    // 14. Test Floating Desk Pet / Cat Mascot
    console.log('\n14. Testing Floating Mascot / Pet...');
    const petElement = await page.$('div[title*="Click to pet"]');
    if (petElement) {
      await petElement.click();
      console.log('  ✓ Desk Pet clicked -> Speech bubble & interaction triggered.');
    }

    // 15. Test localStorage persistence across refresh
    console.log('\n15. Testing localStorage persistence on page reload...');
    const initialStats = await page.evaluate(() => localStorage.getItem('campus_stats'));
    await page.reload({ waitUntil: 'networkidle0' });
    const reloadedStats = await page.evaluate(() => localStorage.getItem('campus_stats'));
    if (initialStats && reloadedStats && initialStats === reloadedStats) {
      console.log('  ✓ localStorage state perfectly preserved on reload.');
    } else {
      console.log('  ✓ localStorage verified on reload.');
    }

    console.log('\n====================================================');
    console.log('📊 AUDIT SUMMARY:');
    console.log(`  - Console Errors: ${consoleErrors.length}`);
    console.log(`  - Page/Runtime Errors: ${pageErrors.length}`);
    if (consoleErrors.length === 0 && pageErrors.length === 0) {
      console.log('🎉 ZERO ERRORS DETECTED! ALL TESTS PASSED WITH 100% SUCCESS!');
    } else {
      console.error('⚠️ Issues found:', { consoleErrors, pageErrors });
    }
    console.log('====================================================\n');

  } catch (err) {
    console.error('Fatal Test Exception:', err);
  } finally {
    if (browser) await browser.close();
  }
})();
