import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withFetch, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { LoginModalComponent } from './auth/login/login-modal.component';
import { FlightResultsComponent } from './features/flight-results/flight-results.component';
import { TurkishDateAdapter, TURKISH_DATE_FORMATS } from './core/date-format';
import { LocationSelectorComponent } from './shared/location-selector/location-selector.component';
import { ContractModalComponent } from './shared/contract-modal/contract-modal.component';
import { FlightSearchLoadingDialogComponent } from './shared/flight-search-loading-dialog/flight-search-loading-dialog.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { BookingComponent } from './features/booking/booking.component';
import { PaymentComponent } from './features/payment/payment.component';
import { PaymentCallbackComponent } from './features/payment-callback/payment-callback.component';
import { MyReservationsComponent } from './features/my-reservations/my-reservations.component';
import { ProfileComponent } from './features/profile/profile.component';
import { BlogComponent } from './features/blog/blog.component';
import { BlogDetailComponent } from './features/blog-detail/blog-detail.component';
import { HelpComponent } from './features/help/help.component';
import { API_BASE_URL_PROVIDER } from './core/api-url.token';
import { AuthInterceptor } from './core/auth.interceptor';

registerLocaleData(localeTr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    LoginModalComponent,
    FlightResultsComponent,
    LocationSelectorComponent,
    ContractModalComponent,
    FlightSearchLoadingDialogComponent,
    VerifyEmailComponent,
    BookingComponent,
    PaymentComponent,
    PaymentCallbackComponent,
    MyReservationsComponent,
    ProfileComponent,
    BlogComponent,
    BlogDetailComponent,
    HelpComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptorsFromDi()), // withInterceptorsFromDi → HTTP_INTERCEPTORS token'larını aktif eder
    { provide: DateAdapter, useClass: TurkishDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: TURKISH_DATE_FORMATS },
    API_BASE_URL_PROVIDER,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'tr-TR' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
