import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Course } from 'src/app/interfaces/courses';
import { StudentEnrollments } from 'src/app/interfaces/student-enrollments';
import { Student } from 'src/app/interfaces/students';
import { CoursesService } from 'src/app/core/services/courses.service';
import { StudentEnrollmentsService } from 'src/app/core/services/student-enrollments.service';
import { StudentsService } from 'src/app/core/services/students.service';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss'],
})
export class StudentDetailComponent {
  idStudent: number;
  student$: Observable<Student> = this.studentsService.getStudent(
    this.activatedRoute.snapshot.params['id']
  );
  courses$: Observable<Course[]> = this.courseServices.getCourses$();

  studentSource$: Observable<Student[]> = this.student$.pipe(
    map((student) => [student] as Student[])
  );

  enroll$: Observable<StudentEnrollments[]> =
    this.sEnroll.getStudentEnrollments$();

  studentEnrollment: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private studentsService: StudentsService,
    private courseServices: CoursesService,
    private sEnroll: StudentEnrollmentsService,
    private fb: FormBuilder
  ) {
    this.idStudent = parseInt(this.activatedRoute.snapshot.params['id']);

    this.sEnroll.loadStudentEnrollments$(this.idStudent);

    this.studentEnrollment = this.fb.group({
      student_id: [this.idStudent, [Validators.required]],
      course_id: ['', [Validators.required]],
    });
  }

  onSubmit() {
    let enrollment = {
      student_id: this.studentEnrollment.value.student_id,
      course_id: this.studentEnrollment.value.course_id.id,
      course_name: this.studentEnrollment.value.course_id.name,
      date: this.studentEnrollment.value.course_id.date,
      hour: this.studentEnrollment.value.course_id.hour,
    };

    this.createStudentEnrollment(enrollment);
  }

  createStudentEnrollment(studentEnrollment: StudentEnrollments) {
    this.enroll$
      .pipe(
        map((enrollment) =>
          enrollment.filter((enroll) =>
            this.existeCurso(enroll, studentEnrollment)
          )
        )
      )
      .subscribe((data) => {
        if (data.length === 0) {
          this.crearYSumarEnrollment(studentEnrollment);
        }
      });
  }

  crearYSumarEnrollment(studentEnrollment: StudentEnrollments) {
    this.sEnroll
      .createStudentEnrollment$(studentEnrollment)
      .subscribe({
        next: (data) => {
          this.enroll$ = this.enroll$.pipe(
            map((enroll) => enroll.concat(studentEnrollment))
          );
        },
      });
  }

  existeCurso(inscripto: StudentEnrollments, aInscribir: StudentEnrollments) {
    return (
      inscripto.course_id === aInscribir.course_id ||
      inscripto.course_name === aInscribir.course_name
    );
  }

  deleteCourse(id: number) {
    console.log(id);

    this.sEnroll.deleteStudentEnrollment$(id).subscribe({
      next: (data) => {
        console.log(data);

        this.enroll$ = this.enroll$.pipe(
          map((enroll) => enroll.filter((enroll) => enroll.id !== id))
        );
      },
    });
  }
}
