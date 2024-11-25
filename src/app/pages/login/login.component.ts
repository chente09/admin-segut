import { Component } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RegistersService } from '../../services/registers/registers.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NzFormModule, 
    NzInputModule, 
    NzButtonModule, 
    ReactiveFormsModule, 
    NzCheckboxModule, 
    RouterLink, 
    NzIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private registerService: RegistersService, 
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute, 
    private router: Router 
  ) { 
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }


  onClickLogin(): void {
    if (this.form.invalid) return;
    this.registerService.login(this.form.value)
    .then((response)=>{
      console.log(response);
    })
    .catch((error)=>{
      console.log(error);
    })
    this.router.navigate(['/admin']);
  }   

  

  onClickRegisterWithGoogle(): void {
    this.registerService.createRegisterWithGoogle()
      .then((response)=>{
        console.log(response);
      })
      .catch((error)=>{
        console.log(error);
      })
    
    this.router.navigate(['/admin']);
  }

}
