import { Log, LogMessage, LogLevel } from 'bblog';
import { PrettySimple } from 'pretty-json-log';

const pretty = new PrettySimple(-1);

/** Should the logger output JSON or straight objects */
export enum LoggerType {
    JSON,
    WEB,
}
export const LoggerConfig = { level: Log.TRACE };

export const ConsoleLogStream = {
    setLevel(l: LogLevel) {
        LoggerConfig.level = l;
    },
    write(msg: LogMessage) {
        if (msg.level < LoggerConfig.level) return;
        if (!process.stdout.isTTY) return console.log(JSON.stringify(msg));

        const res = pretty.pretty(msg);
        if (res == null) return;
        process.stdout.write(res + '\n');
    },
};
export const Logger = Log.createLogger({
    name: 'xyz',
    hostname: '',
    streams: [ConsoleLogStream],
});
