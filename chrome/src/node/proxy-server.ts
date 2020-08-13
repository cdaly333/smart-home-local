import * as ws from 'ws';
import {
  ProxyRequest,
  UdpSendRequest,
  UdpScanRequest,
  UdpScanResponse,
  ProxyError,
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
        const radioMessage: ProxyRequest = JSON.parse(message as string);
        switch (radioMessage.proxyMessageType) {
          case 'UDPSCAN': {
            const udpScanRequest = radioMessage as UdpScanRequest;
            //TODO(cjdaly): move into function
            console.log('Received UdpScanRequest.');
            try {
              const udpScanResponse = new UdpScanResponse(
                await this.nodeRadioController.udpScan(
                  udpScanRequest.udpScanConfig
                )
              );
              socket.send(JSON.stringify(udpScanResponse));
            } catch (error) {
              socket.send(new ProxyError(error));
            }
            break;
          }
          case 'UDPSEND': {
            const udpSendRequest = radioMessage as UdpSendRequest;
            console.log('Received UdpSendRequest.');
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
              socket.send(new ProxyError(error));
            }
            break;
          }
        }
      });
    });
  }
}
