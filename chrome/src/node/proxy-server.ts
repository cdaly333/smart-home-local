import WebSocket, * as ws from 'ws';
import {
  ProxyRequest,
  UdpSendRequest,
  UdpScanRequest,
  UdpScanResponse,
  UdpSendResponse,
} from '../common/radio-message';
import {NodeRadioController} from 'local-home-testing/build/src/radio';

/**
 * A WebSocket server that runs on node to provide radio fulfillment.
 */
export class ProxyRadioServer {
  private webSocketServer: ws.Server;
  private nodeRadioController: NodeRadioController;

  constructor(port = 5000) {
    this.webSocketServer = new ws.Server({port});
    this.nodeRadioController = new NodeRadioController();
    this.webSocketServer.on('connection', socket => {
      console.log('Connection established');
      socket.on('message', async message => {
        console.log(`received ${message}`);
        const radioMessage: ProxyRequest = JSON.parse(message as string);
        switch (radioMessage.proxyMessageType) {
          case 'UDPSCAN': {
            this.handleUdpScan(radioMessage as UdpScanRequest, socket);
            break;
          }
          case 'UDPSEND': {
            this.handleUdpSend(radioMessage as UdpSendRequest, socket);
            break;
          }
        }
      });
    });
  }

  private async handleUdpScan(
    udpScanRequest: UdpScanRequest,
    socket: WebSocket
  ): Promise<void> {
    try {
      const udpScanResponse = new UdpScanResponse(
        await this.nodeRadioController.udpScan(udpScanRequest.udpScanConfig)
      );
      socket.send(JSON.stringify(udpScanResponse));
    } catch (error) {
      const errorResponse = new UdpScanResponse(undefined, error.message);
      socket.send(JSON.stringify(errorResponse));
    }
  }

  private async handleUdpSend(
    udpSendRequest: UdpSendRequest,
    socket: WebSocket
  ): Promise<void> {
    try {
      const udpSendResponse = new UdpSendResponse(
        await this.nodeRadioController.sendUdpMessage(
          Buffer.from(udpSendRequest.payload, 'hex'),
          udpSendRequest.address,
          udpSendRequest.port,
          udpSendRequest.listenPort
        )
      );
      socket.send(JSON.stringify(udpSendResponse));
    } catch (error) {
      const errorResponse = new UdpSendResponse(undefined, error.message);
      socket.send(errorResponse);
    }
  }
}
