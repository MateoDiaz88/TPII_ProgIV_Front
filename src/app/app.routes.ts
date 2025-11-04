import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard/auth-guard';

export const routes: Routes = [
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
        
    },
    {
        path: 'mi-perfil',
        loadComponent: () => import('./pages/mi-perfil/mi-perfil').then(m => m.MiPerfil),
        canActivate: [AuthGuard]
    },
    {
        path: '',
        loadComponent: () => import('./pages/publicaciones/publicaciones').then(m => m.Publicaciones),
    }

];
