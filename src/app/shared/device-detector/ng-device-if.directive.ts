import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DeviceDetectorService } from './device-detector.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ngDeviceIf]',
})
export class NgDeviceIfDirective implements OnDestroy {
  hasView = false; // funciona como 'cache'
  detector$: Subscription;

  @Input() set ngDeviceIf(deviceNames: string[]) {
    const deviceNamesFiltered = deviceNames.filter((name) => this.detector.hasBreakpoint(name));

    if (deviceNamesFiltered.length) {
      this.detector$ = this.detector.between(...deviceNamesFiltered).subscribe((is) => {
        if (is && !this.hasView) {
          this.hasView = true;
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        } else if (!is && this.hasView) {
          this.hasView = false;
          this.viewContainerRef.clear();
        }
      });
    }
  }
  constructor(
    private detector: DeviceDetectorService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnDestroy() {
    this.detector$.unsubscribe();
  }
}
