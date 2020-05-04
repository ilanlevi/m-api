import { metricKey, PerformanceSampler } from 'fartsampler';
import Metrics from 'metrics';
import { ECounterMetrics, EHistogramMetrics, ETimerMetrics } from 'src/entities/EAllMetrics';

export const CLASS_NAME_TAG = 'className';
export const COLLECTION_NAME = 'collectionName';
export const ENV_NAME_TAG = 'envFullName';

export default class CollectionPerformances {
  private _metricKey: metricKey;
  private _performanceSampler: PerformanceSampler;

  constructor(private _sendMetrics: boolean, private _className: string) {
    this._metricKey = new metricKey().addTag(CLASS_NAME_TAG, _className);
    if (_sendMetrics) this._performanceSampler = new PerformanceSampler();
  }

  /* api */

  public increaseCounter(counterType: ECounterMetrics, envFullName: string = null, collectionName: string = null) {
    this.updateCounter(counterType, 1, envFullName, collectionName);
  }

  public decreaseCounter(counterType: ECounterMetrics, envFullName: string = null, collectionName: string = null) {
    this.updateCounter(counterType, -1, envFullName, collectionName);
  }

  private updateCounter(
    counterType: ECounterMetrics,
    count: number,
    envFullName: string = null,
    collectionName: string = null,
  ) {
    if (!this._sendMetrics) return;
    const metricName = ECounterMetrics[counterType];
    if (!counterType) {
      console.error(`Cannot get metric name in: updateCounter (value = ${count}), ignoring measurement!`);
      return;
    }
    try {
      PerformanceSampler.increaseCounter(this.appendToMetricName(metricName, envFullName, collectionName), count);
    } catch (e) {
      console.error(`error in updateCounter!\n${e}`);
    }
  }

  public updateHistogram(
    histogramType: EHistogramMetrics,
    value: number,
    envFullName: string = null,
    collectionName: string = null,
  ) {
    if (!this._sendMetrics) return;
    const metricName = EHistogramMetrics[histogramType];
    if (!metricName) {
      console.error(`Cannot get metric name in: updateHistogram (value = ${value}), ignoring measurement!`);
      return;
    }
    try {
      PerformanceSampler.updateHistogram(this.appendToMetricName(metricName, envFullName, collectionName), value);
    } catch (e) {
      console.error(`error in updateHistogram!\n${e}`);
    }
  }

  public startTimer(timerType: ETimerMetrics, envFullName: string = null, collectionName: string = null) {
    if (!this._sendMetrics) return null;

    const metricName = ETimerMetrics[timerType];
    if (!metricName) {
      console.error(`Cannot get metric name in: startTimer, ignoring measurement!`);
      return null;
    }
    try {
      return PerformanceSampler.startTimer(this.appendToMetricName(metricName, envFullName, collectionName));
    } catch (e) {
      console.error(`error in startTimer!\n${e}`);
    }
  }

  public stopTimer(context: Metrics.TimerContext) {
    if (!this._sendMetrics || !context) return;
    try {
      return PerformanceSampler.stopTimer(context);
    } catch (e) {
      console.error(`error in stopTimer!\n${e}`);
    }
  }

  /**
   * Return json of full metric name
   *
   * @param metricName metric name in string
   * @param envFullName optional value for adding {@link ENV_NAME_TAG} (default will not add this property)
   * @param collectionName optional value for adding {@link COLLECTION_NAME} (default will not add this property)
   *
   * @return json object that represent a metric name in influx
   */
  private appendToMetricName(metricName: string, envFullName: string = null, collectionName: string = null): Object {
    const finalMetricName = this._metricKey.getFullName(metricName);

    // optional add
    if (envFullName) finalMetricName[ENV_NAME_TAG] = envFullName;
    if (collectionName) finalMetricName[COLLECTION_NAME] = collectionName;

    return finalMetricName;
  }
}
