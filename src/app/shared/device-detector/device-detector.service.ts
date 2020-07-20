import { Injectable } from '@angular/core';
import { fromEvent, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

interface EventWindow extends Event {
  target: Window;
}

interface BreakpointProps {
  [key: string]: number[];
}

@Injectable({
  providedIn: 'root',
})
export class DeviceDetectorService {
  private breakpoints: BreakpointProps = {
    small: [0, 768],
    medium: [768, 1024], // min, max
    large: [1024], // max
  };

  windowInnerWidth$ = new BehaviorSubject(window.innerWidth);

  constructor() {
    fromEvent(window, 'resize').subscribe((event: EventWindow) => {
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
    const hasMax = typeof max === 'number';

    if (hasMax) {
      return width >= min && width <= max;
    }
    return width > min;
  }

  between(...breakpoints: string[]) {
    return this.windowInnerWidth$.pipe(
      map((width) => breakpoints.some((breakpoint) => this.compare(breakpoint, width)))
    );
  }

  only(breakpointName: string) {
    return this.windowInnerWidth$.pipe(map((width) => this.compare(breakpointName, width)));
  }

  addBreakpoints(breakpoints: BreakpointProps) {
    this.breakpoints = { ...this.breakpoints, ...breakpoints };
  }

  addBreakpoint(key: string, value: number[]) {
    this.breakpoints[key] = value;
  }

  hasBreakpoint(breakpointName: string) {
    return this.breakpoints.hasOwnProperty(breakpointName);
  }

  getBreakpoints() {
    return this.breakpoints;
  }
}
