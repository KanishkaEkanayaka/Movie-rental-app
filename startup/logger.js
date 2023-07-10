const config = require('config');
const winston = require('winston');
require('winston-daily-rotate-file');

require('winston-mongodb');

const timezoned = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: config.get('winston.timeZone')
    });
}

const { combine, timestamp, json, errors } = winston.format;

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/combined-log-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
});

const uncaughtExceptionsRotateTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/uncaught-exceptions-log-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
  });

const unhandledRejectionsRotateTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/uncaught-rejections-log-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
  });

const logger = winston.createLogger({
  level: config.get('winston.log-level') || 'info',
  defaultMeta: {
    service: 'admin-service',
  },
  format: combine(errors({ stack: true }),timestamp({ format: timezoned }), json()),
  transports: [
    fileRotateTransport,
    new winston.transports.MongoDB({
        level: 'info',
        format:winston.format.metadata(),
        //mongo database connection link
        db : config.get('winston.database-location'),
        options: {
            useUnifiedTopology: true
        },
        // A collection to save json formatted logs
        collection: 'server_error_logs'
    })
],
exceptionHandlers: [
    uncaughtExceptionsRotateTransport,
    new winston.transports.MongoDB({
        level: 'info',
        format:winston.format.metadata(),
        //mongo database connection link
        db : 'mongodb://localhost:27017/vidly-logs',
        options: {
            useUnifiedTopology: true
        },
        // A collection to save json formatted logs
        collection: 'server_uncaught_exceptions_logs'
    })
  ],
  rejectionHandlers: [
    unhandledRejectionsRotateTransport,
    new winston.transports.MongoDB({
        level: 'info',
        format:winston.format.metadata(),
        //mongo database connection link
        db : 'mongodb://localhost:27017/vidly-logs',
        options: {
            useUnifiedTopology: true
        },
        // A collection to save json formatted logs
        collection: 'server_uncaught_rejections_logs'
    })
  ],
});

//logger.exitOnError = false; //set winston not to exit on error not a good practice

function logError(err,errDetails){
    logger.info(err,errDetails);
}

function logInfo(info){
  logger.info(info);
}
// logger.error('Error message',{
//     file: 'something.png',
//     type: 'image/png',
//     userId: 'jdn33d8h2',
//   });
// logger.warn('Warning message',{
//     file: 'something.png',
//     type: 'image/png',
//     userId: 'jdn33d8h2',
//   });

module.exports.logError = logError;
module.exports.logInfo = logInfo;