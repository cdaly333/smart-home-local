import {UDPScanConfig} from 'local-home-testing/build/src/radio/dataflow';
import {RadioDeviceManager} from 'local-home-testing/build/src/radio/radio-device-manager';
import {
  MockLocalHomePlatform,
  AppStub,
  extractStubs,
  createSimpleExecuteCommands,
} from 'local-home-testing';
import {ProxyRadioClient} from './proxy-client';

export class PlatformController {
  private mockLocalHomePlatform: MockLocalHomePlatform | undefined;
  private proxyRadioClient: ProxyRadioClient | undefined;
  private radioDeviceManager: RadioDeviceManager | undefined;

  constructor(appStubPromise: Promise<AppStub>) {
    this.initializePlatform(appStubPromise);
  }

  private async initializePlatform(appStubPromise: Promise<AppStub>) {
    console.log('Awaiting smarthome.app constructor...');
    const appStub = await appStubPromise;
    this.mockLocalHomePlatform = extractStubs(appStub!).mockLocalHomePlatform;
    this.proxyRadioClient = new ProxyRadioClient();
    this.radioDeviceManager = new RadioDeviceManager(this.proxyRadioClient);
    this.mockLocalHomePlatform.setDeviceManager(this.radioDeviceManager);
    console.log('Platform initalized.  Awaiting input.');
  }

  public async udpScan(
    requestId: string,
    scanConfig: UDPScanConfig,
    deviceId: string
  ): Promise<void> {
    if (this.mockLocalHomePlatform === null) {
      return;
    }
    try {
      const scanRemoteInfo = await this.proxyRadioClient!.udpScan(scanConfig);

      // Trigger the identifyHandler with scan results.
      await this.mockLocalHomePlatform!.triggerIdentify(
        requestId,
        Buffer.from(scanRemoteInfo.scanData, 'hex'),
        deviceId
      );

      // Save association between deviceId and local IP address.
      this.radioDeviceManager!.addDeviceIdToAddress(
        deviceId,
        scanRemoteInfo.rinfo.address
      );
    } catch (error) {
      console.error('UDP scan failed:\n' + error);
    }
  }

  public async identify(
    requestId: string,
    discoveryBuffer: string,
    deviceId: string
  ): Promise<void> {
    if (this.mockLocalHomePlatform === null) {
      return;
    }
    try {
      await this.mockLocalHomePlatform!.triggerIdentify(
        requestId,
        Buffer.from(discoveryBuffer, 'hex'),
        deviceId
      );
    } catch (error) {
      console.error(
        `An Error occured while triggering the identifyHandler:\n${error}`
      );
    }
  }

  public async execute(
    requestId: string,
    deviceId: string,
    executeCommand: string,
    params: Record<string, unknown>,
    customData: Record<string, unknown>
  ): Promise<void> {
    if (this.mockLocalHomePlatform === null) {
      return;
    }
    try {
      const executeCommands = createSimpleExecuteCommands(
        deviceId,
        executeCommand!,
        params,
        customData
      );
      // Trigger an Execute intent.
      const executeResponse = await this.mockLocalHomePlatform!.triggerExecute(
        requestId,
        [executeCommands]
      );
      // Report the ExecuteResponse if succesful.
      console.log(
        `Execute handler triggered. ExecuteResponse was:\n${JSON.stringify(
          executeResponse
        )}`
      );
    } catch (error) {
      console.error(
        `An error occured when triggering the Execute handler:\n${error.toString()}`
      );
    }
  }
}
