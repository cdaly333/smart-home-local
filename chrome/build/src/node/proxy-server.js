"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyRadioServer = void 0;
const ws = __importStar(require("ws"));
const radio_message_1 = require("../common/radio-message");
const radio_1 = require("local-home-testing/build/src/radio");
/**
 * A WebSocket server that runs on node to provide radio fulfillment.
 */
class ProxyRadioServer {
    constructor(port = 5000) {
        this.webSocketServer = new ws.Server({ port });
        this.nodeRadioController = new radio_1.NodeRadioController();
        this.webSocketServer.on('connection', socket => {
            console.log('Connection established');
            socket.on('message', async (message) => {
                const radioMessage = JSON.parse(message);
                switch (radioMessage.proxyMessageType) {
                    case 'UDPSCAN': {
                        const udpScanRequest = radioMessage;
                        //TODO(cjdaly): move into function
                        console.log('Received UdpScanRequest.');
                        try {
                            const udpScanResponse = new radio_message_1.UdpScanResponse(await this.nodeRadioController.udpScan(udpScanRequest.udpScanConfig));
                            socket.send(JSON.stringify(udpScanResponse));
                        }
                        catch (error) {
                            socket.send(new radio_message_1.ProxyError(error));
                        }
                        break;
                    }
                    case 'UDPSEND': {
                        const udpSendRequest = radioMessage;
                        console.log('Received UdpSendRequest.');
                        try {
                            const udpSendResponse = new radio_message_1.UdpSendResponse(await this.nodeRadioController.sendUdpMessage(Buffer.from(udpSendRequest.payload, 'hex'), udpSendRequest.address, udpSendRequest.port, udpSendRequest.listenPort));
                            socket.send(JSON.stringify(udpSendResponse));
                        }
                        catch (error) {
                            socket.send(new radio_message_1.ProxyError(error));
                        }
                        break;
                    }
                }
            });
        });
    }
}
exports.ProxyRadioServer = ProxyRadioServer;
//# sourceMappingURL=proxy-server.js.map