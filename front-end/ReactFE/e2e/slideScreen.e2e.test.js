import { expect } from 'detox';
const mockSurveyData = [
  {
      id: '0',
      title: 'Quarter 1 survey',
      questionHeader:"Echinococcus spp. (multilocularis, granulosus)",
      question: "Zoonotic Pathogens of interest: Echinococcus spp. (multilocularis, granulosus) A" +
              "ny urban, rural or free- roaming dog residing in the provinces of BC, AB, SK, or" +
              " MB with a positive fecal coproantigen ELISA or PCR test result for Echinococcus" +
              " multilocularis or E. granulosus regardless of clinical signs."
  }, {
      id: '1',
      title: 'Quarter 1 survey',
      questionHeader:"MRSA/MRSP",
      question: 'MRSA/MRSP Any urban, rural or free-roaming dog residing in the provinces of BC, ' +
              'AB, SK, or MB with a positive MRSA/MRSP result on culture and sensitivity testin' +
              'g with resistance to one or more antibiotic(s) regardless of clinical signs.'

  }, {
      id: '2',
      title: 'Quarter 1 survey',
      questionHeader:"Enteric pathogens (Salmonella spp. Campylobacter spp. E.coli)",
      question: 'Enteric pathogens (Salmonella spp. Campylobacter spp. E.coli) Any urban, rural o' +
              'r free-roaming dog residing in the provinces of BC, AB, SK, or MB and a positive' +
              ' PCR test or fecal culture for Salmonella spp. Campylobacter spp., and/or E.coli' +
              ' regardless of clinical signs.'
  }, {
      id: '3',
      title: 'Quarter 1 survey',
      questionHeader:"Lyme disease or other vector-borne diseases",
      question: 'Lyme disease or other vector-borne diseases Any urban, rural or free-roaming dog' +
              ' residing in the provinces of BC, AB, SK, or MB with a positive in- clinic 40x S' +
              'NAP test or laboratory confirmed positive for Lyme disease (Borrelia burgdorfer)' +
              ' or other vector-bome diseases (e. Anaplasma, Erichia, etc) regardless of clinic' +
              'al signs.'
  }, {
      id: '4',
      title: 'Quarter 1 survey',
      questionHeader:"Brucella canis",
      question: 'Brucella canis Any urban, rural or free-roaming dog residing in the provinces of' +
              ' BC, AB, SK, or MB that is serological positive using RSAT and/or ACID, or isola' +
              'tion of the pathogen regardless of clinical signs.'
  }
];
describe("Side-screen scroller test", () => {
    beforeAll(async () => {
      await device.launchApp();
    });
  
    beforeEach(async () => {
      await device.reloadReactNative();
    });

  
      it('Stack Screen for survey needs to appear after it clicked', async () => {
        await element(by.id('menuButton')).tap();
        await element(by.text('Survey')).tap();
        await element(by.id("TakeSurvey")).tap();

        await expect(element(by.id("surveyStartCard"))).toBeVisible();
        await expect(element(by.id("startSurvey"))).toBeVisible();
      });

      it('Stack Screen new Screen need to appear after it is slided left', async () => {
        await element(by.id('menuButton')).tap();
        await element(by.text('Survey')).tap();
        await element(by.id("TakeSurvey")).tap();
        await element(by.id("startSurvey")).tap();
        await expect(element(by.id("card0"))).toBeVisible()
        await element(by.id("card0")).swipe("left")
        await expect(element(by.id("questionHeader1"))).toBeVisible()
      });

      it('Stack Screen should have a checkbox for encoutering', async () => {
        await element(by.id('menuButton')).tap();
        await element(by.text('Survey')).tap();
        await element(by.id("TakeSurvey")).tap();
        await element(by.id("startSurvey")).tap();
        await element(by.id("card0")).swipe("left")
        await expect(element(by.id("questionHeader1"))).toBeVisible()
        await element(by.id("checkBox1")).tap()
        
      });

      it('Stack Screen should present new question if it is clicked', async () => {
        await element(by.id('menuButton')).tap();
        await element(by.text('Survey')).tap();
        await element(by.id("TakeSurvey")).tap();
        await element(by.id("startSurvey")).tap();
        await element(by.id("card0")).swipe("left")
        
        await element(by.id("checkBox1")).tap()
        await expect(element(by.id("encountered1"))).toBeVisible()
      });
  });
  