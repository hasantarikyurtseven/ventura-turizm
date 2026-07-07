import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { FlightResultsComponent } from './features/flight-results/flight-results.component';
import { AirsearchTestComponent } from './features/airsearch-test/airsearch-test.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { BookingComponent } from './features/booking/booking.component';
import { PaymentComponent } from './features/payment/payment.component';
import { PaymentCallbackComponent } from './features/payment-callback/payment-callback.component';
import { MyReservationsComponent } from './features/my-reservations/my-reservations.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'uye-ol', component: RegisterComponent }, // Alternative route
  { path: 'login', component: LoginComponent },
  { path: 'giris', component: LoginComponent }, // Alternative route
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'eposta-dogrula', component: VerifyEmailComponent }, // Alternative route
  { path: 'flight-results', component: FlightResultsComponent },
  { path: 'ucak-sonuclari', component: FlightResultsComponent }, // Alternative route
  { path: 'booking', component: BookingComponent },
  { path: 'rezervasyon', component: BookingComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'odeme', component: PaymentComponent },
  { path: 'payment/callback', component: PaymentCallbackComponent },
  { path: 'odeme/callback', component: PaymentCallbackComponent },
  { path: 'my-reservations', component: MyReservationsComponent, canActivate: [AuthGuard] },
  { path: 'rezervasyonlarim', component: MyReservationsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profil', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'airsearch-test', component: AirsearchTestComponent },
  { path: 'biletbank/airsearch-test', component: AirsearchTestComponent },
  // Eski /auth/login URL'lerini /login'e yönlendir
  { path: 'auth/login', redirectTo: '/login' },
  { path: 'auth/register', redirectTo: '/register' },
  { path: 'auth/verify-email', redirectTo: '/verify-email' },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
