import { Component, OnInit } from '@angular/core';
// import { DeviceDetectorService } from './shared/device-detector/device-detector.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // constructor(private deviceDetector: DeviceDetectorService) {}

  ngOnInit() {
    // this.deviceDetector.addBreakpoints({
    //   mobile: [0, 768],
    //   tablet: [768, 1024],
    //   desktop: [1024],
    // });
  }
}
