/**
 * Logger service api
 */
import {ELogLevel} from "src/core/config_types/ILoggerConfig";

export abstract class AbstractLogger {

    /**
     * Init service from settings
     */
    protected initService(){
        this.initLoggerMethods();
        this.checkForLogFileDir();
        this.initializeLogger();
    }

    /**
     * Initialize logger api methods dynamically.
     * Uses the values of: {@link ELogLevel | ELogLevel enum values}
     */
    protected initLoggerMethods() {
        Object.keys(ELogLevel).forEach(logLevel => {
            AbstractLogger.prototype[logLevel.toLowerCase()] = function (message: string = "", classLogged: any = "") {
                this.log(logLevel, message, classLogged);
            }
        });
    }

    /**
     * Log the message via logger
     *
     * @param level the level, low-case value from {@link ELogLevel | ELogLevel enum values}
     * @param message the message to log
     * @param classLogged the class that logged the message
     */
    public abstract log(level: string,  message: string, classLogged?: string);

    /**
     * Create (if needed) the log files directory
     */
    protected abstract checkForLogFileDir();

    /**
     * initialize logger with the system settings
     */
    protected abstract initializeLogger();

}
