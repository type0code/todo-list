import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from './components/button';
import { CheckboxComponent } from './components/checkbox';
import { InputComponent } from './components/input';

@NgModule({
  imports: [
    CommonModule,
		FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ButtonComponent,
    CheckboxComponent,
    InputComponent
  ],
  exports: [
    ButtonComponent,
    CheckboxComponent,
    InputComponent
  ]
})
export class UIModule { }
