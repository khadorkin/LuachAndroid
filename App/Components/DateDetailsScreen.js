import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import CustomList from './CustomList';
import SideMenu from './SideMenu';
import { GeneralStyles } from './styles';

export default class DateDetailsScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Zmanim for ' + navigation.state.params.appData.Settings.location.Name
    });

    constructor(props) {
        super(props);
        const navigation = this.props.navigation,
            { jdate, onUpdate, appData } = navigation.state.params;
        this.navigate = navigation.navigate;
        this.onUpdate = onUpdate;
        this.appData = appData;
        this.state = { jdate: jdate };
        this.goPrev = this.goPrev.bind(this);
        this.goNext = this.goNext.bind(this);
    }
    goPrev() {
        const jdate = this.state.jdate;
        this.setState({ jdate: jdate.addDays(-1) });
    }
    goNext() {
        const jdate = this.state.jdate;
        this.setState({ jdate: jdate.addDays(1) });
    }
    render() {
        const list = this.state.jdate.getAllDetails(this.appData.Settings.location);
        return <View style={GeneralStyles.container}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <SideMenu
                    onUpdate={this.onUpdate}
                    appData={this.appData}
                    navigator={this.props.navigation}
                    onGoPrevious={this.goPrev}
                    onGoNext={this.goNext}
                    hideFlaggedDates={true}
                    hideEntries={true}
                    hideKavuahs={true} />
                <ScrollView style={{ flex: 1 }}>
                    <View style={GeneralStyles.headerView}>
                        <Text style={GeneralStyles.headerText}>{this.state.jdate.toShortString(true)}</Text>
                    </View>
                    <CustomList
                        data={list}
                        textSectionViewStyle={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                        title={i => i.title + (i.value ? ':' : '')}
                        titleStyle={i => ({
                            fontWeight: 'bold',
                            color: i.important ? '#008' : null,
                            paddingRight: 10
                        })}
                        secondSection={i => <Text style={{ textAlign: 'right', flex: 1 }}>{i.value}</Text>} />
                </ScrollView>
            </View>
        </View>;
    }
}