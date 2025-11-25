import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard/auth-guard';
import { RoleGuard } from './guards/role-guard/role-guard';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then(m => m.Home)
    },
    {
        path: 'registro',
        loadComponent: () => import('./pages/registro/registro').then(m => m.Registro),
        
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },
    {
        path: 'publicaciones',
        loadComponent: () => import("./pages/publicaciones/publicaciones").then(m => m.Publicaciones),
        canActivate: [AuthGuard]
        
    },
    {
        path: "publicacion/:id",
        loadComponent: () => import("./pages/publicacion/publicacion").then(m => m.Publicacion)
    },
    {
        path: "dashboard/usuarios",
        loadComponent: () => import("./pages/usuarios/usuarios").then(m => m.Usuarios),
        canActivate: [RoleGuard],
        data: {
            role: 'administrador'
        }

    },
    {
        path: "dashboard/estadisticas",
        loadComponent: () => import("./pages/estadisticas/estadisticas").then(m => m.Estadisticas),
        canActivate: [RoleGuard],
        data: {
            role: 'administrador'
        }
    }
    ,
    {
        path: 'mi-perfil',
        loadComponent: () => import('./pages/mi-perfil/mi-perfil').then(m => m.MiPerfil),
        canActivate: [AuthGuard]
    },
    {
        path: '',
        loadComponent: () => import('./pages/cargando/cargando').then(m => m.Cargando),
    }

];
