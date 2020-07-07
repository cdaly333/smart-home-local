/*
 * Tests to verify stub behaviors
 */
import test from 'ava';
import cbor from 'cbor';
import { MockNetwork, MockDevice } from '../platform/mock-radio';
import { MockLocalHomePlatform } from '../platform/mock-local-home-platform';
import { loadHomeApp } from '../platform/stub-setup';

// Tests a UDP identify flow end-to-end
test('udp-device-connects', async (t) => {
  // Mock a network
  const mockNetwork = new MockNetwork();

  // Mock the Local Home Platform
  const mockLocalHomePlatform = MockLocalHomePlatform.getInstance();
  // Register the Local Home Platform to the mock network
  mockNetwork.registerNetworkListener(mockLocalHomePlatform);

  // Create a mock device and register to the mock network
  const mockDevice = new MockDevice('test-device-id', mockNetwork);

  // Run Home App and set handlers
  // loadHomeApp('../bundle');

  // Assert listen() was called and handlers were loaded
  t.is(mockLocalHomePlatform.isHomeAppReady(), true);

  // Create promise to get next deviceId registered
  const connectedDeviceId: Promise<string> = mockLocalHomePlatform.getNextDeviceIdRegistered();

  // Trigger Identify message to be sent to the Local Home Platform's port
  // This cbor buffer corresponds to the Local Home SDK Sample (https://github.com/actions-on-google/smart-home-local)
  mockDevice.triggerIdentify(
    cbor.encode({
      id: 'test-device-id',
      model: '2',
      hw_rev: '0.0.1',
      fw_rev: '1.2.3',
      channels: [12345],
    })
  );

  t.is(await connectedDeviceId, mockDevice.getDeviceId());
  t.is(mockLocalHomePlatform.getLocalDeviceIdMap().size, 1);
  t.is(
    mockLocalHomePlatform.getLocalDeviceIdMap().values().next().value,
    mockDevice.getDeviceId()
  );
});
