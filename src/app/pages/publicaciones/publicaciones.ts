import { AfterViewInit, Component, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { VideoFondo } from '../../components/video-fondo/video-fondo';
import { Publicacion } from '../../components/publicacion/publicacion';
import { PublicacionService } from '../../services/publicacion-service/publicacion-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth-service/auth-service';
import { animate } from 'motion';
import { debounceTime, Subject } from 'rxjs';
import { ScrollTop } from '../../components/scroll-top/scroll-top';

@Component({
  selector: 'app-publicaciones',
  imports: [VideoFondo, Publicacion, ReactiveFormsModule, ScrollTop],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones implements AfterViewInit, OnInit {
  private publicacionService = inject(PublicacionService);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  publicaciones = this.publicacionService.publicaciones;
  cargando = this.publicacionService.cargando;
  hayMas = this.publicacionService.hayMas;
  selectedFile: File | null = null;
  currentUser = this.auth.currentUser;
  imagenPreview = signal<string | null | ArrayBuffer>(null);
  //private scrollSubject = new Subject<void>();

  /*
  
  constructor() {
    this.cargaIncial();

    this.scrollSubject.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.cargarMas();
    })
  }
  
  */


  // signals para poder paginar las publicaciones
  orden = signal<"fecha" | "likes">("fecha");
  offset = signal(0);
  limit = signal(5);
  userId = signal<string | null>(null);

  ngOnInit(){
    this.cargaIncial();
  }

  ngAfterViewInit() {
    animate(".animation", { opacity: [0, 1], transform: ["translateY(40px)", "translateY(0)"] }, { duration: 0.5, ease: "easeOut" });

  }

  /*
  
  @HostListener("window:scroll", [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;


    const margen = 200; // 200px antes del fondo
    if (scrollTop + windowHeight >= documentHeight - margen) {
      this.scrollSubject.next();
    }
  }
  
  */




  publicacionForm = this.fb.group({
    titulo: ['', [Validators.maxLength(100)]],
    contenido: ['', [Validators.maxLength(1000)]],
  });


  private cargaIncial() {
    this.publicacionService.cargarPublicaciones(
      this.orden(), 
      0, 
      this.limit(), 
      this.userId() || undefined
    );
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.match(/image\/(jpg|jpeg|png)/)) {
        Swal.fire({
          icon: 'error',
          title: 'Tipo de archivo inválido',
          text: 'Solo se permiten imágenes (JPG, PNG)',
          confirmButtonColor: '#d33',
          background: "#0D0D0D",
          color: "white",
          width: '400px',
          padding: '2em'
        });
        input.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo muy grande',
          text: 'La imagen debe pesar menos de 5MB',
          confirmButtonColor: '#d33',
          background: "#0D0D0D",
          color: "white",
          width: '400px',
          padding: '2em'
        });

        input.value = '';
        return;
      }
      this.selectedFile = file;


      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview.set(reader.result);
      };

      reader.readAsDataURL(this.selectedFile);
    }

  }

  onOrderChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const valor = select.value as "fecha" | "likes";

    this.cambiarOrden(valor);
  }

  cambiarOrden(nuevoOrden: "fecha" | "likes") {

    this.publicacionService.reiniciarPublicaciones();

    this.orden.set(nuevoOrden);

    this.offset.set(0);
    this.publicacionService.cargarPublicaciones(this.orden(), this.offset(), this.limit(), this.userId() || undefined);
  }

 /*
 
 cargarMas() {
   if (this.cargando() || !this.hayMas()) {
     return;
   }

   const nuevoOffset = this.offset() + this.limit();
   this.offset.set(nuevoOffset);

   this.publicacionService.cargarPublicaciones(this.orden(), this.offset(), this.limit(), this.userId() || undefined);
 }
 
 */
  

  siguientePagina() {
    this.offset.update(v => v + this.limit());
    this.publicacionService.cargarPublicaciones(this.orden(), this.offset(), this.limit(), this.userId() || undefined);
  }
  
  anteriorPagina(){
    this.offset.update(v => Math.max(0, v - this.limit()));
    // Le resto al valor anterior, el limite. Pero no puede ser negativo, entonces con Math.max lo convierto en 0
    this.publicacionService.cargarPublicaciones(this.orden(), this.offset(), this.limit(), this.userId() || undefined);
  }
  

  async crearPublicacion() {
    const contenido = this.publicacionForm.getRawValue().contenido;
    const titulo = this.publicacionForm.getRawValue().titulo;
    if (!contenido && !this.selectedFile && !titulo) {
      Swal.fire({
        icon: 'warning',
        title: 'Publicación vacía',
        text: 'Debes escribir algo o subir una imagen antes de publicar.',
        confirmButtonColor: '#d33',
        background: "#0D0D0D",
        color: "white",
        width: '400px',
        padding: '2em'
      });
      return;
    }
    try {
      const formData = new FormData();

      if (!titulo) {
        formData.append("titulo", "");
      } else {
        formData.append("titulo", titulo);
      }

      if (!contenido) {
        formData.append("contenido", "");
      } else {
        formData.append("contenido", contenido);
      }

      formData.append("fechaPublicacion", new Date().toISOString());

      if (this.selectedFile) {
        formData.append("imagen", this.selectedFile);
      } else {
        formData.append("imagen", "");
      }
      
      this.publicacionService.crearPublicacion(formData, this.offset());

      this.publicacionForm.reset();
      this.selectedFile = null;
      this.imagenPreview.set(null);
    } catch (error: any) {
      console.error(error);
      if (error.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Campos inválidos',
          text: 'Por favor ingresa una imagen o contenido válido.',
          confirmButtonColor: '#d33',
          background: "#0D0D0D",
          color: "white",
          width: '400px',
          padding: '2em'
        });
      }
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagenPreview.set(null);
  }

}
