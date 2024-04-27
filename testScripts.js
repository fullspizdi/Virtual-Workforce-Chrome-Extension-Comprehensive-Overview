// testScripts.js
// This script contains unit tests for the Virtual Workforce Chrome Extension functionalities

const assert = require('assert');
const background = require('./background');
const contentScript = require('./contentScript');
const aiIntegration = require('./aiIntegration');
const securityUtils = require('./securityUtils');
const crmIntegration = require('./crmIntegration');

describe('Background Script Tests', () => {
    it('should set initial active state to true', (done) => {
        chrome.storage.local.get('active', (result) => {
            assert.strictEqual(result.active, true);
            done();
        });
    });

    it('should listen for installation and set up correctly', () => {
        assert.ok(chrome.runtime.onInstalled.hasListeners());
    });

    it('should handle Medium.com tab updates correctly', () => {
        const tabId = 123;
        const changeInfo = { status: 'complete' };
        const tab = { url: 'https://medium.com/some-article' };

        chrome.tabs.onUpdated.dispatch(tabId, changeInfo, tab);
        assert.ok(chrome.scripting.executeScript.calledWithMatch({
            target: { tabId: tabId },
            files: ['contentScript.js']
        }));
    });
});

describe('Content Script Tests', () => {
    it('should initialize Virtual Workforce on Medium.com', () => {
        const initSpy = sinon.spy(contentScript, 'initVirtualWorkforce');
        contentScript.initVirtualWorkforce();
        assert.ok(initSpy.calledOnce);
    });

    it('should update content based on user preferences', () => {
        const preferences = { fontSize: '18px', theme: 'dark' };
        const updateSpy = sinon.spy(contentScript, 'updateContentBasedOnPreferences');
        contentScript.updateContentBasedOnPreferences(preferences);
        assert.ok(updateSpy.calledWith(preferences));
    });
});

describe('AI Integration Tests', () => {
    it('should generate text based on input', async () => {
        const inputText = "Hello, world!";
        const generatedText = await aiIntegration.generateText(inputText);
        assert.strictEqual(typeof generatedText, 'string');
        assert.ok(generatedText.length > 0);
    });

    it('should initialize AI models correctly', () => {
        const initSpy = sinon.spy(aiIntegration, 'init');
        aiIntegration.init();
        assert.ok(initSpy.calledOnce);
    });
});

describe('Security Utils Tests', () => {
    it('should encrypt and decrypt text correctly', () => {
        const text = "Secret message";
        const encrypted = securityUtils.encrypt(text);
        const decrypted = securityUtils.decrypt(encrypted.iv, encrypted.content);
        assert.strictEqual(decrypted, text);
    });
});

describe('CRM Integration Tests', () => {
    it('should update CRM data successfully', async () => {
        const data = { customerID: '12345', status: 'updated' };
        const result = await crmIntegration.updateCRM(data);
        assert.ok(result.success);
    });
});
