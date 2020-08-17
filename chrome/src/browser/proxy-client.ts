import {
  RadioController,
  UDPScanConfig,
  UDPScanResults,
} from 'local-home-testing/build/src/radio';
import {
  UdpScanRequest,
  UdpSendRequest,
  UdpSendResponse,
  UdpScanResponse,
} from '../common/radio-message';
import {ProxyResponse} from '../common/radio-message';

type ProxyResponseAction<T> = (response: T) => void;

/**
 * An implementation of `RadioController` that feeds radio requests over
 * a WebSocket connection to a `ProxyRadioServer` which fulfills
 * radio commands and replies with the results.
 */
export class ProxyRadioClient implements RadioController {
  private webSocket: WebSocket;
  private onUdpScanResponse: ProxyResponseAction<UdpScanResponse> | undefined;
  private onUdpSendResponse: ProxyResponseAction<UdpSendResponse> | undefined;

  /**
   * Establishes the local WebSocket connection.
   * @returns  A new `ProxyRadioClient` instance.
   */
  constructor(port = 4321) {
    this.webSocket = new WebSocket('ws://localhost:' + port.toString());
    this.webSocket.onopen = event => {
      console.log('Connection established with proxy server.')!;
    };
    this.webSocket.onmessage = event => {
      this.handleMessageEvent(event);
    };
  }

  /**
   * Handles `WebSocket` messages as responses to radio requests.
   * @param event
   */
  private handleMessageEvent(event: MessageEvent) {
    const response: ProxyResponse = JSON.parse(event.data as string);
    if (response.error) {
      console.error(
        `A radio request of type ${response.proxyMessageType} returned with an error:\n${response.error}`
      );
    }
    switch (response.proxyMessageType) {
      case 'UDPSCAN': {
        if (this.onUdpScanResponse) {
          this.onUdpScanResponse(response as UdpScanResponse);
        }
        // Clear the response callback.
        this.onUdpScanResponse = undefined;
        break;
      }
      case 'UDPSEND': {
        if (this.onUdpSendResponse) {
          this.onUdpSendResponse(response as UdpSendResponse);
        }
        // Clear the response callback.
        this.onUdpSendResponse = undefined;
        break;
      }
    }
  }

  /**
   * Sends a `UdpScanRequest` over the WebSocket connection
   * and resolves with the response.
   * @param udpScanConfig  A struct containing a UDP scan config.
   * @returns  A promise that resolves to the `UDPScanResults`.
   */
  async udpScan(udpScanConfig: UDPScanConfig): Promise<UDPScanResults> {
    const scanRequest = new UdpScanRequest(udpScanConfig);
    if (this.onUdpScanResponse) {
      throw new Error(
        'Cannot start a new UDP scan: another scan is in progress.'
      );
    }
    //TODO(cjdaly) Timeout this promise.
    return new Promise<UDPScanResults>((resolve, reject) => {
      this.onUdpScanResponse = (udpScanResponse: UdpScanResponse) => {
        resolve(udpScanResponse.udpScanResults);
      };
      this.webSocket.send(JSON.stringify(scanRequest));
    });
  }

  /**
   * Sends a `UdpScanRequest` over the WebSocket connection
   * and resolves with the response.
   * @param payload  The UDP message payload.
   * @param address  The UDP destination address.
   * @param port  The UDP destination port.
   * @param listenPort  The UDP port to listen on.
   * @param expectedResponsePackets  The amount of response packets to listen for.
   * @param timeout
   */
  sendUdpMessage(
    payload: Buffer,
    address: string,
    port: number,
    listenPort: number,
    expectedResponsePackets?: number | undefined
  ): Promise<smarthome.DataFlow.UdpResponse> {
    if (this.onUdpSendResponse) {
      throw new Error(
        'Cannot start new UDP send: another send is in progress.'
      );
    }
    const sendRequest = new UdpSendRequest(
      address,
      listenPort,
      Buffer.from(payload).toString('hex'),
      port,
      expectedResponsePackets
    );
    //TODO(cjdaly) Timeout this promise.
    return new Promise<smarthome.DataFlow.UdpResponse>((resolve, reject) => {
      this.onUdpSendResponse = (udpSendResponse: UdpSendResponse) => {
        resolve(udpSendResponse.udpResponse);
      };
      this.webSocket.send(JSON.stringify(sendRequest));
    });
  }
}
