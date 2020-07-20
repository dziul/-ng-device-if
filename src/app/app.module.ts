import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { NgDeviceIfDirective } from './shared/device-detector/ng-device-if.directive';

@NgModule({
  declarations: [AppComponent, NgDeviceIfDirective],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
