import { Injectable } from '@angular/core';
import { fromEvent, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

interface EventWindow extends Event {
  target: Window;
}

type BreakpointFnConditional = () => boolean;

type BreakpointPropValue = [
  number | BreakpointFnConditional,
  (number | null)?,
  BreakpointFnConditional?
];

interface BreakpointProp {
  [key: string]: BreakpointPropValue;
}

@Injectable({
  providedIn: 'root',
})
export class DeviceDetectorService {
  private regexMobile = /android|iphone|ipad|ipod|mobile/i;

  private breakpoints: BreakpointProp = {
    small: [0, 768],
    medium: [768, 1024], // min, max
    large: [1024], // == [1024, null, null]
    mobile: [0, 1024, () => this.isMobile()],
  };

  // private isMobile$ = new BehaviorSubject(this.isMobile());
  private windowInnerWidth$ = new BehaviorSubject(window.innerWidth);

  constructor() {
    fromEvent(window, 'resize').subscribe((event: EventWindow) => {
      // const isMobile = this.regexMobile.test(event.target.navigator.userAgent);
      // this.isMobile$.next(isMobile);
      this.windowInnerWidth$.next(event.target.innerWidth);
    }); // angular destrói automaticamente
  }

  private compare(breakpointName: string, width: number) {
    const breakpoint = this.breakpoints[breakpointName];
    if (!Array.isArray(breakpoint)) {
      throw new Error(`Not found '${breakpointName}' in breakpoints`);
    }

    const min = breakpoint[0];
    const max = breakpoint[1];
    const callback = breakpoint[2];

    const hasMin = typeof min === 'number';
    const hasMax = typeof max === 'number';
    const hasCallback = typeof callback === 'function';

    if (hasMin && hasMax) {
      if (hasCallback) {
        return width >= min && width <= max && callback();
      }
      return width >= min && width <= max;
    }

    if (hasMin && !hasMax) {
      if (hasCallback) {
        return width > min && callback();
      }
      return width > min;
    }

    if (typeof min === 'function') {
      return min();
    }
    if (!hasMin && !hasMax && hasCallback) {
      return callback();
    }

    throw new Error(`Condition error. Check the value of breakpoint '${breakpointName}'`);
  }

  between(...breakpoints: string[]) {
    return this.windowInnerWidth$.pipe(
      map((width) => breakpoints.some((breakpoint) => this.compare(breakpoint, width)))
    );
  }

  only(breakpointName: string) {
    return this.windowInnerWidth$.pipe(map((width) => this.compare(breakpointName, width)));
  }

  addBreakpoints(breakpoints: BreakpointProp) {
    this.breakpoints = { ...this.breakpoints, ...breakpoints };
  }

  addBreakpoint(key: string, value: BreakpointPropValue) {
    this.breakpoints[key] = value;
  }

  hasBreakpoint(breakpointName: string) {
    return this.breakpoints.hasOwnProperty(breakpointName);
  }

  getBreakpoints() {
    return this.breakpoints;
  }

  isMobile() {
    const useAgent = window.navigator.userAgent;
    return this.regexMobile.test(useAgent);
  }

  isTouch() {
    return window.navigator.maxTouchPoints || 'ontouchstart' in window;
  }
}
