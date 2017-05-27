import React from 'react';
import { ScrollView, View, Text, Picker, TextInput, Button } from 'react-native';
import { NavigationActions } from 'react-navigation';
import SideMenu from './SideMenu';
import { UserOccasionTypes, UserOccasion } from '../Code/JCal/UserOccasion';
import DataUtils from '../Code/Data/DataUtils';
import Utils from '../Code/JCal/Utils';
import { popUpMessage } from '../Code/GeneralUtils';
import { GeneralStyles } from './styles';

export default class NewOccasion extends React.Component {
    static navigationOptions = {
        title: 'New Event / Occasion',
    };
    constructor(props) {
        super(props);
        const navigation = this.props.navigation;
        let { appData, onUpdate, jdate } = navigation.state.params;
        this.onUpdate = onUpdate;
        this.dispatch = navigation.dispatch;
        this.state = {
            appData: appData,
            jdate: jdate,
            occasionType: UserOccasionTypes.OneTime,
            title: '',
            comment: ''
        };
        this.addOccasion = this.addOccasion.bind(this);
    }
    addOccasion() {
        const ad = this.state.appData,
            occasion = new UserOccasion(
                this.state.title,
                this.state.occasionType,
                this.state.jdate.Abs,
                this.state.comment);
        ad.UserOccasions.push(occasion);
        this.setState({ appData: ad });
        DataUtils.UserOccasionToDatabase(occasion);
        if (this.onUpdate) {
            this.onUpdate(ad);
        }
        popUpMessage(`The occasion ${occasion.title} has been successfully added.`,
            'Add occasion');
        this.dispatch(NavigationActions.back());
    }
    render() {
        const jmonthName = Utils.jMonthsEng[this.state.jdate.Month],
            jDay = Utils.toSuffixed(this.state.jdate.Day),
            sdate = this.state.jdate.getDate(),
            sMonthName = Utils.sMonthsEng[sdate.getMonth()],
            sDay = Utils.toSuffixed(sdate.getDate()),
            muxedDate = `${this.state.jdate.toShortString(false)} (${sdate.toLocaleDateString()})`;
        return <View style={GeneralStyles.container}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <SideMenu
                    onUpdate={this.onUpdate}
                    appData={this.state.appData}
                    navigator={this.props.navigation}
                    hideEntries={true}
                    hideKavuahs={true} />
                <ScrollView style={{ flex: 1 }}>
                    <View style={GeneralStyles.headerView}>
                        <Text style={GeneralStyles.headerText}>
                            {muxedDate}</Text>
                    </View>
                    <View style={GeneralStyles.formRow}>
                        <Text style={GeneralStyles.label}>Occasion Title</Text>
                        <TextInput
                            autoFocus
                            placeholder='Occasion Title'
                            value={this.state.title}
                            onChangeText={(text) => this.setState({ title: text })} />
                    </View>
                    <View style={GeneralStyles.formRow}>
                        <Text style={GeneralStyles.label}>Occasion Type</Text>
                        <Picker style={GeneralStyles.picker}
                            selectedValue={this.state.occasionType || 0}
                            onValueChange={value => this.setState({ occasionType: value })}>
                            <Picker.Item label={`One Time Occasion on ${muxedDate}`}
                                value={UserOccasionTypes.OneTime} />
                            <Picker.Item label={`Annual occasion on the ${jDay} day of ${jmonthName}`}
                                value={UserOccasionTypes.HebrewDateRecurringYearly} />
                            <Picker.Item label={`Monthly occasion On the ${jDay} day of each Jewish Month`}
                                value={UserOccasionTypes.HebrewDateRecurringMonthly} />
                            <Picker.Item label={`Annual occasion on the the ${sDay} day of ${sMonthName} `}
                                value={UserOccasionTypes.SecularDateRecurringYearly} />
                            <Picker.Item label={`Monthy occasion on the ${sDay} day of each Secular Month`}
                                value={UserOccasionTypes.SecularDateRecurringMonthly} />
                        </Picker>
                    </View>
                    <View style={GeneralStyles.formRow}>
                        <Text style={GeneralStyles.label}>Comments</Text>
                        <TextInput
                            multiline
                            placeholder='Comments'
                            value={this.state.comment}
                            onChangeText={(text) => this.setState({ comment: text })} />
                    </View>
                    <View style={GeneralStyles.btnAddNew}>
                        <Button
                            title='Add Event/Occasion'
                            onPress={this.addOccasion}
                            accessibilityLabel='Add this new Event/Occasion'
                            color='#99b' />
                    </View>
                </ScrollView>
            </View>
        </View>;
    }
}