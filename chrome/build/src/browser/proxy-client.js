"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyRadioClient = void 0;
const radio_message_1 = require("../common/radio-message");
class ProxyRadioClient {
    constructor(port = 5000) {
        this.webSocket = new WebSocket('ws://localhost:' + port.toString());
        this.webSocket.onopen = event => {
            console.log('Connection established with server.');
        };
        this.webSocket.onmessage = this.handleMessageEvent;
    }
    handleMessageEvent(event) {
        const response = JSON.parse(event.data);
        switch (response.proxyMessageType) {
            case 'UDPSCAN': {
                if (this.onUdpScanResponse) {
                    this.onUdpScanResponse(response);
                    this.onUdpScanResponse = undefined;
                }
                break;
            }
            case 'UDPSEND': {
                if (this.onUdpSendResponse) {
                    this.onUdpSendResponse(response);
                    this.onUdpScanResponse = undefined;
                }
                break;
            }
        }
    }
    udpScan(udpScanConfig, timeout) {
        if (this.onUdpScanResponse) {
            throw new Error('Cannot start new UDP scan: another scan is in progress.');
        }
        const scanRequest = new radio_message_1.UdpScanRequest(udpScanConfig);
        this.webSocket.send(JSON.stringify(scanRequest));
        //TODO(cjdaly) timeout
        return new Promise(resolve => {
            this.onUdpScanResponse = (udpScanResponse) => {
                resolve(udpScanResponse.udpScanResults);
            };
        });
    }
    sendUdpMessage(payload, address, port, listenPort, expectedResponsePackets, timeout) {
        if (this.onUdpSendResponse) {
            throw new Error('Cannot start new UDP send: another send is in progress.');
        }
        const sendRequest = new radio_message_1.UdpSendRequest(address, listenPort, Buffer.from(payload).toString('hex'), port);
        this.webSocket.send(JSON.stringify(sendRequest));
        //TODO(cjdaly) timeout
        return new Promise(resolve => {
            this.onUdpSendResponse = (UdpSendResponse) => {
                resolve(UdpSendResponse.udpResponse);
            };
        });
    }
}
exports.ProxyRadioClient = ProxyRadioClient;
//# sourceMappingURL=proxy-client.js.map