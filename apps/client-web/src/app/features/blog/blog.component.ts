import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BlogService, BlogPost } from '../../core/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  standalone: false,
})
export class BlogComponent implements OnInit {
  posts: BlogPost[] = [];
  total = 0;
  page = 1;
  limit = 9;
  categories: string[] = [];
  selectedCategory = '';
  isLoading = true;

  constructor(
    private blogService: BlogService,
    private meta: Meta,
    private titleService: Title,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Blog – Ventura Turizm');
    this.meta.updateTag({ name: 'description', content: 'Seyahat ipuçları, destinasyon rehberleri ve havacılık haberleri için Ventura Turizm Blog sayfasını ziyaret edin.' });
    this.meta.updateTag({ property: 'og:title', content: 'Blog – Ventura Turizm' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    this.blogService.getCategories().subscribe(c => this.categories = c);
    this.load();
  }

  load() {
    this.isLoading = true;
    this.blogService.getPosts(this.page, this.limit, this.selectedCategory || undefined)
      .subscribe({ next: r => { this.posts = r.data; this.total = r.total; this.isLoading = false; }, error: () => { this.isLoading = false; } });
  }

  selectCategory(cat: string) { this.selectedCategory = cat; this.page = 1; this.load(); }
  prevPage() { if (this.page > 1) { this.page--; this.load(); } }
  nextPage() { if (this.page * this.limit < this.total) { this.page++; this.load(); } }

  get totalPages() { return Math.ceil(this.total / this.limit); }

  formatDate(d: string) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
