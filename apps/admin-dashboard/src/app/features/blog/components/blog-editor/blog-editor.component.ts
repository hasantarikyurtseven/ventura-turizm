import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog-editor',
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.scss']
})
export class BlogEditorComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  blogId = '';
  isLoading = false;
  isSaving = false;

  quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{ align: [] }],
      ['clean']
    ]
  };

  constructor(private fb: FormBuilder, private blogService: BlogService,
              public router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      excerpt: [''],
      content: ['', Validators.required],
      coverImage: [''],
      category: [''],
      tags: [''],
      status: ['draft'],
      author: [''],
      metaTitle: [''],
      metaDescription: [''],
    });

    this.blogId = this.route.snapshot.paramMap.get('id') || '';
    if (this.blogId) {
      this.isEdit = true;
      this.isLoading = true;
      this.blogService.getBlog(this.blogId).subscribe({
        next: b => {
          this.form.patchValue({ ...b, tags: (b.tags || []).join(', ') });
          this.isLoading = false;
        }
      });
    }
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSaving = true;
    const val = this.form.value;
    const dto = { ...val, tags: val.tags ? val.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [] };

    const req = this.isEdit
      ? this.blogService.updateBlog(this.blogId, dto)
      : this.blogService.createBlog(dto);

    req.subscribe({
      next: () => { this.isSaving = false; this.router.navigate(['/blog']); },
      error: () => { this.isSaving = false; }
    });
  }

  get f() { return this.form.controls; }
}
