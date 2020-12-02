import React, { Component } from 'react';
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Text,
    Dimensions,
    Platform, StatusBar, StyleSheet
} from "react-native";
import { LabelInput } from "../../../components/Forms";
import { BgView, Header } from "../../../components/Layouts";
import Button from "../../../components/Button";
import w3s from '../../../libs/Web3Service';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const { height, width } = Dimensions.get('window');


class Transfer extends Component {
    state = {
        addressTo: "",
        amount: "",
        isError: false,
        isSuccess: false,
        error: ""
    }

    async componentDidMount() {
        await w3s.initContract()
    }

    transfer = async () => {
        try {
            if (!this.state.addressTo) {
                await this.setState({ isError: true, error: "To Address must required!" })
                return
            }
            else if (!this.state.amount) {
                await this.setState({ isError: true, error: "amount must required!" })
                return
            }
            else {
                await this.setState({ isError: false })
            }


            const myContract = await w3s.createHydroTokenContract();
            console.log(myContract, "myContract");
            let token = await myContract.methods.transfer(this.state.addressTo, this.state.amount).call()
            console.log(token, "token")
            this.setState({ isSuccess: true, addressTo: "", amount: "" })
        }
        catch (ex) {
            console.log(ex)
            await this.setState({ isError: true })
            if (ex.message)
                await this.setState({ error: ex.message })
        }

    }
    render() {
        // console.log(w3s)
        return (
            <BgView>
                <Header.Back title="Transfer" onBackPress={this.props.navigation.goBack} containerStyle={styles.header} />

                <View style={styles.container}>
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingVertical: width * 0.02 }} />
                        <LabelInput
                            label="Hydro Address"
                            placeholder="Enter Hydro Address"
                            value={this.state.addressTo}
                            onChangeText={(value) => this.setState({ addressTo: value })}
                        />
                        <LabelInput
                            label="amount"
                            placeholder="0.00"
                            keyboardType={'number-pad'}
                            value={this.state.amount}
                            onChangeText={(value) => {
                                console.log(value)
                                this.setState({ amount: value })
                            }}
                        />
                        {this.state.isError &&
                            <Text style={{ color: 'red' }}>
                                Error : {this.state.error}
                            </Text>
                        }
                        {this.state.isSuccess &&
                            <Text style={{ color: 'green' }}>
                                Transfer Successfully !
                            </Text>
                        }

                        <View style={styles.button}>
                            <Button text="Transfer" onPress={this.transfer} />
                        </View>
                        
                    </KeyboardAwareScrollView>
                </View>

            </BgView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: width * 0.05
    },

    header: {
        marginTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight,
        paddingTop: 0,
        height: 50
    },

    button: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: width * 0.05
    }

})
export default Transfer;