"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStubs = exports.smarthomeStub = void 0;
/*
 * Composes and exports the smarthome namespace containing all stubs.
 */
const smart_home_app_1 = require("./smart-home-app");
const execute_1 = require("./execute");
const dataflow_1 = require("../radio/dataflow");
exports.smarthomeStub = {
    App: smart_home_app_1.AppStub,
    Execute: execute_1.ExecuteStub,
    Intents: {
        EXECUTE: 'action.devices.EXECUTE',
        IDENTIFY: 'action.devices.IDENTIFY',
        REACHABLE_DEVICES: 'action.devices.REACHABLE_DEVICES',
    },
    IntentFlow: {
        HandlerError: class extends Error {
            constructor(requestId, errorCode, debugString) {
                super(errorCode);
                this.requestId = requestId;
                this.errorCode = errorCode || '';
                this.debugString = debugString;
            }
        },
    },
    DataFlow: dataflow_1.DataFlowStub,
    Constants: {
        Protocol: {
            BLE: 'BLE',
            HTTP: 'HTTP',
            TCP: 'TCP',
            UDP: 'UDP',
            BLE_MESH: 'BLE_MESH',
        },
    },
};
/**
 * Module-level function to source `MockLocalHomePlatform`
 * and `DeviceManagerStub` from an `App`.
 * @param app  The app to promote and extract the stubs from.
 * @returns  The extracted stubs.
 */
function extractStubs(app) {
    if (app instanceof smart_home_app_1.AppStub) {
        return {
            mockLocalHomePlatform: app.getLocalHomePlatform(),
            deviceManagerStub: app
                .getLocalHomePlatform()
                .getDeviceManager(),
        };
    }
    throw new Error("Couldn't downcast App to AppStub");
}
exports.extractStubs = extractStubs;
//# sourceMappingURL=stub-setup.js.map