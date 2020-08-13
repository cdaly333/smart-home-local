"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockDeviceManager = exports.ERROR_PENDING_REQUEST_MISMATCH = exports.ERROR_UNEXPECTED_COMMAND_REQUEST = void 0;
/**
 * Interactive stub for the smarthome.DeviceManager class.
 **/
/// <reference types="@google/local-home-sdk" />
exports.ERROR_UNEXPECTED_COMMAND_REQUEST = 'Unable to process unexpected CommandRequest';
exports.ERROR_PENDING_REQUEST_MISMATCH = 'The pending request did not match the expected value';
class MockDeviceManager {
    constructor() {
        /** Map of each expected `CommandRequest` to its associated response.*/
        this.expectedCommandToResponse = new Map();
        this.commandRequestsSent = new Set();
    }
    getCommandsSent() {
        return this.commandRequestsSent;
    }
    clearCommandsSent() {
        this.commandRequestsSent.clear();
    }
    wasCommandSent(commandRequest) {
        return this.commandRequestsSent.has(commandRequest);
    }
    /**
     * Checks if the next request marked pending matches a given request.
     * @param requestToMatch  A request to compare with the next pending request.
     * @returns  Promise that resolves to true if the requests matched.
     *     If the next pending request doesn't match, the promise will reject.
     */
    doesNextPendingRequestMatch(requestToMatch) {
        return new Promise((resolve, reject) => {
            this.markPendingAction = (pendingRequest) => {
                if (pendingRequest === requestToMatch) {
                    resolve(true);
                }
                reject(new Error(exports.ERROR_PENDING_REQUEST_MISMATCH));
            };
        });
    }
    /**
     * Registers both a command that will be checked against on `send()`, and
     * a corresponding response that will be returned from `send()` on a match.
     * @param expectedCommand  The command to check against incoming commands.
     * @param response  The response to send when an incoming command matches.
     */
    addExpectedCommand(expectedCommand, response) {
        this.expectedCommandToResponse.set(expectedCommand, response);
    }
    /**
     * Marks a request as pending, conceptually indicating to the platform
     * that the actual operation is still not done.
     * Passes the request to `markPendingAction`
     * @param request  The request to pass into `markPendingAction`
     */
    markPending(request) {
        if (this.markPendingAction !== undefined) {
            this.markPendingAction(request);
        }
        return Promise.resolve();
    }
    getProxyInfo(id) {
        //TODO(cjdaly) implementation
        throw new Error('Method not implemented.');
    }
    /**
     * Checks if a given command is registered as an expected command.
     * If a match happens, the associated response is returned.
     * @param command  The command to send and check against expected commands.
     * @returns  Promise that resolves to the expected command's response,
     *     otherwise a `HandlerError`.
     */
    send(command) {
        this.commandRequestsSent.add(command);
        if (this.expectedCommandToResponse.has(command)) {
            return Promise.resolve(this.expectedCommandToResponse.get(command));
        }
        // If `DeviceManager` was not expecting this command, throw a `HandlerError`.
        throw new smarthome.IntentFlow.HandlerError(command.requestId, exports.ERROR_UNEXPECTED_COMMAND_REQUEST);
    }
}
exports.MockDeviceManager = MockDeviceManager;
//# sourceMappingURL=mock-device-manager.js.map