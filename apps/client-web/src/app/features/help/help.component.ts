import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { HelpService, FaqItem } from '../../core/help.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  standalone: false,
})
export class HelpComponent implements OnInit {
  faqs: FaqItem[] = [];
  categories: string[] = [];
  contactForm!: FormGroup;
  isSending = false;
  isLoadingFaqs = true;

  constructor(
    private helpService: HelpService,
    private fb: FormBuilder,
    private toast: ToastService,
    private meta: Meta,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Yardım Merkezi – Ventura Turizm');
    this.meta.updateTag({ name: 'description', content: 'Sık sorulan sorular, uçuş bilgileri ve daha fazlası için Ventura Turizm Yardım Merkezi\'ni ziyaret edin. Bizimle iletişime geçin.' });

    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(20)]],
    });

    this.helpService.getFaqs().subscribe({
      next: faqs => {
        this.faqs = faqs;
        this.categories = [...new Set(faqs.map(f => f.category).filter(Boolean))];
        this.isLoadingFaqs = false;
      },
      error: () => { this.isLoadingFaqs = false; }
    });
  }

  scrollTo(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  faqsByCategory(cat: string) { return this.faqs.filter(f => f.category === cat); }

  submitContact() {
    if (this.contactForm.invalid) { this.contactForm.markAllAsTouched(); return; }
    this.isSending = true;
    this.helpService.submitContact(this.contactForm.value).subscribe({
      next: () => {
        this.isSending = false;
        this.toast.success('Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağız.');
        this.contactForm.reset();
      },
      error: () => {
        this.isSending = false;
        this.toast.error('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    });
  }

  get f() { return this.contactForm.controls; }
}
