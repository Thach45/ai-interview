import { EventEmitter } from 'events';
class AppEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
  }
}

export const eventEmitter = new AppEventEmitter();
