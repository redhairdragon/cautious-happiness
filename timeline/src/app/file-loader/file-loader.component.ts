import { Component, OnInit } from '@angular/core';
import { TimelineData } from "../model/timeline-data"
import { DataStoreService } from "../service/data-store.service"
@Component({
  selector: 'app-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.css']
})

export class FileLoaderComponent implements OnInit {
  public errorMessage: string = "";
  public data: TimelineData;
  constructor(
    private dataStoreService: DataStoreService
  ) {
    this.dataStoreService = dataStoreService;
    this.data = this.dataStoreService.getData();
  }

  ngOnInit(): void {
  }

  fileSelected(event: any): void {
    if (event.target.files.length !== 1) {
      this.errorMessage = 'Cannot use multiple files';
      return
    }
    var file = event.target.files[0]
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const raw: string = e.target.result;
      this.processRawLog(raw);
      this.dataStoreService.setLoaded();
    };
    reader.readAsBinaryString(file)
  }

  processRawLog(raw: string): string {
    const records = raw.split('\n');
    for (let i = 0; i < records.length - 1; ++i) {
      let error = this.data.parseRecord(JSON.parse(records[i]));
      if (error !== "")
        return error;
    }
    return "";
  }
} 