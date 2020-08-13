"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UdpResponse = exports.UdpResponseData = exports.DataFlowStub = void 0;
/**
 * Stubs to allow handlers to access smarthome.DataFlow
 */
exports.DataFlowStub = {
    UdpRequestData: class {
        constructor() {
            this.protocol = smarthome.Constants.Protocol.UDP;
            this.requestId = '';
            this.deviceId = '';
            this.data = '';
            this.port = 0;
        }
    },
};
/**
 * An implementation of `smarthome.DataFlow.UdpResponseData` for
 * responding to UDP requests.
 */
class UdpResponseData {
    /**
     * @param requestId  The requestId of associated `UdpRequestData`.
     * @param deviceId  The id of the device that the request was sent to.
     * @param udpResponse  The contents of the response.
     * @returns  A new UdpResponseData instance
     */
    constructor(requestId, deviceId, udpResponse) {
        this.protocol = smarthome.Constants.Protocol.UDP;
        this.requestId = requestId;
        this.deviceId = deviceId;
        this.udpResponse = udpResponse;
    }
}
exports.UdpResponseData = UdpResponseData;
/**
 * An implementation of `smarthome.DataFlow.UdpResponse` for
 * responding to UDP requests.
 */
class UdpResponse {
    /**
     * @param responsePackets  The response packets to include in the UdpResponse, if any
     * @returns  A new `UdpResponse` instance.
     */
    constructor(responsePackets) {
        this.responsePackets = responsePackets;
    }
}
exports.UdpResponse = UdpResponse;
//# sourceMappingURL=dataflow.js.map