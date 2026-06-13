import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  formGroup!: FormGroup;
  showSuccessMessage: boolean = false;
  showFailureMessage: boolean = false;
  userList: any[] = [];
  isLoading: boolean = false;
  emailRegex: any = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    this.formGroup = this.formBuilder.group({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      Email: new FormControl('', [Validators.required, Validators.pattern(this.emailRegex)]),
      Age: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.onLoad();
  }

  onSubmit() {
    this.isLoading = true;
    this.createUser(this.formGroup.value).subscribe((result: any) => {
      if (result.isSuccess) {
        this.showSuccessMessage = true;
        this.showFailureMessage = false;
      } else {
        this.showFailureMessage = true;
        this.showSuccessMessage = false;
      }
      this.cdr.detectChanges();

      this.onLoad();
    });
  }

  onDelete(id: number) {
    this.deleteUser(id).subscribe((result: any) => {
      this.cdr.detectChanges();

      this.onLoad();
    });
  }

  onLoad() {
    this.loadUsers().subscribe((result: any) => {
      this.userList = result.data;
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  createUser(body: any) {
    return this.httpClient.post('https://localhost:7202/api/CrudOperation/InsertUser', body);
  }

  loadUsers() {
    return this.httpClient.get('https://localhost:7202/api/CrudOperation/GetAllUsers');
  }

  deleteUser(id: number) {
    return this.httpClient.delete(`https://localhost:7202/api/CrudOperation/DeleteUser/${id}`);
  }

  checkValidity() {
    return this.formGroup.valid;
  }
}
