"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIdentifyHandler = void 0;
/**
 * Fixtures used across internal tests.
 */
/// <reference types="@google/local-home-sdk" />
/**
 * Creates a basic Identify handler that returns the specified
 * deviceId and verificationId.
 * @param deviceId  The `id` to include in the `IdentifyResponse`.
 * @param verificationId  The `verificationId` to return in the `IdentifyResponse`.
 */
function createIdentifyHandler(deviceId, verificationId) {
    return async (identifyRequest) => {
        return {
            requestId: identifyRequest.requestId,
            intent: smarthome.Intents.IDENTIFY,
            payload: {
                device: {
                    id: deviceId,
                    verificationId,
                },
            },
        };
    };
}
exports.createIdentifyHandler = createIdentifyHandler;
//# sourceMappingURL=test-platform-fixtures.js.map