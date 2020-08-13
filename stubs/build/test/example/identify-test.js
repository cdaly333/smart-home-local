"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Example tests against a fulfillment's `identifyHandler`.
 */
/// <reference types="@google/local-home-sdk" />
/// <reference types="@types/node" />
const ava_1 = __importDefault(require("ava"));
const src_1 = require("../../src");
const fixtures_1 = require("./fixtures");
const DEVICE_ID = 'device-id-123';
const LOCAL_DEVICE_ID = 'local-device-id-123';
/**
 * Tests that the identify handler correctly registers
 * the device ID and local device ID.
 */
ava_1.default('identify-handler-registers-local-id', async (t) => {
    // Create the App to test against.
    const app = new smarthome.App('0.0.1');
    const executeHandler = (executeRequest) => {
        return new smarthome.Execute.Response.Builder()
            .setRequestId(executeRequest.requestId)
            .setSuccessState(DEVICE_ID, {})
            .build();
    };
    // Set the Identify and Execute intent fulfillment handlers.
    await app.onIdentify(fixtures_1.identifyHandler).onExecute(executeHandler).listen();
    // Obtain the Mock Local Home Platform from the App stub.
    const { mockLocalHomePlatform } = src_1.extractStubs(app);
    // The scan data that a local device sends to the Nest device.
    const discoveryBuffer = Buffer.from(
    // Arbitrary scan data containing the local device ID.
    JSON.stringify({
        localDeviceId: LOCAL_DEVICE_ID,
    }));
    // Trigger an Identify intent from the platformn.
    await t.notThrowsAsync(async () => {
        t.is(await mockLocalHomePlatform.triggerIdentify('identify-request-id', discoveryBuffer, DEVICE_ID), LOCAL_DEVICE_ID);
    });
    /**
     * Assert that our identify handler returned the localDeviceId
     * and registered correctly in the platform.
     */
    t.is(mockLocalHomePlatform.isDeviceIdRegistered(DEVICE_ID), true);
    t.is(mockLocalHomePlatform.getLocalDeviceId(DEVICE_ID), LOCAL_DEVICE_ID);
});
//# sourceMappingURL=identify-test.js.map