"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyError = exports.UdpSendResponse = exports.UdpScanResponse = exports.UdpSendRequest = exports.UdpScanRequest = void 0;
class UdpScanRequest {
    constructor(udpScanConfig) {
        this.proxyMessageType = 'UDPSCAN';
        this.udpScanConfig = udpScanConfig;
    }
}
exports.UdpScanRequest = UdpScanRequest;
class UdpSendRequest {
    constructor(address, listenPort, payload, port) {
        this.proxyMessageType = 'UDPSEND';
        this.address = address;
        this.listenPort = listenPort;
        this.payload = payload;
        this.port = port;
    }
}
exports.UdpSendRequest = UdpSendRequest;
class UdpScanResponse {
    constructor(udpScanResults, errorString = '') {
        this.proxyMessageType = 'UDPSCAN';
        this.udpScanResults = udpScanResults;
    }
}
exports.UdpScanResponse = UdpScanResponse;
class UdpSendResponse {
    constructor(udpResponse, errorString = '') {
        this.proxyMessageType = 'UDPSEND';
        this.udpResponse = udpResponse;
    }
}
exports.UdpSendResponse = UdpSendResponse;
class ProxyError {
    constructor(errorMessage) {
        this.proxyMessageType = 'ERROR';
        this.errorMessage = errorMessage;
    }
}
exports.ProxyError = ProxyError;
//# sourceMappingURL=radio-message.js.map