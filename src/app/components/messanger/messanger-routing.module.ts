import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessangerComponent } from './messanger.component';

const routes: Routes = [
    {
        path: '',
        component: MessangerComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MessangerRoutingModule {}
