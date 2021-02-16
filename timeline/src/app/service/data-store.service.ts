import { Injectable } from '@angular/core';
import { TimelineData } from "../model/timeline-data"

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {
  public data: TimelineData;
  loaded: boolean = false;
  constructor(
  ) {
    this.data = new TimelineData();
  }

  public getData() {
    return this.data;
  }
  public isLoaded() {
    return this.loaded;
  }
  public setLoaded() {
    this.loaded = true;
  }
}
