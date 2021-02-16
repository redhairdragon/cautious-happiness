import { Component, Input, OnInit } from '@angular/core';
import { DataStoreService } from "../service/data-store.service"
import { TimelineData } from "../model/timeline-data"
import {
  ChartErrorEvent,
  ChartMouseLeaveEvent,
  ChartMouseOverEvent,
  ChartSelectionChangedEvent,
  ChartType,
  Column,
  GoogleChartComponent
} from 'angular-google-charts';

@Component({
  selector: 'app-timeline-box',
  templateUrl: './timeline-box.component.html',
  styleUrls: ['./timeline-box.component.css']
})
export class TimelineBoxComponent implements OnInit {
  @Input() iteration: number = -1;
  @Input() width: number = 15000;
  public data: TimelineData;
  public readonly timelineType: ChartType = ChartType.Timeline;
  public readonly timelineColumns: string[] = ["Node", "Operation", "Start", "End"];
  public readonly pieType: ChartType = ChartType.PieChart;
  public readonly pieColumns: string[] = ["Task", "Duration"];
  public timelineData: any = [["0", "0", 0, 0]];
  public pieData: any = {};
  public pieOption: any = {} //for color
  constructor(
    private dataStoreService: DataStoreService
  ) {
    this.data = this.dataStoreService.getData();
    this.timelineData = this.data.get2Darray(this.iteration);
    
  }

  ngOnInit(): void {
  }
  dataLoaded(): boolean {
    return this.dataStoreService.isLoaded();
  }
  updateGraph(): void {
    this.timelineData = this.data.get2Darray(this.iteration);
    for (let r of this.data.getNodes())
      this.pieData[r] = this.data.getPieArray(this.iteration, parseInt(r));
  }
}
