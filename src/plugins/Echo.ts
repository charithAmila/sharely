import { registerPlugin } from '@capacitor/core';

export interface EchoPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
  saveToKeyChain(data: { key: string, value: string }): Promise<{ key: string, value: string }>;
  readFromKeyChain(data: { key: string }): Promise<{ key: string, value: string }>;
  deleteFromKeyChain(data: { key: string }): Promise<{ key: string }>;
}

const Echo = registerPlugin<EchoPlugin>('Echo');

export default Echo;
