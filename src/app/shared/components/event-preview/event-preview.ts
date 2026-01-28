import { Component, inject, Input } from '@angular/core';
import { ImagePreview } from "../image-preview/image-preview";
import { EventChecklist, EventDto } from '../../../core/models/event.model';
import { EventService } from '../../../core/services/event.service';
import { AlertService } from '../../../core/services/alert.service';
import { SidebarStateService } from '../../../core/services/sidebar-state.service';
import { DocumentService } from '../../../core/services/document.service';
import { Document } from '../../../core/models/attached-file.model';
import { EditEvent } from '../../../pages/events/edit-event/edit-event';
import { EventModalStateService } from '../../../core/services/event-modal-state.service';

@Component({
  selector: 'app-event-preview',
  imports: [ImagePreview, EditEvent],
  templateUrl: './event-preview.html',
  styleUrl: './event-preview.css',
})
export class EventPreview {
  @Input() events!: EventDto[];
  @Input() ignoreCompleted!: boolean;

  private eventService = inject(EventService);
  private alertService = inject(AlertService);
  private sidebarStateService = inject(SidebarStateService);
  private documentService = inject(DocumentService);
  private eventModalStateService = inject(EventModalStateService);

  deleteEvent(event: EventDto){
    this.eventService.deleteEvent(event.id).subscribe({
      next: (resData) => {
        this.alertService.success("Success!", "Event deleted successfully");

        const index = this.events.findIndex(e => e.id === event.id);
        if (index > -1) {
          this.events.splice(index, 1);
        }

        this.sidebarStateService.updateSidebarProjects(null);
        this.sidebarStateService.updatePageCounts(null);
        //this.todayPageStageService.updateTodayPage(null);
        //this.projectPageStateService.updateProjectPage(null);
      },
      error: (err) => {
        console.log(err);
        this.alertService.error("Error!", "Event deletion failed");
      }
    });
  }

  completeEvent(event: EventDto) {
    if (event.isCompleted) {
      return; // Already completed
    }

    this.eventService.markCompleteEvent(event.id).subscribe({
      next: (response) => {
        event.isCompleted = true;

        const index = this.events.findIndex(e => e.id === event.id);
        if (index > -1) {
          this.events.splice(index, 1);
        }

        this.alertService.success('Success!', 'Event marked as complete.');
        this.sidebarStateService.updateSidebarProjects(null);
        this.sidebarStateService.updatePageCounts(null);
        // this.todayPageStageService.updateTodayPage(null);
        // this.projectPageStateService.updateProjectPage(null);
      },
      error: (error) => {
        console.error('Error completing event:', error);
        this.alertService.error('Error', 'Failed to mark event as complete.');
      },
    });
  }

  inCompleteEvent(event: EventDto) {
    if (!event.isCompleted) {
      return; // Already incompleted
    }

    this.eventService.markInCompleteEvent(event.id).subscribe({
      next: (response) => {
        event.isCompleted = false;

        const index = this.events.findIndex(e => e.id === event.id);
        if (index > -1) {
          this.events.splice(index, 1);
        }

        this.alertService.success('Success!', 'Event marked as incomplete.');
        this.sidebarStateService.updateSidebarProjects(null);
        this.sidebarStateService.updatePageCounts(null);
        // this.todayPageStageService.updateTodayPage(null);
        // this.projectPageStateService.updateProjectPage(null);
      },
      error: (error) => {
        console.error('Error completing event:', error);
        this.alertService.error('Error', 'Failed to mark event as incomplete.');
      },
    });
  }

  toggleChecklist(checklist: EventChecklist) {
    if (checklist.isCompleted) {
      this.eventService.markInCompleteEventChecklist(checklist.id).subscribe({
        next: (response) => {
          checklist.isCompleted = false;
          this.alertService.success(
            'Success!',
            'Checklist item marked as incomplete.'
          );
        },
        error: (error) => {
          console.error('Error marking checklist item as incomplete:', error);
          this.alertService.error(
            'Error',
            'Failed to mark checklist item as incomplete.'
          );
        },
      });
    } else {
      this.eventService.markCompleteEventChecklist(checklist.id).subscribe({
        next: (response) => {
          checklist.isCompleted = true;
          this.alertService.success(
            'Success!',
            'Checklist item marked as complete.'
          );
        },
        error: (error) => {
          console.error('Error marking checklist item as complete:', error);
          this.alertService.error(
            'Error',
            'Failed to mark checklist item as complete.'
          );
        },
      });
    }
  }

  getDisplayDate(eventDate: Date): string {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // normalize by removing time part
    const normalize = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const eventDay = normalize(new Date(eventDate));
    const todayDay = normalize(today);
    const tomorrowDay = normalize(tomorrow);

    if (eventDay.getTime() === todayDay.getTime()) {
      return 'Today';
    } else if (eventDay.getTime() === tomorrowDay.getTime()) {
      return 'Tomorrow';
    } else {
      return eventDay.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }

  // Format "HH:mm:ss" (string) → "hh:mm AM/PM"
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Calculate duration between start & end
  getDuration(start: string, end: string): string {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(sh, sm, 0);

    const endDate = new Date();
    endDate.setHours(eh, em, 0);

    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;

    return result.trim();
  }

  getFileIcon(extension: string): string {

    if (extension === '.png') {
      return 'PNG';
    } else if (extension === '.jpg' || extension === 'jpeg'){
      return 'JPG';
    } else if (extension === '.gif'){
      return 'GIF';
    }  else if (extension === '.pdf') {
      return 'PDF';
    } else if (extension === '.doc' || extension === '.docx') {
      return 'DOC';
    } else if (extension === '.xls' || extension === '.xlsx') {
      return 'XLS';
    } else if (extension === '.ppt' || extension === '.pptx') {
      return 'PPT';
    } else if (extension === '.txt') {
      return 'TXT';
    } else if (extension === '.zip' || extension === '.rar') {
      return 'ZIP';
    } else if (extension === '.csv') {
      return 'CSV';
    } else {
      return 'FILE';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  removeFile(file: Document, documents: Document[]) {
    // Remove from server
    this.documentService.deleteDocument(file.id).subscribe({
      next: (resDta) => {
        // want to remove file from documents array
        const index = documents.findIndex(doc => doc.id === file.id);
        if (index > -1) {
          documents.splice(index, 1);
        }
        this.alertService.success('Success!', 'Document removed successfully');
      },
      error: (err) => {
        console.log(err);
        this.alertService.error('Error!', 'Cant remove the document');
      }
    });
  }

  getImageUrl(id: number, elementId: string){
    this.documentService.downloadFile(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);

      // Find the image element and set its src
      const imgElement = document.getElementById(elementId) as HTMLImageElement;
      if (imgElement) {
        imgElement.src = url;
      }
    });
  }


  public openEditEventModal = false;
  public selectedEvent: EventDto | null = null;
  editEvent(event: EventDto){
    // this.openEditEventModal = true;
    // this.selectedEvent = event;
    this.eventModalStateService.openModal(event);
  }

  onCloseEventModal(){
    this.openEditEventModal = false;
    this.selectedEvent = null;
  }
}
