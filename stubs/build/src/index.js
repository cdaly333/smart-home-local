"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const stub_setup_1 = require("./platform/stub-setup");
__exportStar(require("./platform/mock-local-home-platform"), exports);
__exportStar(require("./platform/stub-setup"), exports);
__exportStar(require("./platform/smart-home-app"), exports);
__exportStar(require("./platform/mock-device-manager"), exports);
__exportStar(require("./platform/execute"), exports);
__exportStar(require("./radio/dataflow"), exports);
__exportStar(require("./radio/radio-controller"), exports);
__exportStar(require("./radio/radio-device-manager"), exports);
/**
 * Injects the stubs into the global context on import.
 */
global.smarthome = stub_setup_1.smarthomeStub;
//# sourceMappingURL=index.js.map