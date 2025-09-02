import { Component, DestroyRef, inject } from '@angular/core';
import { PageDetail } from '../core/components/shared/page-detail/page-detail';
import { EventDto } from '../core/models/event.model';
import { PageService } from '../core/services/page.service';
import { TodayPageStateService } from '../core/services/todaypage-state.service';

@Component({
  selector: 'app-upcoming',
  imports: [PageDetail],
  templateUrl: './upcoming.html',
  styleUrls: ['./upcoming.css'],
  host: {
    class: 'content-area flex-grow-1 d-flex flex-column gap-4',
  },
})
export class Upcoming {
  pageTitle: string = 'Upcoming';

  private destroyRef = inject(DestroyRef);
  private pageService = inject(PageService);
  private todayPageStageService = inject(TodayPageStateService);

  public events: EventDto[] = [];
  public groupedEvents: { [key: string]: EventDto[] } = {};

  ngOnInit(): void {
    const todayPageSubscription =
      this.todayPageStageService.todayPageUpdate$.subscribe({
        next: (data) => {
          this.loadEvents();
        },
      });

    this.destroyRef.onDestroy(() => {
      todayPageSubscription.unsubscribe();
    });

    this.loadEvents();
  }

  loadEvents() {
    this.pageService.getAllUpcomingEvents().subscribe({
      next: (response) => {
        this.events = response.data || [];
        this.groupedEvents = this.groupEventsByProjectName(this.events);
      },
      error: (error) => {
        console.error("Error fetching upcoming events:", error);
      },
    });
  }

  groupEventsByProjectName(events: EventDto[]): { [key: string]: EventDto[] } {
    return events.reduce((groupedEvents, event) => {
      const projectName = event.projectName;
      if (!groupedEvents[projectName]) {
        groupedEvents[projectName] = [];
      }
      groupedEvents[projectName].push(event);
      return groupedEvents;
    }, {} as { [key: string]: EventDto[] });
  }
}
