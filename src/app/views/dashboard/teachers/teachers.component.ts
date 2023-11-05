import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { TeachersService } from 'src/app/core/services/teachers.service';
import { Teacher } from 'src/app/interfaces/teachers';
import { DialogTeachersComponent } from './components/dialog-teachers/dialog-teachers.component';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss'],
})
export class TeachersComponent {
  teacher$!: Observable<Teacher[]>;

  constructor(
    private teachersServices: TeachersService,
    public dialog: MatDialog
  ) {
    this.teacher$ = this.teachersServices.getTeachers$();
  }

  openDialog() {
    const teacher: Teacher = {
      id: 0,
      firstName: '',
      lastName: '',
    };

    const dialogRef = this.dialog.open(DialogTeachersComponent, {
      width: '500px',
      data: { message: 'Crear profesor', teacher: teacher, isUpdate: false },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createTeacher(result.data);
      }
    });
  }

  openDialogEdit(id: number) {
    this.teachersServices.getTeacher$(id).subscribe((teacher: Teacher) => {
      const dialogRef = this.dialog.open(DialogTeachersComponent, {
        width: '500px',
        data: { message: 'Editar profesor', teacher: teacher, isUpdate: true },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.updateTeacher(id, result.data);
        }
      });
    });
  }

  createTeacher(data: any) {
    this.teachersServices.createTeacher$(data).subscribe({
      next: (data: any) => {
        this.teacher$ = this.teacher$.pipe(
          map((teachers) => [...teachers, { ...data }])
        );
      },
    });
  }
  updateTeacher(id: number, teacher: Teacher) {
    this.teachersServices.updateTeacher$(id, teacher).subscribe({
      next: (data: any) => {
        this.teacher$ = this.teacher$.pipe(
          map((teachers) => teachers.map((t) => (t.id === id ? data : t)))
        );
      },
    });
  }

  deleteTeacher(id: number) {
    this.teachersServices.deleteTeacher$(id).subscribe({
      next: () => {
        this.teacher$ = this.teacher$.pipe(
          map((teachers) => teachers.filter((t) => t.id !== id))
        );
      },
    });
  }

  searchTeacher(search: any) {
    this.teacher$ = this.teacher$.pipe(
      map((teachers) =>
        teachers.filter(
          (t) =>
            t.firstName.toLowerCase().includes(search.target.value.toLowerCase()) ||
            t.lastName.toLowerCase().includes(search.target.value.toLowerCase())
        )
      )
    );
  }
}
