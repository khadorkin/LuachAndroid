class NightDay {
    static get Night() { return -1; }
    static get Day() { return 1; }
}

class Onah {
    constructor(jdate, nightDay) {
        if (!jdate) {
            throw 'jdate must be supplied.';
        }
        this.jdate = jdate;
        this.nightDay = nightDay;
    }
    isSameOnah(onah) {
        return this.jdate.Abs === onah.jdate.Abs &&
            this.nightDay === onah.nightDay;
    }
    get previous() {
        if (this.nightDay === NightDay.Day) {
            return new Onah(this.jdate, NightDay.Night);
        }
        else {
            return new Onah(this.jdate.addDays(-1), NightDay.Day);
        }
    }
    get next() {
        if (this.nightDay === NightDay.Day) {
            return new Onah(this.jdate.addDays(1), NightDay.Night);
        }
        else {
            return new Onah(this.jdate, NightDay.Night);
        }
    }
}

export { NightDay, Onah };