export async function flushPromises(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  return new Promise(process.nextTick);
}
