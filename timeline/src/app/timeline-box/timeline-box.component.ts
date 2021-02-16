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
  @Input() iteration: number = 0;
  @Input() width: number = 15000;
  public data: TimelineData;
  public chartType: ChartType = ChartType.Timeline;
  public chartColumns: string[] = ["Node", "Operation", "Start", "End"];
  public chartData: any = [["0", "0", 0, 0]];
  constructor(
    private dataStoreService: DataStoreService
  ) {
    this.data = this.dataStoreService.getData();
    // this.chartData = this.data.get2Darray(this.iteration);
  }

  ngOnInit(): void {
  }
  dataLoaded(): boolean {
    return this.dataStoreService.isLoaded();
  }
  updateGraph(): void {
    this.chartData = this.data.get2Darray(this.iteration);
    console.log(this.chartData)
  }

}
