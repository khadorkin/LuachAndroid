import Location from './JCal/Location';
import { setDefault } from './GeneralUtils';
import DataUtils from './Data/DataUtils';

export default class Settings {
    constructor(args) {
        this.location = args.location || Location.getLakewood();
        this.showOhrZeruah = setDefault(args.showOhrZeruah, true);
        this.keepThirtyOne = setDefault(args.keepThirtyOne, true);
        this.onahBeinunis24Hours = !!args.onahBeinunis24Hours;
        this.numberMonthsAheadToWarn = setDefault(args.numberMonthsAheadToWarn, 12);
        this.keepLongerHaflagah = !!args.keepLongerHaflagah;
        /** This following one is misnamed.
         * It means keep flagging Kavuags of Dilug Yom Hachodesh
         * even after they reach the beginning or the end of the month */
        this.cheshbonKavuahByCheshbon = setDefault(args.cheshbonKavuahByCheshbon, true);
        this.kavuahHaflagaOnahs = !!args.kavuahHaflagaOnahs;
        this.kavuahDiffOnahs = !!args.kavuahDiffOnahs;
        this.calcKavuahsOnNewEntry = setDefault(args.calcKavuahsOnNewEntry, true);
        this.showProbFlagOnHome = setDefault(args.showProbFlagOnHome, true);
        this.showEntryFlagOnHome = setDefault(args.showEntryFlagOnHome, true);
        this.navigateBySecularDate = !!args.navigateBySecularDate;
        this.showIgnoredKavuahs = !!args.showIgnoredKavuahs;
        this.noProbsAfterEntry = setDefault(args.noProbsAfterEntry, true);
        this.hideHelp = !!args.hideHelp;
        this.requirePIN = !!args.requirePIN;
        this.PIN = setDefault(args.PIN, '1234');
    }
    save() {
        DataUtils.SettingsToDatabase(this);
    }
    isSameSettings(other) {
        if (!!this != !!other) {
            return false;
        }
        return (!this && !other) || (this.location === other.location &&
            this.showOhrZeruah === other.showOhrZeruah &&
            this.keepThirtyOne === other.keepThirtyOne &&
            this.onahBeinunis24Hours === other.onahBeinunis24Hours &&
            this.numberMonthsAheadToWarn === other.numberMonthsAheadToWarn &&
            this.keepLongerHaflagah === other.keepLongerHaflagah &&
            this.cheshbonKavuahByCheshbon === other.cheshbonKavuahByCheshbon &&
            this.kavuahHaflagaOnahs === other.kavuahHaflagaOnahs &&
            this.kavuahDiffOnahs === other.kavuahDiffOnahs &&
            this.calcKavuahsOnNewEntry === other.calcKavuahsOnNewEntry &&
            this.showProbFlagOnHome === other.showProbFlagOnHome &&
            this.showEntryFlagOnHome === other.showEntryFlagOnHome &&
            this.navigateBySecularDate === other.navigateBySecularDate &&
            this.showIgnoredKavuahs === other.showIgnoredKavuahs &&
            this.noProbsAfterEntry === other.noProbsAfterEntry &&
            this.hideHelp === other.hideHelp &&
            this.requirePIN === other.requirePIN &&
            this.PIN === other.PIN);
    }
}