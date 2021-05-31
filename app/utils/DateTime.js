export class DateTime {
    static getCurrentDate() {
        var date = new Date();
        date.setMinutes(0);
        date.setSeconds(0);
        date = date.toISOString();
        date = date.substring(0, 19);
        date = date + "+0000";
        return date;
    }
};

