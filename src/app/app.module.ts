import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DeviceDetectorModule } from './shared/device-detector/device-detector.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, DeviceDetectorModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
