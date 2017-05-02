import React, { Component } from 'react';
import { ScrollView, View, Alert, Text, TouchableHighlight } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { List, ListItem, Icon } from 'react-native-elements';
import DataUtils from '../Code/Data/DataUtils';
import { Kavuah } from '../Code/Chashavshavon/Kavuah';
import { GeneralStyles } from './styles';

export default class FindKavuahScreen extends Component {
    static navigationOptions = {
        title: 'Found Possible Kavuahs'
    };
    constructor(props) {
        super(props);

        this.dispatch = this.props.navigation.dispatch;

        const { appData, onUpdate, possibleKavuahList } = this.props.navigation.state.params;

        this.onUpdate = onUpdate;
        this.listSupplied = !!possibleKavuahList;
        this.state = {
            appData: appData,
            possibleKavuahList: possibleKavuahList || []
        };

        this.update = this.update.bind(this);
        this.addKavuah = this.addKavuah.bind(this);
        this.deletePossibleKavuah = this.deletePossibleKavuah.bind(this);
    }
    componentWillMount() {
        const appData = this.state.appData;
        if (appData && !this.listSupplied) {
            const possList = Kavuah.getPossibleNewKavuahs(appData.EntryList.list, appData.KavuahList);
            this.setState({
                possibleKavuahList: possList
            });
            if (!possList.length) {
                Alert.alert(`The application did not find any Kavuah combinations.
                    Please remember: DO NOT RELY EXCLUSIVELY UPON THIS APPLICATION!`);
                this.dispatch(NavigationActions.back());
            }
        }
    }
    addKavuah(pk) {
        const appData = this.state.appData,
            kList = appData.KavuahList,
            foundInList = kList.find(k => k.isMatchingKavuah(pk.kavuah)),
            kavuah = foundInList || pk.kavuah;

        //In case it was already in the list, but was inactive or ignored.
        kavuah.active = true;
        kavuah.ignore = false;

        DataUtils.KavuahToDatabase(kavuah).then(() => {
            if (!foundInList) {
                kList.push(pk.kavuah);
            }
            appData.KavuahList = kList;
            Alert.alert(`The Kavuah ${kavuah.toString()} has been added to the list`);
            //Now that it's been added to the database, it is no longer a "possible"" Kavuah.
            this.update(appData);
            this.deletePossibleKavuah(pk);
        });
    }
    deletePossibleKavuah(pk) {
        let list = this.state.possibleKavuahList,
            index = list.indexOf(pk);
        if (index > -1) {
            list.splice(index, 1);
            if (list.length === 0) {
                this.dispatch(NavigationActions.back());
            }
            else {
                this.setState({
                    possibleKavuahList: list
                });
            }
        }
    }
    update(appData) {
        if (appData) {
            this.setState({ appData: appData });
        }
        if (this.onUpdate) {
            this.onUpdate(appData);
        }
    }
    render() {
        return (
            <ScrollView style={GeneralStyles.container}>
                <List>
                    {this.state.possibleKavuahList.map((pk, index) => (
                        <ListItem
                            key={index}
                            title={`Possible Kavuah #${(index + 1).toString()}: ${pk.kavuah.toString()}`}
                            titleStyle={{ fontWeight: 'bold', color: '#55b' }}
                            leftIcon={{ name: 'device-hub', color: '#f00', size: 25 }}
                            hideChevron
                            subtitle={
                                <View style={[GeneralStyles.buttonList, { margin: 15 }]}>
                                    <TouchableHighlight
                                        underlayColor='#aaf'
                                        style={{ flex: 1 }}
                                        onPress={() => this.addKavuah(pk)}>
                                        <View style={{ alignItems: 'center' }}>
                                            <Icon
                                                reverse
                                                name='add'
                                                color='#696'
                                                size={25} />
                                            <Text style={{ color: '#080' }}> Add this Kavuah</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight
                                        underlayColor='#faa'
                                        style={{ flex: 1 }}
                                        onPress={() => this.deletePossibleKavuah(pk)}>
                                        <View style={{ alignItems: 'center' }}>
                                            <Icon
                                                reverse
                                                name='delete-forever'
                                                color='#faa'
                                                size={25} />
                                            <Text style={{ color: '#faa' }}> Don't add this Kavuah</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>} />
                    ))}
                </List>
            </ScrollView>);
    }
}