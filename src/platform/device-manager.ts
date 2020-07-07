/**
 * DeviceManager Stub
 * TODO(cjdaly) integrate with Mock Local Home Platform and Mock Network
 **/
/// <reference types="@google/local-home-sdk" />

import { DeviceManager } from '@google/local-home-sdk';

export class DeviceManagerStub implements DeviceManager {
  markPending(request: smarthome.IntentRequest): Promise<void> {
    //TODO(cjdaly) implementation
    throw new Error('Method not implemented.');
  }

  getProxyInfo(id: string): smarthome.ProxyInfo {
    //TODO(cjdaly) implementation
    throw new Error('Method not implemented.');
  }

  public send(
    command: smarthome.DataFlow.TcpRequestData
  ): Promise<smarthome.DataFlow.CommandSuccess> {
    throw new Error('Method not implemented.');
  }
}
