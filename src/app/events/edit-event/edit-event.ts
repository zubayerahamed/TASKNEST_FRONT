import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../core/models/category.model';
import { ChecklistItem } from '../../core/models/checklist-item.model';
import { EventDto } from '../../core/models/event.model';
import { Project } from '../../core/models/project.model';
import { AlertService } from '../../core/services/alert.service';
import { CategoryService } from '../../core/services/category.service';
import { ProjectService } from '../../core/services/project.service';

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

  private alertService = inject(AlertService);
  private projectService = inject(ProjectService);
  private categoryService = inject(CategoryService);

  public projects: Project[] = [];
  public categories: Category[] = [];
  public checklistItems: ChecklistItem[] = [];

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

  loadExistingEventIntoForm(){
    if(this.event == null) return;

    this.enteredEventDate = new Date(this.event.eventDate).toISOString().split('T')[0];
    this.enteredEventStartTime = this.event.startTime;
    this.enteredEventEndTime = this.event.endTime;
    this.enteredEventTitle = this.event.title;
    this.enteredEventDescription = this.event.description;
    this.enteredEventLink = this.event.eventLink;
    this.enteredEventLocation = this.event.location;
    this.selectedReminder = this.event.reminderBefore;
    this.checklistItems = this.event.checklists.map(c => ({
      id: c.id,
      text: c.description,
      completed: c.isCompleted
    }));

    

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

  }
}
