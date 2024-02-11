import moment = require("moment");

enum gColor {
    reset = "\x1b[0m",
    bright = "\x1b[1m",
    dim = "\x1b[2m",
    underscore = "\x1b[4m",
    blink = "\x1b[5m",
    reverse = "\x1b[7m",
    hidden = "\x1b[8m",

    black = "\x1b[30m",
    red = "\x1b[31m",
    green = "\x1b[32m",
    yellow = "\x1b[33m",
    blue = "\x1b[34m",
    magenta = "\x1b[35m",
    cyan = "\x1b[36m",
    white = "\x1b[37m",

    bgBlack = "\x1b[40m",
    bgRed = "\x1b[41m",
    bgGreen = "\x1b[42m",
    bgYellow = "\x1b[43m",
    bgBlue = "\x1b[44m",
    bgMagenta = "\x1b[45m",
    bgCyan = "\x1b[46m",
    bgWhite = "\x1b[47m"
}

export class CLog {
    private static get debugLine() {
        const stack = new Error().stack
        if(stack) {
            return (stack.split("at ")[3]).trim()
        } else {
            return ""
        }
    }

    private static get timeStamp() {
        moment.locale();
        return moment().format('YYMMDD/hh:mm:ss.SS')
    }


    static __cLog = (color: gColor, ...args: string[]): string[] => {
        // string part of args
        let objsUnstrifiable: any[] = []
        // collect argument cannot be stringfied
        let argsStr = args.filter(a => (typeof a === typeof {} || typeof a === typeof []) ? objsUnstrifiable.push(a) & 0 : true)

        let str = argsStr.join('/# ')
        let resStr = str
        // print stringfied arguments
        str = `${color}${str}${gColor.reset}`;
        console.log(str)
        // print object with class type
        objsUnstrifiable.forEach(o => console.log(o))
        return args
    }

    static log(color: gColor, ...args: any[]): void {
        console.log(CLog.__cLog(color, ...args))
    }

    static ok(...args: any[]): void {
        CLog.__cLog(gColor.green, `🚀👌`, ...args)
    }


    static bad(...args: any[]): void {
        CLog.__cLog(gColor.red, `${CLog.timeStamp}🤬🧯🚒🐛🐛🐛`, ...args)
        CLog.__cLog(gColor.red, `        ${CLog.debugLine}`)
    }

    static warning(...args: any[]): void {
        CLog.__cLog(gColor.yellow, `🙀⚠️`, ...args)
    }

    static info(...args: any[]): void {
        CLog.__cLog(gColor.blue, `😿📟`, ...args)
    }
}

export const isProduction = ():boolean => {
    const mode = process.env.NODE_ENV
    return mode === 'production'
}