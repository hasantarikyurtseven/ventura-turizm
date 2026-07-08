import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { BlogService, BlogPost } from '../../core/blog.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  standalone: false,
})
export class BlogDetailComponent implements OnInit {
  post: BlogPost | null = null;
  isLoading = true;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private blogService: BlogService,
    private meta: Meta,
    private titleService: Title,
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.blogService.getPostBySlug(slug).subscribe({
      next: post => {
        this.isLoading = false;
        if (!post) { this.notFound = true; return; }
        this.post = post;
        const title = post.metaTitle || post.title;
        const description = post.metaDescription || post.excerpt;
        this.titleService.setTitle(`${title} – Ventura Turizm Blog`);
        this.meta.updateTag({ name: 'description', content: description || '' });
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: description || '' });
        this.meta.updateTag({ property: 'og:type', content: 'article' });
        if (post.coverImage) this.meta.updateTag({ property: 'og:image', content: post.coverImage });
        if (post.publishedAt) this.meta.updateTag({ property: 'article:published_time', content: post.publishedAt });
        if (post.category) this.meta.updateTag({ property: 'article:section', content: post.category });
      },
      error: () => { this.isLoading = false; this.notFound = true; }
    });
  }

  formatDate(d: string) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
