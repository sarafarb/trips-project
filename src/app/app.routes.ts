import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login')
        .then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register')
        .then(m => m.Register)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home')
        .then(m => m.Home),
    children: [
      {
        path: '',
        redirectTo: 'trips-all',
        pathMatch: 'full'
      },
      {
        path: 'trips-all',
        loadComponent: () =>
          import('./pages/trips/trips-all/trips-all')
            .then(m => m.TripsAll)
      },
      {
        path: 'my-trips',
        loadComponent: () =>
          import('./pages/trips/trips-my/trips-my')
            .then(m => m.MyTrips)
      }
    ]
  },
  
  // הראוט של ה-trip הועבר לכאן, לרמה הראשיות!
  {
    path: 'trip/:id',
    loadComponent: () =>
      import('./pages/trips/trip-details/trip-details')
        .then(m => m.TripDetails)
  },

  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found')
        .then(m => m.NotFound)
  }
];