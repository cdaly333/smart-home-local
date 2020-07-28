import * as yargs from 'yargs';
import {Worker} from 'worker_threads';
import {CommandProcessor} from './command-processor';

const APP_INSTANCE_PATH = './build/src/cli/app-instance.js';

const argv = yargs.usage('Usage $0 --app_path PATH').option('app_path', {
  describe: 'The path of the Local Fulfillment App entry point',
  type: 'string',
  demandOption: false,
}).argv;

async function main() {
  const worker = new Worker(APP_INSTANCE_PATH, {
    workerData: argv.app_path,
  });

  worker.on('error', error => {
    console.log(
      'An error occured while trying to initialize the command line interface:\n' +
        error.toString()
    );
  });

  worker.on('message', async message => {
    if (message === 'ready') {
      const commandProcessor = new CommandProcessor(worker);
      await commandProcessor.processUserInput();
      worker.terminate();
    }
  });
}

main();
