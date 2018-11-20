import { Component, OnInit, HostBinding, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { state } from '../../interfaces/general';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor, OnInit {
  @HostBinding('class.app-checkbox') true;
  @HostBinding('class.checked') get focus() {
    return this._value;
	}

  @HostBinding('class.disabled') @Input() disabled: boolean;
  @Input() label: string;
  @Input() name: string;
  @Input('value') _value: boolean;

	states: any;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor() {
    this._value = false;
    this.label = '';
    this.name = '';
    this.disabled = false;
    this.states = state;
  }

  ngOnInit() { }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(value) {
    this.value = value;
  }

  switch(bool: boolean) {
    !this.disabled ? this.value = !bool : null;
  }
}
