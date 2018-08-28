import { DataService } from '../shared/data.service';
import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { TdMediaService } from '@covalent/core/media';
import { MatIconModule } from '@angular/material/icon';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'layouts-nav-list',
  templateUrl: 'home.component.html',
  styleUrls:['home.component.scss']
})
export class HomeComponent{
  
  routes: Object[] = [{
    icon: 'home',
    route: '.',
    title: 'Home',
  }, {
    icon: 'library_books',
    route: '/services',
    title: 'Documentation',
  }, 
];
usermenu: Object[] = [];
navmenu: Object[] = [{
    icon: 'looks_one',
    route: '/services',
    title: 'First item',
    description: 'Item description',
  }, {
    icon: 'looks_two',
    route: '.',
    title: 'Second item',
    description: 'Item description',
  }, {
    icon: 'looks_3',
    route: '.',
    title: 'Third item',
    description: 'Item description',
  }, {
    icon: 'looks_4',
    route: '.',
    title: 'Fourth item',
    description: 'Item description',
  }, {
    icon: 'looks_5',
    route: '.',
    title: 'Fifth item',
    description: 'Item description',
  },
];
  constructor(private dataService: DataService,public media: TdMediaService) { }
}
