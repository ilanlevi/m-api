/**
 * Logger service api
 */
import { ELogLevel } from 'src/core/config_types/ILoggerConfig';

export abstract class AbstractLogger {
  protected _className: string;

  /**
   * Init service from settings
   */
  protected initLogger() {
    this.checkForLogFileDir();
    this.initializeLogger();
  }

  /**
   * Log the message via logger
   *
   * @param level the level, low-case value from {@link ELogLevel | ELogLevel enum values}
   * @param message the message to log
   * @param classLogged the class that logged the message
   */
  protected abstract log(level: ELogLevel, message: string, classLogged?: string);

  /**
   * Log in 'INFO' level
   * @param message the message
   * @param classLogged the class name that the log came from.
   *        When {@link this.className} isn't null, the value will be ignored.
   */
  public info(message: string, classLogged?: string) {
    this.log(ELogLevel.INFO, message, this.className || classLogged);
  }

  /**
   * Log in 'ERROR' level
   * @param message the message
   * @param classLogged the class name that the log came from.
   *        When {@link this.className} isn't null, the value will be ignored.
   */
  public error(message: string, classLogged?: string) {
    this.log(ELogLevel.ERROR, message, this._className || classLogged);
  }

  /**
   * Log in 'WARN' level
   * @param message the message
   * @param classLogged the class name that the log came from.
   *        When {@link this.className} isn't null, the value will be ignored.
   */
  public warn(message: string, classLogged?: string) {
    this.log(ELogLevel.WARN, message, this.className || classLogged);
  }

  /**
   * Log in 'DEBUG' level
   * @param message the message
   * @param classLogged the class name that the log came from.
   *        When {@link this.className} isn't null, the value will be ignored.
   */
  public debug(message: string, classLogged?: string) {
    this.log(ELogLevel.DEBUG, message, this.className || classLogged);
  }

  /**
   * Log in 'VERBOSE' level
   * @param message the message
   * @param classLogged the class name that the log came from.
   *        When {@link this.className} isn't null, the value will be ignored.
   */
  public verbose(message: string, classLogged?: string) {
    this.log(ELogLevel.VERBOSE, message, this.className || classLogged);
  }

  /**
   * Initialize logger api methods dynamically.
   * Uses the values of: {@link ELogLevel | ELogLevel enum values}
   */

  /**
   * Create (if needed) the log files directory
   */
  protected abstract checkForLogFileDir();

  /**
   * initialize logger with the system settings
   */
  protected abstract initializeLogger();

  /**
   * Getter and Setter for the class name that holds this logger
   */

  public get className(): string {
    return this._className;
  }

  protected setClassName(value: string) {
    this._className = value;
  }
}
