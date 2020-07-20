import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgDeviceIfDirective } from './ng-device-if.directive';

@NgModule({
  declarations: [NgDeviceIfDirective],
  imports: [CommonModule],
  exports: [NgDeviceIfDirective],
})
export class DeviceDetectorModule {}
