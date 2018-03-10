import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery'

@Component({
  selector: 'admin-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
        //jQuery.getScript('../../../assets/js/material-dashboard.js');
        jQuery.getScript('/assets/js/initMenu.js');
  }

  isMaps(nemtom: string) : boolean {
      return false
  }
}
