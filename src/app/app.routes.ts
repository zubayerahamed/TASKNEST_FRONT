// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Login } from './pages/Authentication/login/login';
import { Layouts } from './layouts/layouts';
import { Today } from './pages/today/today';
import { Register } from './pages/Authentication/register/register';
import { ForgotPassword } from './pages/Authentication/forgot-password/forgot-password';
import { ResetPassword } from './pages/Authentication/reset-password/reset-password';
import { AuthGuard } from './core/guards/auth.guard';
import { Project } from './pages/project/project';
import { Upcoming } from './pages/upcoming/upcoming';
import { Completed } from './pages/completed/completed';
import { WorkspaceSettings } from './pages/workspaces/workspace-settings/workspace-settings';
import { ProjectSettings } from './pages/project/project-settings/project-settings';


export const routes: Routes = [

  {
    path: '',
    component: Layouts,
    canActivate: [AuthGuard],
    children:[
      {
        path: 'today',
        component: Today,
      },
      {
        path: 'workspace-settings',
        component: WorkspaceSettings
      },
      {
        path: 'project/:projectId',
        component: Project,
      },
      {
        path: 'project-settings/:projectId',
        component: ProjectSettings,
      },
      {
        path: 'upcoming',
        component: Upcoming,
      },
      {
        path: 'completed',
        component: Completed,
      },
    ]
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,
  },
  {
    path: 'reset-password',
    component: ResetPassword,
  }


  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'login', component: Login },
  // { path: 'sidebar', component: SideNavBar },
  // { path: 'dashboard', component: Dashboard },
];
