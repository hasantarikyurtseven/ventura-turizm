import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpAdminService, Faq, ContactMessage } from '../../services/help-admin.service';

@Component({
  selector: 'app-help-admin',
  templateUrl: './help-admin.component.html',
  styleUrls: ['./help-admin.component.scss']
})
export class HelpAdminComponent implements OnInit {
  activeTab: 'faqs' | 'messages' = 'faqs';

  // FAQs
  faqs: Faq[] = [];
  faqForm!: FormGroup;
  editingFaqId: string | null = null;
  showFaqForm = false;
  faqCategories: string[] = [];

  // Messages
  messages: ContactMessage[] = [];
  messageTotal = 0;
  messagePage = 1;
  messageStatusFilter = '';
  selectedMessage: ContactMessage | null = null;
  messageStats = { total: 0, new: 0, read: 0, replied: 0 };
  msgDisplayedColumns = ['name', 'subject', 'status', 'createdAt', 'actions'];

  isLoadingFaqs = false;
  isLoadingMsgs = false;

  constructor(private helpService: HelpAdminService, private fb: FormBuilder) {}

  ngOnInit() {
    this.faqForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      category: ['Genel'],
      order: [0],
      active: [true],
    });
    this.loadFaqs();
    this.loadMessageStats();
  }

  // --- FAQs ---
  loadFaqs() {
    this.isLoadingFaqs = true;
    this.helpService.getFaqs().subscribe({ next: r => { this.faqs = r; this.faqCategories = [...new Set(r.map(f => f.category))]; this.isLoadingFaqs = false; }, error: () => { this.isLoadingFaqs = false; } });
  }

  openFaqForm(faq?: Faq) {
    this.editingFaqId = faq?._id || null;
    this.faqForm.reset({ question: '', answer: '', category: 'Genel', order: 0, active: true });
    if (faq) this.faqForm.patchValue(faq);
    this.showFaqForm = true;
  }

  saveFaq() {
    if (this.faqForm.invalid) { this.faqForm.markAllAsTouched(); return; }
    const req = this.editingFaqId
      ? this.helpService.updateFaq(this.editingFaqId, this.faqForm.value)
      : this.helpService.createFaq(this.faqForm.value);
    req.subscribe({ next: () => { this.showFaqForm = false; this.loadFaqs(); } });
  }

  deleteFaq(id: string) {
    if (!confirm('Bu soruyu silmek istediğinizden emin misiniz?')) return;
    this.helpService.deleteFaq(id).subscribe(() => this.loadFaqs());
  }

  faqsByCategory(cat: string) { return this.faqs.filter(f => f.category === cat); }

  // --- Messages ---
  loadMessageStats() { this.helpService.getMessageStats().subscribe(s => this.messageStats = s); }
  loadMessages() {
    this.isLoadingMsgs = true;
    this.helpService.getMessages(this.messagePage, 20, this.messageStatusFilter || undefined)
      .subscribe({ next: r => { this.messages = r.data; this.messageTotal = r.total; this.isLoadingMsgs = false; }, error: () => { this.isLoadingMsgs = false; } });
  }

  openMessage(msg: ContactMessage) {
    this.selectedMessage = msg;
    if (msg.status === 'new') this.markStatus(msg._id, 'read');
  }

  markStatus(id: string, status: string, note?: string) {
    this.helpService.updateMessageStatus(id, status, note).subscribe(() => { this.loadMessages(); this.loadMessageStats(); if (this.selectedMessage?._id === id) this.selectedMessage = { ...this.selectedMessage!, status }; });
  }

  onTabChange(tab: 'faqs' | 'messages') {
    this.activeTab = tab;
    if (tab === 'messages' && this.messages.length === 0) this.loadMessages();
  }

  statusLabel(s: string) { return { new: 'Yeni', read: 'Okundu', replied: 'Yanıtlandı' }[s] || s; }
  statusClass(s: string) { return { new: 'status-new', read: 'status-read', replied: 'status-replied' }[s] || ''; }
}
