"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Internal tests for the `MockLocalHomePlatform`'s Identify functionality.
 */
/// <reference types="@google/local-home-sdk" />
const ava_1 = __importDefault(require("ava"));
const src_1 = require("../../src");
const test_platform_fixtures_1 = require("./test-platform-fixtures");
const fixtures_1 = require("../example/fixtures");
const DISCOVERY_BUFFER = Buffer.from('discovery buffer 123');
const APP_VERSION = '0.0.1';
const DEVICE_ID = 'device-id-123';
const IDENTIFY_REQUEST_ID = 'identify-request-id';
/**
 * Tests that `listen()` was called on the created App.
 * This is a required flag that indicates handlers have been set.
 */
ava_1.default('trigger-identify-without-listen-throws', async (t) => {
    const app = new smarthome.App(APP_VERSION);
    await t.throws(() => {
        src_1.extractStubs(app);
    }, {
        instanceOf: Error,
        message: src_1.ERROR_HANDLERS_NOT_SET,
    });
});
/**
 * Tests that the returned `IdentifyResponse` contains a verificationId.
 */
ava_1.default('trigger-identify-with-undefined-verificationId-throws', async (t) => {
    const app = new smarthome.App(APP_VERSION);
    const deviceManager = app.getDeviceManager();
    const executeHandler = fixtures_1.createExecuteHandler(fixtures_1.createUdpDeviceCommand(Buffer.from('execute-buffer'), 'execute-request-id', DEVICE_ID, 12345), deviceManager);
    const invalidIdentifyHandler = () => {
        return {
            requestId: 'request-id',
            intent: smarthome.Intents.IDENTIFY,
            payload: {
                device: {
                    id: DEVICE_ID,
                },
            },
        };
    };
    app.onIdentify(invalidIdentifyHandler).onExecute(executeHandler).listen();
    const { mockLocalHomePlatform } = src_1.extractStubs(app);
    await t.throwsAsync(mockLocalHomePlatform.triggerIdentify(IDENTIFY_REQUEST_ID, DISCOVERY_BUFFER), {
        instanceOf: Error,
        message: src_1.ERROR_UNDEFINED_VERIFICATIONID,
    });
});
/**
 * Tests `triggerIdentify()` when all requirements are met.
 */
ava_1.default('trigger-identify-with-valid-state', async (t) => {
    const discoveryBuffer = Buffer.from('discovery buffer 123');
    const localDeviceId = 'local-device-id-123';
    const app = new smarthome.App(APP_VERSION);
    const deviceManager = app.getDeviceManager();
    const validIdentifyHandler = test_platform_fixtures_1.createIdentifyHandler(DEVICE_ID, localDeviceId);
    const validExecuteHandler = fixtures_1.createExecuteHandler(fixtures_1.createUdpDeviceCommand(Buffer.from('execute-buffer'), 'execute-request-id', DEVICE_ID, 12345), deviceManager);
    app.onIdentify(validIdentifyHandler).onExecute(validExecuteHandler).listen();
    const { mockLocalHomePlatform } = src_1.extractStubs(app);
    await t.notThrowsAsync(async () => {
        const verificationId = await mockLocalHomePlatform.triggerIdentify(IDENTIFY_REQUEST_ID, discoveryBuffer);
        t.is(verificationId, localDeviceId);
    });
    t.notThrows(() => {
        t.is(mockLocalHomePlatform.isDeviceIdRegistered(DEVICE_ID), true);
    });
    t.notThrows(() => {
        t.is(mockLocalHomePlatform.getLocalDeviceId(DEVICE_ID), localDeviceId);
    });
});
//# sourceMappingURL=test-platform-identify.js.map