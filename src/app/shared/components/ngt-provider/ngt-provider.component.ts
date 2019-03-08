import { Component, OnInit, ViewChild, ViewContainerRef, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-ngt-provider',
    templateUrl: './ngt-provider.component.html',
    styleUrls: ['./ngt-provider.component.scss']
})
export class NgtProviderComponent implements OnInit {
    @Output() private sigReady = new EventEmitter<ViewContainerRef>();
    @ViewChild("tpl", { read: ViewContainerRef }) private _vcr: ViewContainerRef;

    ngOnInit() { this.sigReady.emit(this._vcr); }
}
