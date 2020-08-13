import {
  UDPScanConfig,
  UDPScanResults,
} from 'local-home-testing/build/src/radio';

export type RadioMessageType = 'UDPSCAN' | 'UDPSEND' | 'ERROR';

export interface ProxyRequest {
  proxyMessageType: RadioMessageType;
}
export interface ProxyResponse {
  proxyMessageType: RadioMessageType;
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
  udpScanResults: UDPScanResults;
  constructor(udpScanResults: UDPScanResults, errorString = '') {
    this.udpScanResults = udpScanResults;
  }
}

export class UdpSendResponse implements ProxyResponse {
  proxyMessageType: RadioMessageType = 'UDPSEND';
  udpResponse: smarthome.DataFlow.UdpResponse;
  constructor(udpResponse: smarthome.DataFlow.UdpResponse, errorString = '') {
    this.udpResponse = udpResponse;
  }
}

export class ProxyError implements ProxyResponse {
  proxyMessageType: RadioMessageType = 'ERROR';
  public errorMessage: string;
  constructor(errorMessage: string) {
    this.errorMessage = errorMessage;
  }
}
