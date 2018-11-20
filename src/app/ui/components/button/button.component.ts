import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: '[app-button]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @HostBinding('class.app-btn') true;
  @HostBinding('class.btn-block') @Input() block: boolean;
  @HostBinding('class.btn-disabled') @Input() disabled: boolean;
  @HostBinding('class.btn-load') @Input() load: boolean;
  @HostBinding('class.btn-default') get viewDefault() { return this.view === 'default' };
  @HostBinding('class.btn-accent') get viewAccent() { return this.view === 'accent' };
  @HostBinding('class.btn-info') get viewInfo() { return this.view === 'info' };
  @HostBinding('class.btn-success') get viewSuccess() { return this.view === 'success' };
  @HostBinding('class.btn-warning') get viewWarning() { return this.view === 'warning' };
  @HostBinding('class.btn-error') get viewError() { return this.view === 'error' };

  @Input() view: string;
  @Input() beforeIcon: string;
  @Input() afterIcon: string;

  constructor() {
    this.block = false;
    this.disabled = false;
    this.load = false;
    this.view = 'default';
  }

  ngOnInit() { }
}
