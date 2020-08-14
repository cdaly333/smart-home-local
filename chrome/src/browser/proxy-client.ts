import {
  RadioController,
  UDPScanConfig,
  UDPScanResults,
  UdpResponseData,
} from 'local-home-testing/build/src/radio';
import {
  UdpScanRequest,
  UdpSendRequest,
  UdpSendResponse,
  UdpScanResponse,
} from '../common/radio-message';
import {ProxyResponse} from '../common/radio-message';

type ProxyResponseAction<T> = (response: T) => void;

export class ProxyRadioClient implements RadioController {
  private webSocket: WebSocket;
  private onUdpScanResponse: ProxyResponseAction<UdpScanResponse> | undefined;
  private onUdpSendResponse: ProxyResponseAction<UdpSendResponse> | undefined;

  constructor(port = 5000) {
    this.webSocket = new WebSocket('ws://localhost:' + port.toString());
    this.webSocket.onopen = event => {
      console.log('Connection established with proxy server.')!;
    };
    this.webSocket.onmessage = event => {
      this.handleMessageEvent(event);
    };
  }

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
        this.onUdpScanResponse = undefined;
        break;
      }
      case 'UDPSEND': {
        if (this.onUdpSendResponse) {
          this.onUdpSendResponse(response as UdpSendResponse);
        }
        this.onUdpSendResponse = undefined;
        break;
      }
    }
  }

  async udpScan(
    udpScanConfig: UDPScanConfig,
    timeout?: number | undefined
  ): Promise<UDPScanResults> {
    const scanRequest = new UdpScanRequest(udpScanConfig);
    if (this.onUdpScanResponse) {
      throw new Error(
        'Cannot start a new UDP scan: another scan is in progress.'
      );
    }
    //TODO(cjdaly) timeout
    return new Promise<UDPScanResults>((resolve, reject) => {
      this.onUdpScanResponse = (udpScanResponse: UdpScanResponse) => {
        resolve(udpScanResponse.udpScanResults);
      };
      this.webSocket.send(JSON.stringify(scanRequest));
    });
  }

  sendUdpMessage(
    payload: Buffer,
    address: string,
    port: number,
    listenPort: number,
    expectedResponsePackets?: number | undefined,
    timeout?: number | undefined
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
      port
    );
    //TODO(cjdaly) timeout
    return new Promise<smarthome.DataFlow.UdpResponse>((resolve, reject) => {
      this.onUdpSendResponse = (udpSendResponse: UdpSendResponse) => {
        resolve(udpSendResponse.udpResponse);
      };
      this.webSocket.send(JSON.stringify(sendRequest));
    });
  }
}
