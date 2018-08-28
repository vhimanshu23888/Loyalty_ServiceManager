import { Component, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  overlayStarSyntax: boolean = false;

  overlayDemo: any = {
    name: '',
    description: '',
  };

  constructor(private _loadingService: TdLoadingService) {}

  ngOnInit(): void {
    this._loadingService.register('overlayStarSyntax');
  }

  toggleOverlayStarSyntax(): void {
    if (this.overlayStarSyntax) {
      this._loadingService.register('overlayStarSyntax');
    } else {
      this._loadingService.resolve('overlayStarSyntax');
    }
    this.overlayStarSyntax = !this.overlayStarSyntax;
  }

}
