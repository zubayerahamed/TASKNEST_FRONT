import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../core/models/category.model';
import { ChecklistItem } from '../../core/models/checklist-item.model';
import { EventDto, UpdateEvent } from '../../core/models/event.model';
import { Project } from '../../core/models/project.model';
import { AlertService } from '../../core/services/alert.service';
import { CategoryService } from '../../core/services/category.service';
import { ProjectService } from '../../core/services/project.service';
import { DocumentService } from '../../core/services/document.service';
import { AttachedFile, Document } from '../../core/models/attached-file.model';
import { Participant } from '../../core/models/participant.model';
import { EventService } from '../../core/services/event.service';
import { SidebarStateService } from '../../core/services/sidebar-state.service';
import { ProjectPageStateService } from '../../core/services/porjectpage-state.service';
import { TodayPageStateService } from '../../core/services/todaypage-state.service';

@Component({
  selector: 'app-edit-event',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-event.html',
  styleUrl: './edit-event.css'
})
export class EditEvent implements OnInit, OnChanges {

  @Input() openEditEventModal!: boolean;
  @Input() event!: EventDto | null;
  @Output() closeEventModal = new EventEmitter<void>();

  private sidebarStateService = inject(SidebarStateService);
  private projectPageStateService = inject(ProjectPageStateService);
  private todayPageStageService = inject(TodayPageStateService);
  private alertService = inject(AlertService);
  private projectService = inject(ProjectService);
  private categoryService = inject(CategoryService);
  private documentService = inject(DocumentService);
  private eventService = inject(EventService);

  public projects: Project[] = [];
  public categories: Category[] = [];
  public checklistItems: ChecklistItem[] = [];
  public attachedFiles: AttachedFile[] = [];
  public selectedParticipants: Participant[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '/assets/images/zubayer.jpg',
      },
    ];
  public allParticipants: Participant[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '/assets/images/zubayer.jpg',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        avatar: '/assets/images/zubayer.jpg',
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        avatar: '/assets/images/zubayer.jpg',
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        avatar: '/assets/images/zubayer.jpg',
      },
      {
        id: 5,
        name: 'David Brown',
        email: 'david.brown@example.com',
        avatar: '/assets/images/zubayer.jpg',
      },
      {
        id: 6,
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        avatar: '/assets/images/zubayer.jpg',
      },
      {
        id: 7,
        name: 'Alex Miller',
        email: 'alex.miller@example.com',
        avatar: '/assets/images/zubayer.jpg',
      },
      {
        id: 8,
        name: 'Lisa Anderson',
        email: 'lisa.anderson@example.com',
        avatar: '/assets/images/zubayer.jpg',
      },
    ];
  public newChecklistItem = '';
  public isParticipantSearchOpen = false;
  public participantSearchQuery = '';

  // Form properties
  enteredEventDate: string = new Date().toISOString().split('T')[0];
  enteredEventStartTime: string = '';
  enteredEventEndTime: string = '';
  enteredEventTitle: string = '';
  enteredEventDescription: string = '';
  selectedProjectId: number | null = null;
  selectedCategoryId: number | null = null;
  enteredEventLocation: string = '';
  selectedReminder: number | null = null;
  enteredEventLink: string = '';

  // Form error properties
  eventDateError: string = '';
  eventStartTimeError: string = '';
  eventEndTimeError: string = '';
  eventTitleError: string = '';
  eventProjectError: string = '';

  ngOnInit(): void {
    console.log(this.event);
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['openEditEventModal'] && this.openEditEventModal && this.event != null){
        console.log(this.event);
        this.loadProjects();
        this.loadExistingEventIntoForm();
      }
  }

  loadProjects(){
    console.log('Loading projects...');
    // Fetch projects from the service
    this.projectService.getAllProjects().subscribe({
      next: (resData) => {
        this.projects = resData.data || [];
      }, 
      error: (error) => {
        console.error('Error fetching projects:', error);
      }
    });
  }

  onProjectChange(event: Event) {
    if(this.selectedProjectId == null) return;

    // Fetch the categories for the selected project. 
    this.categoryService.getAllProjectCategories(this.selectedProjectId).subscribe({
      next: (resData) => {
        this.categories = resData.data || [];
        this.categories = this.categories.filter(cat => cat.isForEvent);
      }, 
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  loadCategoriesAndSelect(selectedCategory: number){
    if(this.selectedProjectId == null) return;

    // Fetch the categories for the selected project. 
    this.categoryService.getAllProjectCategories(this.selectedProjectId).subscribe({
      next: (resData) => {
        this.categories = resData.data || [];
        this.categories = this.categories.filter(cat => cat.isForEvent);
        this.selectedCategoryId = selectedCategory;
      }, 
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  loadExistingEventIntoForm(){
    if(this.event == null) return;

    this.enteredEventDate = new Date(this.event.eventDate).toISOString().split('T')[0];
    this.enteredEventStartTime = this.event.startTime;
    this.enteredEventEndTime = this.event.endTime;
    this.enteredEventTitle = this.event.title;
    this.enteredEventDescription = this.event.description;
    this.selectedProjectId = this.event.projectId;
    // load all categories with selected project
    this.loadCategoriesAndSelect(this.event.categoryId);
    this.enteredEventLink = this.event.eventLink;
    this.enteredEventLocation = this.event.location;
    this.selectedReminder = this.event.reminderBefore;
    this.checklistItems = this.event.checklists.map(c => ({
      id: c.id,
      text: c.description,
      completed: c.isCompleted
    }));
    this.attachedFiles = this.event.documents.map(d => ({
      id: d.id,
      name: d.title,
      type: d.docType,
      size: d.docSize,
      icon: this.getFileIcon(d.docName, d.docType),
    }));
  }

  resetErrorMessages(){
    this.eventDateError = '';
    this.eventStartTimeError = '';
    this.eventEndTimeError = '';
    this.eventTitleError = '';
    this.eventProjectError = '';
  }

  resetForm(){
    this.loadExistingEventIntoForm();
    this.resetErrorMessages();
  }

  validateForm(): boolean {

    // Reset errors
    this.resetErrorMessages();
    let isValid = true;
  
    if(this.enteredEventTitle.trim().length === 0){
      this.eventTitleError = 'Event title is required.';
      isValid = false;
    }

    if(this.enteredEventDate.trim().length === 0){
      this.eventDateError = 'Event date is required.';
      isValid = false;
    } else {
      const entered = new Date(this.enteredEventDate);
      const today = new Date();
    
      // reset time part for accurate comparison
      entered.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
    
      if (entered < today) {
        this.eventDateError = 'Event date cannot be before today.';
        isValid = false;
      }
    }
  
  
    if(this.enteredEventStartTime.trim().length === 0){
      this.eventStartTimeError = 'Event start time is required.';
      isValid = false;
    }

    if(this.enteredEventEndTime.trim().length === 0){
      this.eventEndTimeError = 'Event end time is required.';
      isValid = false;
    }

    // check if end time is after start time
    if(this.enteredEventStartTime && this.enteredEventEndTime){
      const start = this.enteredEventStartTime;
      const end = this.enteredEventEndTime;

      if(start >= end){
        this.eventEndTimeError = 'End time must be after start time.';
        isValid = false;
      }
    }

    if(this.selectedProjectId == null){
      this.eventProjectError = 'Please select a project.';
      isValid = false;
    }

    return isValid;
  }

  closeEditEventModal(){
    this.openEditEventModal = false;
    this.closeEventModal.emit();
  }

  onEventModalBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeEditEventModal();
    }
  }

  onEditEvent(){
    if(!this.validateForm()) return;

    // Prepare event data
    let eventDate = new Date(this.enteredEventDate);
    let formattedDate = eventDate.toISOString().split('T')[0];

    const eventData : UpdateEvent = { 
      id: this.event!.id,
      title: this.enteredEventTitle,
      description: this.enteredEventDescription,
      projectId: this.selectedProjectId!,
      categoryId: this.selectedCategoryId!,
      eventDate: formattedDate,
      startTime: this.enteredEventStartTime,
      endTime: this.enteredEventEndTime,
      location: this.enteredEventLocation,
      isReminderEnabled: this.selectedReminder != null,
      reminderBefore: this.selectedReminder || 0,
      perticipants: [],
      documents: this.attachedFiles.map(file => file.id),
      checklists: this.checklistItems? this.checklistItems.map(item => ({ description: item.text, isCompleted: item.completed })) : [],
      eventLink: this.enteredEventLink
    };

    console.log(eventData);

    this.eventService.updateEvent(eventData).subscribe({
      next: (resData) => {
        this.alertService.success('Success!', 'Event updated successfully!');

        // Update sidebar and project page
        this.sidebarStateService.updateSidebarProjects(null);
        this.sidebarStateService.updatePageCounts(null);
        this.projectPageStateService.updateProjectPage(null);
        this.todayPageStageService.updateTodayPage(null);
        this.closeEditEventModal();
      },
      error: (error) => {
        console.error('Error creating event:', error);
        this.alertService.error('Error!', 'Failed to update event. Please try again.');
      }
    });
  }






  // Checklist section
  get checklistProgress(): number {
    if (this.checklistItems.length === 0) return 0;
    const completedItems = this.checklistItems.filter(
      (item) => item.completed
    ).length;
    return Math.round((completedItems / this.checklistItems.length) * 100);
  }

  onChecklistInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.newChecklistItem = target.value;
  }

  onChecklistInputKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addChecklistItem();
    }
  }

  addChecklistItem() {
    if (this.newChecklistItem.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now(),
        text: this.newChecklistItem.trim(),
        completed: false,
      };
      this.checklistItems.push(newItem);
      this.newChecklistItem = '';
    }
  }

  toggleChecklistItem(itemId: number) {
    const item = this.checklistItems.find((item) => item.id === itemId);
    if (item) {
      if(item.completed){
        this.eventService.markInCompleteEventChecklist(item.id).subscribe({
          next: (response) => {
            item.completed = !item.completed;
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
        this.eventService.markCompleteEventChecklist(item.id).subscribe({
          next: (response) => {
            item.completed = !item.completed;
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
  }

  removeChecklistItem(itemId: number) {
    this.checklistItems = this.checklistItems.filter(
      (item) => item.id !== itemId
    );
  }





  // Attachment section
  onFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const selectedFile = files[i];

        // Submit file on server
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("title", selectedFile.name);
        formData.append("description", "");

        this.documentService.uploadDocument(formData).subscribe({
          next: (resData) => {
            const document: Document = resData.data;

            const attachedFile: AttachedFile = {
              id: document.id,
              name: document.title,
              type: selectedFile.type,
              size: selectedFile.size,
              icon: this.getFileIcon(selectedFile.name, selectedFile.type),
            };

            this.attachedFiles.push(attachedFile);
          }, 
          error: (err) => {
            console.log(err);
            this.alertService.error('Error!', 'Cant select the document');
          }
        });

      }
    }

    target.value = '';
  }

  getFileIcon(fileName: string, fileType: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (fileType.startsWith('image/')) {
      return 'JPG';
    } else if (extension === 'pdf') {
      return 'PDF';
    } else if (extension === 'doc' || extension === 'docx') {
      return 'DOC';
    } else if (extension === 'xls' || extension === 'xlsx') {
      return 'XLS';
    } else if (extension === 'ppt' || extension === 'pptx') {
      return 'PPT';
    } else if (extension === 'txt') {
      return 'TXT';
    } else if (extension === 'zip' || extension === 'rar') {
      return 'ZIP';
    } else if (extension === 'csv') {
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

  removeFile(fileId: number) {
    // Remove from front end, when submit, then remove from server also
    this.attachedFiles = this.attachedFiles.filter((f) => f.id !== fileId);
  }




  // Participant section
  removeParticipant(participantId: number) {
    this.selectedParticipants = this.selectedParticipants.filter(
      (p) => p.id !== participantId
    );
  }

  openParticipantSearch() {
    this.isParticipantSearchOpen = true;
    this.participantSearchQuery = '';
  }

  onParticipantSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.participantSearchQuery = target.value;
  }

  closeParticipantSearch() {
    this.isParticipantSearchOpen = false;
    this.participantSearchQuery = '';
  }

  get filteredParticipants(): Participant[] {
    if (!this.participantSearchQuery.trim()) {
      return this.allParticipants.filter(
        (p) => !this.selectedParticipants.find((sp) => sp.id === p.id)
      );
    }

    const query = this.participantSearchQuery.toLowerCase();
    return this.allParticipants.filter(
      (participant) =>
        !this.selectedParticipants.find((sp) => sp.id === participant.id) &&
        (participant.name.toLowerCase().includes(query) ||
          participant.email.toLowerCase().includes(query))
    );
  }

  addParticipant(participant: Participant) {
    if (!this.selectedParticipants.find((p) => p.id === participant.id)) {
      this.selectedParticipants.push(participant);
    }
    this.closeParticipantSearch();
  }

}
