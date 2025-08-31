import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-image-preview',
  imports: [],
  templateUrl: './image-preview.html',
  styleUrl: './image-preview.css',
})
export class ImagePreview implements OnInit {
  @Input() fileId!: number;
  @Input() width!: string;
  @Input() height!: string;
  @Input() fileName!: string;
  @Input() fileSize!: number;


  public imageUrl: string | null = null;
  public showImagePreviewModal: boolean = false;

  private documentService = inject(DocumentService);

  ngOnInit(): void {
    this.getImageUrl(this.fileId);
  }

  getImageUrl(id: number){
    this.documentService.downloadFile(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      this.imageUrl = url;
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

}
