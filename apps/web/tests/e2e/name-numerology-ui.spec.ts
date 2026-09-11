import { test, expect } from '@playwright/test';

test.describe('Profile Name & Name-Based Numerology E2E Tests', () => {
  test('renders full name input, allows optional calculation without name, and calculates name numerology when name is provided', async ({ page }) => {
    // Intercept /api/calculate to return mock response matching full component expectations
    await page.route('**/api/calculate', async (route) => {
      const request = route.request();
      const body = JSON.parse(request.postData() || '{}');
      const fullName = body.fullName;

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {
          success: true,
          data: {
            astrology: {
              calculationProfile: {
                name: 'Personal Vedic V1',
                version: '1.0',
                zodiac: 'sidereal',
                ayanamsa: 'lahiri',
                nodeType: 'mean',
              },
              ayanamsaValue: 23.85,
              lagna: { sign: { name: 'Aries' }, formattedDegree: "15° 00'", nakshatra: { name: 'Ashwini', pada: 1 } },
              moonSign: { name: 'Taurus', sanskritName: 'Vrishabha' },
              birthNakshatra: { name: 'Krittika', pada: 2 },
              ascendant: { name: 'Aries', degree: 15, nakshatra: { name: 'Ashwini', pada: 1 } },
              planets: [
                { name: 'Sun', planet: 'Sun', sign: { name: 'Aries', sanskritName: 'Mesha', lord: 'Mars' }, house: 1, longitude: 10, degree: 10, formattedDegree: "10° 00'", isRetrograde: false, isCombust: false, nakshatra: { name: 'Ashwini', pada: 1 } },
                { name: 'Moon', planet: 'Moon', sign: { name: 'Taurus', sanskritName: 'Vrishabha', lord: 'Venus' }, house: 2, longitude: 40, degree: 10, formattedDegree: "10° 00'", isRetrograde: false, isCombust: false, nakshatra: { name: 'Krittika', pada: 2 } },
              ],
            },
            analysis: { yogas: [] },
            divisionalCharts: { d9: {}, d10: {} },
            strengthAnalysis: {
              planets: [
                {
                  planet: 'Sun',
                  score: 75,
                  overallStrength: 'STRONG',
                  d1Dignity: 'Exalted',
                  d9Dignity: 'Own',
                  house: 1,
                  houseCategories: ['Kendra'],
                  isVargottama: false,
                  isCombust: false,
                  isRetrograde: false,
                  whyEvidence: ['Exalted in D1'],
                },
              ],
            },
            shadbala: {
              profileVersion: 'personal-shadbala-v1',
              completeness: 'PARTIAL',
              status: 'FOUNDATION / PARTIAL IMPLEMENTATION',
              planets: [],
              validation: {
                benchmarkStatus: 'NOT_VALIDATED',
                methodologyStatus: {},
              },
            },
            vargaComparison: { items: [] },
            dashamsaComparison: { items: [] },
            crossChartAnalysis: { career: { items: [] } },
            ashtakavarga: { bav: {}, sav: {} },
            transitAshtakavarga: { evidenceMap: {} },
            rules: { summary: [], detailed: [] },
            timing: { currentWindow: {} },
            interpretation: { overview: '', coreThemes: [] },
            dasha: { balance: {}, mahadashas: [], current: {} },
            numerology: {
              lifePath: { title: 'Life Path Number', finalNumber: 7, isMasterNumber: false, formulaSteps: [{ stepNumber: 1, description: 'Sum', expression: '7 = 7', result: 7 }] },
              birthday: { title: 'Birthday Number', finalNumber: 5, isMasterNumber: false, formulaSteps: [{ stepNumber: 1, description: 'Sum', expression: '5 = 5', result: 5 }] },
              attitude: { title: 'Attitude Number', finalNumber: 3, isMasterNumber: false, formulaSteps: [{ stepNumber: 1, description: 'Sum', expression: '3 = 3', result: 3 }] },
              personalYear: { title: 'Personal Year', finalNumber: 9, isMasterNumber: false, formulaSteps: [{ stepNumber: 1, description: 'Sum', expression: '9 = 9', result: 9 }] },
              personalMonth: { title: 'Personal Month', finalNumber: 4, isMasterNumber: false, formulaSteps: [{ stepNumber: 1, description: 'Sum', expression: '4 = 4', result: 4 }] },
              personalDay: { title: 'Personal Day', finalNumber: 1, isMasterNumber: false, formulaSteps: [{ stepNumber: 1, description: 'Sum', expression: '1 = 1', result: 1 }] },
              nameAnalysis: fullName
                ? {
                    fullName,
                    normalizedName: 'RAKSHITJAIN',
                    profileVersion: 'personal-numerology-v1',
                    system: 'PYTHAGOREAN',
                    expressionNumber: {
                      title: 'Expression Number (Destiny Number)',
                      finalNumber: 3,
                      rawSum: 48,
                      isMasterNumber: false,
                      includedLetters: ['R', 'A', 'K', 'S', 'H', 'I', 'T', 'J', 'A', 'I', 'N'],
                      formulaSteps: [
                        { stepNumber: 1, description: 'Sum of all letters', expression: '9+1+2+1+8+9+2+1+1+9+5 = 48', result: 48 },
                        { stepNumber: 2, description: 'Reduction', expression: '4+8 = 12', result: 12 },
                        { stepNumber: 3, description: 'Final Reduction', expression: '1+2 = 3', result: 3 },
                      ],
                    },
                    soulUrgeNumber: {
                      title: "Soul Urge Number (Heart's Desire)",
                      finalNumber: 2,
                      rawSum: 20,
                      isMasterNumber: false,
                      includedLetters: ['A', 'I', 'A', 'I'],
                      formulaSteps: [{ stepNumber: 1, description: 'Sum of vowels', expression: '1+9+1+9 = 20', result: 20 }],
                    },
                    personalityNumber: {
                      title: 'Personality Number',
                      finalNumber: 1,
                      rawSum: 28,
                      isMasterNumber: false,
                      includedLetters: ['R', 'K', 'S', 'H', 'T', 'J', 'N'],
                      formulaSteps: [{ stepNumber: 1, description: 'Sum of consonants', expression: '9+2+1+8+2+1+5 = 28', result: 28 }],
                    },
                  }
                : null,
            },
            audit: { inputFingerprint: 'test', reproducibilityHash: 'test' },
          },
        },
      });
    });

    await page.goto('http://localhost:3000');

    // 1. Verify Full Name input field exists
    const nameInput = page.locator('#full-name-input');
    await expect(nameInput).toBeVisible();

    // 2. Submit WITHOUT full name
    const calcBtn = page.locator('#calculate-btn');
    const responsePromise1 = page.waitForResponse('**/api/calculate');
    await calcBtn.click();
    await responsePromise1;

    // Switch to Numerology tab
    const tabNum = page.locator('#tab-numerology');
    await expect(tabNum).toBeVisible({ timeout: 5000 });
    await tabNum.click();

    // Verify notice for no name
    const noNameNotice = page.locator('#no-name-notice');
    await expect(noNameNotice).toBeVisible();
    await expect(noNameNotice).toContainText('Enter a full name to calculate name-based numerology');

    // 3. Fill name and submit
    await nameInput.fill('Rakshit Jain');
    const responsePromise2 = page.waitForResponse('**/api/calculate');
    await calcBtn.click();
    await responsePromise2;

    // Switch to Numerology tab again
    await tabNum.click();

    // Verify name-numerology results section is visible
    const nameResults = page.locator('#name-numerology-results');
    await expect(nameResults).toBeVisible();
    await expect(nameResults).toContainText('Rakshit Jain');
    await expect(nameResults).toContainText('RAKSHITJAIN');
    await expect(nameResults).toContainText('Expression Number');
    await expect(nameResults).toContainText('Soul Urge Number');
    await expect(nameResults).toContainText('Personality Number');
  });
});
