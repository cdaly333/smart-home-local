import {
  UDPScanConfig,
  UDPScanResults,
} from 'local-home-testing/build/src/radio';

export type RadioMessageType = 'UDPSCAN' | 'UDPSEND';

export interface ProxyRequest {
  proxyMessageType: RadioMessageType;
}
export interface ProxyResponse {
  proxyMessageType: RadioMessageType | undefined;
  error: undefined | string;
}

export class UdpScanRequest implements ProxyRequest {
  proxyMessageType: RadioMessageType = 'UDPSCAN';
  udpScanConfig: UDPScanConfig;
  constructor(udpScanConfig: UDPScanConfig) {
    this.udpScanConfig = udpScanConfig;
  }
}

export class UdpSendRequest implements ProxyRequest {
  proxyMessageType: RadioMessageType = 'UDPSEND';
  address: string;
  listenPort: number;
  payload: string;
  port: number;
  constructor(
    address: string,
    listenPort: number,
    payload: string,
    port: number
  ) {
    this.address = address;
    this.listenPort = listenPort;
    this.payload = payload;
    this.port = port;
  }
}

export class UdpScanResponse implements ProxyResponse {
  proxyMessageType: RadioMessageType = 'UDPSCAN';
  error: undefined | string;
  udpScanResults: UDPScanResults | undefined;
  constructor(udpScanResults?: UDPScanResults, error = '') {
    this.udpScanResults = udpScanResults;
    this.error = error;
  }
}

export class UdpSendResponse implements ProxyResponse {
  proxyMessageType: RadioMessageType = 'UDPSEND';
  error: string | undefined;
  udpResponse: smarthome.DataFlow.UdpResponse | undefined;
  constructor(udpResponse?: smarthome.DataFlow.UdpResponse, error?: string) {
    this.udpResponse = udpResponse;
    this.error = error;
  }
}
