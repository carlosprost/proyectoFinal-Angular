import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable } from 'src/app/interfaces/data-table';
import { Teacher } from 'src/app/interfaces/teachers';

@Component({
  selector: 'app-table-teachers',
  templateUrl: './table-teachers.component.html',
  styleUrls: ['./table-teachers.component.scss']
})
export class TableTeachersComponent {
  columnTable: DataTable[] = [
    {
    label: 'Nombre Completo',
    def: 'fullName',
    key: 'fullName',
    dataType: 'string',
  },
  {
    label: 'Acciones',
    def: 'actions',
    key: 'actions',
  }];
  @Input() data!: Teacher[];
  columns!: string[];

  @Output() editElement: EventEmitter<number> = new EventEmitter();
  @Output() deleteElement: EventEmitter<number> = new EventEmitter();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setColumns()
    
  }
  setColumns() {
    this.columns = this.columnTable.map((column: any) => column.key);
  }

  teacherDetail(id: number) {
    this.router.navigate(['dashboard', 'teacher', 'detail', id])
  }
}
