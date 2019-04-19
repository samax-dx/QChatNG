import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgtProviderComponent } from 'src/app/shared/components/ngt-provider/ngt-provider.component';

@NgModule({
    declarations: [
        AppComponent,
        NgtProviderComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: []
})
export class AppModule { }
