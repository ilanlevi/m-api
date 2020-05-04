import { metricKey, PerformanceSampler } from 'fartsampler';
import Metrics from 'metrics';
import { ECounterMetrics, EHistogramMetrics, ETimerMetrics } from 'src/entities/EAllMetrics';

export const CLASS_NAME_TAG = 'className';
export const ENV_NAME_TAG = 'envFullName';

export default class CollectionPerformances {
  private _metricKey: metricKey;
  private _performanceSampler: PerformanceSampler;

  constructor(private _sendMetrics : boolean, private _envFullName: string, private _className: string) {
    this._metricKey = CollectionPerformances.createMetricForCollection(_envFullName, _className);
    if (_sendMetrics)
      this._performanceSampler = new PerformanceSampler();
  }

  /* api */

  public increaseCounter(counterType: ECounterMetrics) {
    this.updateCounter(counterType, 1);
  }

  public decreaseCounter(counterType: ECounterMetrics) {
    this.updateCounter(counterType, -1);
  }

  private updateCounter(counterType: ECounterMetrics, count: number) {
    if(!this._sendMetrics)
      return;
    const metricName = ECounterMetrics[counterType];
    if (!counterType) {
      console.error(`Cannot get metric name in: updateCounter (value = ${count}), ignoring measurement!`);
      return;
    }
    try {
      PerformanceSampler.increaseCounter(this._metricKey.getFullName(metricName), count);
    } catch (e) {
      console.error(`error in updateCounter!\n${e}`);
    }
  }

  public updateHistogram(histogramType: EHistogramMetrics, value: number) {
    if(!this._sendMetrics)
      return;
    const metricName = EHistogramMetrics[histogramType];
    if (!metricName) {
      console.error(`Cannot get metric name in: updateHistogram (value = ${value}), ignoring measurement!`);
      return;
    }
    try {
      PerformanceSampler.updateHistogram(this._metricKey.getFullName(metricName), value);
    } catch (e) {
      console.error(`error in updateHistogram!\n${e}`);
    }
  }

  public startTimer(timerType: ETimerMetrics) {
    if(!this._sendMetrics)
      return null;

    const metricName = ETimerMetrics[timerType];
    if (!metricName) {
      console.error(`Cannot get metric name in: startTimer, ignoring measurement!`);
      return null;
    }
    try {
      return PerformanceSampler.startTimer(this._metricKey.getFullName(metricName));
    } catch (e) {
      console.error(`error in startTimer!\n${e}`);
    }
  }

  public stopTimer(context: Metrics.TimerContext) {
    if(!this._sendMetrics || !context)
      return;
      try {
        return PerformanceSampler.stopTimer(context);
      } catch (e) {
        console.error(`error in stopTimer!\n${e}`);
      }
  }

  /* Getters & Setters */

  get sendMetrics(): boolean {
    return this._sendMetrics;
  }

  get envFullName(): string {
    return this._envFullName;
  }

  get className(): string {
    return this._className;
  }

  public setEnvFullName(value: string) : CollectionPerformances {
    this._envFullName = value;
    return this;
  }

  public setClassName(value: string) : CollectionPerformances {
    this._className = value;
    return this;
  }

  /**
   * Create basic metric key for influx db with my specific default tags.
   *
   * @param className value for {@link CLASS_NAME_TAG} tag.
   * @param envFullName value for {@link ENV_NAME_TAG} tag.
   * @return new entity of type: {@link metricKey}.
   */
  public static createMetricForCollection(envFullName: string, className: string): metricKey {
    return new metricKey().addTag(CLASS_NAME_TAG, className).addTag(ENV_NAME_TAG, envFullName);
  }
}
