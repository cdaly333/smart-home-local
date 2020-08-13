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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const dgram = __importStar(require("dgram"));
const radio_controller_1 = require("../../src/radio/radio-controller");
const src_1 = require("../../src");
const UDP_DUMMY_BUFFER_1 = Buffer.from('test UDP buffer');
const UDP_DUMMY_BUFFER_2 = Buffer.from('foo bar lorem ipsum');
/**
 * Class to manage a local UDP server
 */
class UdpServer {
    startServer(listenPort = 3112) {
        this.server = dgram.createSocket('udp4');
        this.server.on('message', (message, rinfo) => {
            this.server.send(UDP_DUMMY_BUFFER_1, rinfo.port, rinfo.address);
            this.server.send(UDP_DUMMY_BUFFER_2, rinfo.port, rinfo.address);
        });
        this.server.bind(listenPort);
    }
    stopServer() {
        var _a;
        (_a = this.server) === null || _a === void 0 ? void 0 : _a.close();
    }
}
/**
 * Tests that a UDP scan finds a simple UDP server
 * and properly returns the UDP discovery data.
 */
ava_1.default.serial('udp-scan-finds-server', async (t) => {
    const serverPort = 3112;
    const listenPort = 3111;
    const scanConfig = new radio_controller_1.UDPScanConfig('localhost', serverPort, listenPort, UDP_DUMMY_BUFFER_2.toString('hex'));
    const udpServer = new UdpServer();
    udpServer.startServer(serverPort);
    const expectedScanResults = {
        buffer: UDP_DUMMY_BUFFER_1,
        rinfo: {
            address: '127.0.0.1',
            family: 'IPv4',
            port: serverPort,
            size: 15,
        },
    };
    const radioController = new radio_controller_1.RadioController();
    const scanResults = await radioController.udpScan(scanConfig);
    udpServer.stopServer();
    t.deepEqual(expectedScanResults, scanResults);
});
/**
 * Tests that a `sendUDPMessage` returns with the correct
 * response packets
 */
ava_1.default.serial('udp-message-recieves-all-data', async (t) => {
    const serverPort = 3112;
    const listenPort = 3001;
    const udpServer = new UdpServer();
    udpServer.startServer(serverPort);
    const radioController = new radio_controller_1.RadioController();
    const expectedUdpResponse = new src_1.UdpResponse([
        UDP_DUMMY_BUFFER_1.toString('hex'),
        UDP_DUMMY_BUFFER_2.toString('hex'),
    ]);
    const udpResponse = await radioController.sendUdpMessage(Buffer.from('nothing important'), 'localhost', serverPort, listenPort, 2);
    udpServer.stopServer();
    t.deepEqual(expectedUdpResponse, udpResponse);
});
//# sourceMappingURL=radio-controller-test.js.map