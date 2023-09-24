import { Component } from '@angular/core';
import { Alumnos } from 'src/app/intefaces/alumnos';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.scss'],
})
export class ListaAlumnosComponent {
  alumnos: Alumnos[] = [
    {
      nombres: 'Juan Sebastian',
      apellidos: 'González',
      fechaInscripcion: new Date('2021-06-30'),
    },
    {
      nombres: 'María de los Angeles',
      apellidos: 'Gutierrez',
      fechaInscripcion: new Date('2022-02-15'),
    },
    {
      nombres: 'Pedro Leandro',
      apellidos: 'Perez',
      fechaInscripcion: new Date('2021-01-01'),
    },
    {
      nombres: 'Luisa Fernanda',
      apellidos: 'González',
      fechaInscripcion: new Date('2022-06-10'),
    },
    {
      nombres: 'Miguel Agustin',
      apellidos: 'Albarracin',
      fechaInscripcion: new Date('2021-12-30'),
    },
    {
      nombres: 'Cristina Emmanuel',
      apellidos: 'Suarez Garcia',
      fechaInscripcion: new Date('2021-10-01'),
    }
  ];

  fechaDePremio = new Date('2022-01-01');


  estaDentroDelPremio(fecha: Date) {
    return this.fechaDePremio > fecha;
  }
}
