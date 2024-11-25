import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { UsersService } from './services/users/users.service';
import { RegistersService } from './services/registers/registers.service';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NavbarComponent } from './component/navbar/navbar.component';
import { FooterComponent } from './component/footer/footer.component';
import {CloudinaryModule} from '@cloudinary/ng';
import { NzConfigService } from 'ng-zorro-antd/core/config';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    NzBreadCrumbModule, 
    RouterOutlet, 
    NzIconModule, 
    NzLayoutModule,
    NzAvatarModule,
    NzFlexModule,
    NzMenuModule,
    NzDropDownModule,
    NzToolTipModule,
    NzTableModule,
    NavbarComponent,
    FooterComponent,
    CloudinaryModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;
  title = 'app-ngzorro';

  constructor(
    private usersService: UsersService, 
    public registersService: RegistersService,
    private nzConfigService: NzConfigService
  ) {
    this.nzConfigService.set('message', { nzTop: 70 });
  }

  isLogged(): boolean {
    return this.usersService.getCurrentUser() !== null;
  }

  logout(): void {
    this.registersService.currentRegister = undefined;
    this.usersService.logout();
  }
}
