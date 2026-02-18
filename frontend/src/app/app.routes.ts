import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import {UserDetailComponent} from './pages/user-detail/user-detail.component';
import { MapComponent } from './pages/map/map.component';
import { SignalsDemoComponent } from './pages/signals-demo/signals-demo.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { path: 'map', component: MapComponent },
  { path: 'signals', component: SignalsDemoComponent },
  { path: '**', redirectTo: '' }
];
