import { Routes } from '@angular/router';
import { ChatComponent } from './features/chat/chat';

export const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent
  },
  {
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full'
  }
];