import {Worker} from 'worker_threads';
import yargs = require('yargs');
import * as readline from 'readline';

export interface IntentMessage {
  intentType: string;
  requestId: string;
}

export class IdentifyMessage implements IntentMessage {
  intentType: string;
  requestId: string;
  discoveryBuffer: string;
  deviceId: string;
  constructor(
    intentType: string,
    requestId: string,
    discoveryBuffer: string,
    deviceId: string
  ) {
    this.intentType = intentType;
    this.requestId = requestId;
    this.discoveryBuffer = discoveryBuffer;
    this.deviceId = deviceId;
  }
}

export class ExecuteMessage implements IntentMessage {
  intentType: string;
  requestId: string;
  localDeviceId: string;
  executeCommand: string;
  params: Record<string, unknown>;
  customData: Record<string, unknown>;
  constructor(
    intentType: string,
    requestId: string,
    localDeviceId: string,
    executeCommand: string,
    params: Record<string, unknown>,
    customData: Record<string, unknown>
  ) {
    this.intentType = intentType;
    this.requestId = requestId;
    this.localDeviceId = localDeviceId;
    this.executeCommand = executeCommand;
    this.params = params;
    this.customData = customData;
  }
}

export class CommandProcessor {
  private worker: Worker;
  private readline: readline.Interface;
  constructor(worker: Worker) {
    this.worker = worker;
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private async parseIntent(userCommand: string): Promise<IntentMessage> {
    const argv = await yargs
      .option('intent_type', {
        describe: 'The Intent type',
        type: 'string',
        demandOption: true,
      })
      .option('request_id', {
        describe: 'The request Id',
        type: 'string',
        demandOption: true,
      })
      .option('discovery_buffer', {
        describe: 'The IDENTIFY dicovery buffer represented as a string',
        type: 'string',
        demandOption: false,
      })
      .option('device_id', {
        describe: 'The device Id',
        type: 'string',
        demandOption: true,
      })
      .option('command', {
        describe: 'The execute command to send to device_id',
        type: 'string',
        demandOption: false,
      })
      .option('params', {
        describe: 'The params argument for the execute command, in JSON format',
        type: 'string',
        demandOption: false,
      })
      .option('custom_data', {
        describe:
          'The customData argument for the execute command, in JSON format',
        type: 'string',
        demandOption: false,
      })
      .parse(userCommand, {}, (error, argv) => {
        return argv;
      });
    switch (argv.intent_type) {
      case 'IDENTIFY':
        return new IdentifyMessage(
          'IDENTIFY',
          argv.request_id,
          argv.discovery_buffer!,
          argv.device_id
        );
      case 'EXECUTE':
        return new ExecuteMessage(
          'EXECUTE',
          argv.request_id,
          argv.device_id,
          argv.command!,
          JSON.parse(argv.params!),
          JSON.parse(argv.custom_data!)
        );
    }
    throw new Error('Failed to parse intent');
  }

  async processUserInput(): Promise<void> {
    let exit = false;
    while (!exit) {
      await new Promise(resolve => {
        this.readline.question('Awaiting input...\n', async input => {
          if (input.length === 0) {
            resolve();
            return;
          }
          const command = input.split(' ')[0];
          if (command === 'exit') {
            exit = true;
            resolve();
            return;
          }
          /*
          } else if (command !== 'send-intent') {
            console.log(
              'Invalid command: ' +
                command +
                '\nValid commands: exit | send-intent'
            );
            resolve();
            return;
          }*/
          try {
            const intentMessage = await this.parseIntent(input);
            console.log(intentMessage);
            this.worker.postMessage(intentMessage);
          } catch (error) {
            console.log(error);
          }
          resolve();
        });
      });
    }
  }
}
