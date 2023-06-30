import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

/**
 * @hidden
 * This class overrides the default Angular gesture config.
 */
@Injectable()
export class IonicGestureConfig extends HammerGestureConfig {
  override buildHammer(element: HTMLElement) {
    const mc = new (window as any).Hammer(element);
    if (window) {
      for (const eventName in this.overrides) {
        if (eventName) {
          mc.get(eventName).set(this.overrides[eventName])
        }
      }
    }
    return mc;
  }
}