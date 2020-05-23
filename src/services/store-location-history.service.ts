import AsyncStorage from "@react-native-community/async-storage";

export class StoreLocationHistoryService {

  public static HISTORY_TRACK_BY_HOUR_MINUTE = 'history-track-by-hour-each-minute';
  public static WFH_TWO_WEEKS = 'wfh-two-weeks';

  public static async trackLocationByTime(type) {
    const date = new Date();
    const hour = date.getHours();
    const logsString = await AsyncStorage.getItem(StoreLocationHistoryService.HISTORY_TRACK_BY_HOUR_MINUTE);
    let data = logsString === null ? {} : JSON.parse(logsString);
    if (!data[hour]) {
      data[hour] = {};
    }
    data[hour][date.valueOf()] = type;
    console.log('data: ', data);
    await AsyncStorage.setItem(StoreLocationHistoryService.HISTORY_TRACK_BY_HOUR_MINUTE, JSON.stringify(data));
  }

  /***
   * Append service 2 weeks
   * ex.https://jsbin.com/gogehenicu/5/edit?js,console
   */
  public static async appendTrackLocation(date: string, last: { H: number, O: number, W: number, G: number }, limit = 14) {
    const logStr = await AsyncStorage.getItem(StoreLocationHistoryService.WFH_TWO_WEEKS);
    const data = logStr === null ? {} : JSON.parse(logStr);
    
    const toKeyValue = (element) => ({ key: element, value: data[element] });
    const byOlderFirst = (a, b): number => +(a.key > b.key) || -(a.key < b.key);

    const newObj = {};
    const transformed = Object.keys(data).map(toKeyValue).sort(byOlderFirst).slice(-limit);
    transformed.forEach((element) => newObj[element.key] = element.value);

    await AsyncStorage.setItem(StoreLocationHistoryService.WFH_TWO_WEEKS, JSON.stringify(newObj));
  }

}