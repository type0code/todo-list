import { Component, OnInit, Input, forwardRef, HostBinding, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { state } from '../../interfaces/general';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor, OnInit {
  @HostBinding('class.app-input') true;
  @HostBinding('class.input-focus') get focus() {
    return this.inputFocus;
  }
  @HostBinding('class.input-disabled') @Input() disabled: boolean;
  @HostBinding('class.input-readonly') @Input() readonly: boolean;
  @Input() type: string;
  @Input() name: string;
  @Input() placeholder: string;
  @Input() prefixIcon: string | string[];
  @Input() suffixIcon: string | string[];
  @Input() required: boolean;
  @Input() innerValue: string;
  inputFocus: boolean;
  states: any;
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private element: ElementRef) {
    this.type = 'text';
    this.name = '';
    this.inputFocus = false;
    this.readonly = false;
    this.disabled = false;
    this.required = false;
    this.innerValue = '';
    this.states = state;
  }

  ngOnInit() { }

  get value() {
    return this.innerValue;
  }

  set value(v) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChange(v);
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(value: string) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  onFocus(disabled: boolean) {
    if (!this.inputFocus && !disabled) {
      this.element.nativeElement.querySelector('.input-control').focus();
      this.inputFocus = true;
    }
  }

  onBlur(disabled: boolean) {
    this.inputFocus = false;

    if (!disabled) {
      this.onTouched();
    }
  }
}
