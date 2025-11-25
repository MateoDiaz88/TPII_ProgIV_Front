import { AfterViewChecked, AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartType } from "chart.js/auto";
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  PolarAreaController,
  RadialLinearScale
} from 'chart.js';
import { BaseChartDirective,  } from "ng2-charts"
import { StatsService } from '../../services/stats-service/stats-service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { VideoFondo } from '../../components/video-fondo/video-fondo';


Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  PolarAreaController,
  RadialLinearScale
);
@Component({
  selector: 'app-estadisticas',
  imports: [ReactiveFormsModule, VideoFondo, BaseChartDirective],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class Estadisticas implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private statsService = inject(StatsService);
  publicacionesChartData: ChartData<"bar"> = { labels: [], datasets: [] };
  comentariosChartData: ChartData<"pie"> = { labels: [], datasets: [] };
  comentariosPublicacionChartData: ChartData<"polarArea"> = { labels: [], datasets: [] };
  @ViewChild('pubChart') publicacionesChart?: BaseChartDirective;
  @ViewChild('comChart') comentariosChart?: BaseChartDirective;
  @ViewChild('comPubChart') comentariosPubChart?: BaseChartDirective;

  statsForm = this.fb.group({
    start: ['', Validators.required],
    end: ['', Validators.required],
  }, {
    validators: this.validarFechas
  })

  validarFechas(control: AbstractControl): ValidationErrors | null {
    const start = control.get('start')?.value;
    const end = control.get('end')?.value;
    if (!start || !end) return null;

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate > endDate) {
      control.get('end')?.setErrors({ invalidRange: true });
      return { invalidRange: true }; // se retorna el error
    }


    return null;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.publicacionesChart?.chart?.update();
      this.comentariosChart?.chart?.update();
      this.comentariosPubChart?.chart?.update();
    }, 100);
  }
  ngOnInit() {
    this.publicacionesChartData = {
      labels: ['Cargando...'],
      datasets: [{ data: [0], label: 'Publicaciones' }]
    };


    this.comentariosChartData = {
      labels: ['Cargando...'],
      datasets: [{ data: [0], label: 'Comentarios' }]
    };

    this.comentariosPublicacionChartData = {
      labels: ['Cargando...'],
      datasets: [{ data: [0], label: 'Comentarios por publicación' }]
    };
  }

  private generarColores(cantidad: number): string[] {
    return Array.from({ length: cantidad }, (_, i) =>
      `hsl(${(i * 360) / cantidad}, 70%, 50%)`
    );
  }
  getPublicacionesPorUsuario() {
    const statsData = this.statsForm.getRawValue();
    if (!statsData.start || !statsData.end) return;

    this.statsService.getPublicacionesPorUsuario(statsData.start, statsData.end)
      .subscribe(res => {
        console.log(res);
        this.publicacionesChartData = {
          labels: res.map(r => r.userId),
          datasets: [
            {
              data: res.map(r => r.totalPublicaciones),
              label: 'Publicaciones',
              backgroundColor: this.generarColores(res.length)
            }
          ]
        };
        this.publicacionesChart?.chart?.update();
      });
  }

  getComentariosPorUsuario() {
    const statsData = this.statsForm.getRawValue();

    if (!statsData.start || !statsData.end) return;

    const start = statsData.start;
    const end = statsData.end;

    this.statsService.getComentariosPorUsuario(start, end).subscribe(res => {
      console.log(res);
      this.comentariosChartData = {
        labels: res.map(r => r.userId),
        datasets: [
          { data: res.map(r => r.totalComentarios), label: 'Comentarios', backgroundColor: this.generarColores(res.length) }
        ]
      };
      this.comentariosChart?.chart?.update();
    });
  }

  getComentariosPorPublicacion() {
    const statsData = this.statsForm.getRawValue();

    if (!statsData.start || !statsData.end) return;

    const start = statsData.start;
    const end = statsData.end;

    this.statsService.getComentariosPorPublicacion(start, end).subscribe(res => {
      console.log(res);
      this.comentariosPublicacionChartData = {
        labels: res.map(r => r.titulo),
        datasets: [
          { data: res.map(r => r.totalComentarios), label: 'Comentarios por publicacion', backgroundColor: this.generarColores(res.length) }
        ]
      };
      this.comentariosPubChart?.chart?.update();
    });
  }

}
