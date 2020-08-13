"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tests the `AppStub` class.
 */
/// <reference types="@google/local-home-sdk" />
const ava_1 = __importDefault(require("ava"));
const src_1 = require("../../src");
const APP_VERSION = '0.0.1';
const IDENTIFY_HANDLER = () => {
    return {
        requestId: 'request-id',
        intent: smarthome.Intents.IDENTIFY,
        payload: {
            device: {
                id: 'device-id-222',
                verificationId: 'local-device-id-222',
            },
        },
    };
};
/**
 * Tests that a call to `listen()` without setting any required handlers fails.
 */
ava_1.default('listen-with-undefined-identify-throws', async (t) => {
    const app = new smarthome.App(APP_VERSION);
    await t.throwsAsync(async () => {
        await app.listen();
    }, {
        instanceOf: Error,
        message: src_1.ERROR_LISTEN_WITHOUT_IDENTIFY_HANDLER,
    });
});
/**
 * Tests that a call to `listen()` having only set the identify handler fails.
 */
ava_1.default('listen-with-undefined-execute-throws', async (t) => {
    const app = new smarthome.App(APP_VERSION);
    app.onIdentify(IDENTIFY_HANDLER);
    await t.throwsAsync(async () => {
        await app.listen();
    }, {
        instanceOf: Error,
        message: src_1.ERROR_LISTEN_WITHOUT_EXECUTE_HANDLER,
    });
});
/**
 * Tests that a call to `listen()` with Identify and Execute handlers
 * finishes without error.
 */
ava_1.default('listen-with-valid-handlers', async (t) => {
    const executeHandler = (executeRequest) => {
        return {
            requestId: executeRequest.requestId,
            intent: smarthome.Intents.IDENTIFY,
            payload: {
                commands: [
                    {
                        ids: ['123'],
                        status: 'SUCCESS',
                        states: {
                            on: true,
                            online: true,
                        },
                    },
                    {
                        ids: ['456'],
                        status: 'ERROR',
                        errorCode: 'deviceTurnedOff',
                    },
                ],
            },
        };
    };
    const app = new smarthome.App(APP_VERSION);
    app.onIdentify(IDENTIFY_HANDLER).onExecute(executeHandler);
    const error = await app.listen();
    t.is(error, undefined);
});
//# sourceMappingURL=test-smart-home-app.js.map