import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService, Blog } from '../../services/blog.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  total = 0;
  page = 1;
  limit = 20;
  search = '';
  statusFilter = '';
  isLoading = false;

  displayedColumns = ['title', 'category', 'status', 'viewCount', 'publishedAt', 'actions'];

  get totalPages() { return Math.ceil(this.total / this.limit); }

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit() { this.load(); }

  load() {
    this.isLoading = true;
    this.blogService.getBlogs(this.page, this.limit, this.search || undefined, this.statusFilter || undefined)
      .subscribe({ next: r => { this.blogs = r.data; this.total = r.total; this.isLoading = false; }, error: () => { this.isLoading = false; } });
  }

  onSearch() { this.page = 1; this.load(); }
  onPageChange(p: number) { this.page = p; this.load(); }

  create() { this.router.navigate(['/blog/create']); }
  edit(id: string) { this.router.navigate(['/blog/edit', id]); }

  delete(id: string) {
    if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) return;
    this.blogService.deleteBlog(id).subscribe(() => this.load());
  }

  statusLabel(s: string) { return s === 'published' ? 'Yayında' : 'Taslak'; }
  statusColor(s: string) { return s === 'published' ? 'primary' : 'warn'; }
}
