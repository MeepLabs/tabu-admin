var ONE_MIN = 60000; // In milliseconds
var ONE_DAY = 86400000; // In milliseconds
var Config = {
    ASSETS_MAX_AGE: 7*ONE_DAY,
    PAGE_MAX_AGE: 10*ONE_MIN,   // As discussed kept it 10 mins. You can change it of you want to cache the queries for longer time.
    SECRET_PIN: "6942",           // Change this PIN to some secret value
    COOKIE_NAME: '_tabupin',
    COOKIE_AGE: ONE_DAY,

    CACHED_QUERIES: {
        ACCOUNTS: true,
        VENUES: true,
        INDEX: true,
        PAYMENTS: true
    }
};

module.exports = Config;
