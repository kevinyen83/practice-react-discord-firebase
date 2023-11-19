import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserMenuComponent } from 'app/layout/common/user-menu/user-menu.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
    declarations: [
        UserMenuComponent
    ],
    imports     : [
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatBadgeModule,
        SharedModule
    ],
    exports     : [
        UserMenuComponent
    ]
})
export class UserMenuModule
{
}
