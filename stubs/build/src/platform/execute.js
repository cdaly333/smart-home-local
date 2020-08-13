"use strict";
/**
 * Stubs and helper functions for Execute functionality.
 */
/// <reference types="@google/local-home-sdk" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSimpleExecuteCommands = exports.ExecuteStub = void 0;
exports.ExecuteStub = {
    Response: {
        Builder: class {
            constructor() {
                this.requestId = '';
                this.commands = [];
            }
            setRequestId(requestId) {
                this.requestId = requestId;
                return this;
            }
            setSuccessState(deviceId, state) {
                this.commands.push({
                    ids: [deviceId],
                    status: 'SUCCESS',
                    states: state,
                });
                return this;
            }
            setErrorState(deviceId, errorCode) {
                this.commands.push({
                    ids: [deviceId],
                    status: 'ERROR',
                    errorCode,
                });
                return this;
            }
            build() {
                return {
                    requestId: this.requestId,
                    payload: {
                        commands: this.commands,
                    },
                };
            }
        },
    },
};
/**
 * A helper to build a simple `ExecuteRequestCommands` for sending a single
 * command to a single device.
 * @param deviceId  The id of the single device to send the command.
 * @param command  The single command to send to the device.
 * @param params  Parmeters for the command.
 * @returns  An `ExecuteRequestCommands` with the specified arguments.
 */
function createSimpleExecuteCommands(deviceId, command, params, customData) {
    return {
        devices: [{ id: deviceId, customData }],
        execution: [{ command, params }],
    };
}
exports.createSimpleExecuteCommands = createSimpleExecuteCommands;
//# sourceMappingURL=execute.js.map