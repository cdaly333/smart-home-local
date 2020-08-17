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
 * Uses the `NodeRadioController` implementation to fulfill requests.
 */
export class ProxyRadioServer {
  private webSocketServer: ws.Server;
  private nodeRadioController: NodeRadioController;

  constructor(port = 4321) {
    this.webSocketServer = new ws.Server({port});
    // Instantiate a radio controller.
    this.nodeRadioController = new NodeRadioController();
    /**
     * Handle connection and message events.
     */
    this.webSocketServer.on('connection', socket => {
      console.log('Connection established');
      socket.on('message', async message => {
        console.log(`received ${message}`);
        const radioMessage: ProxyRequest = JSON.parse(message as string);
        // Route messages to corresponding message handlers.
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

  /**
   * Uses the internal `NodeRadioController` to fulfill the UDP scan request.
   * Formats the response and sends it across the socket.
   * @param udpScanRequest  A UDP scan request to fulfill and respond to.
   * @param socket  The socket to respond on.
   */
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

  /**
   * Uses the internal `NodeRadioController` to fulfill the send request.
   * Formats the response and sends it across the socket.
   * @param udpScanRequest  A UDP send request to fulfill and respond to.
   * @param socket  The socket to respond on.
   */
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
