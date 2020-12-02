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
import { toWei } from '../../../libs/format';
import Web3 from 'web3';
import HydroToken from '../../../contracts/HydroToken.json'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const { height, width } = Dimensions.get('window');


const _spender = "0xB0D5a36733886a4c5597849a05B315626aF5222E"

class Deposits extends Component {
    state = {
        amount: "",
        comments: "",
        isError: false,
        isSuccess: false,
        error: "",
        test: "0xf879808609184e72a00082271094b0d5a36733886a4c5597849a05b315626af5222e809450a867b59c3be0123179a7fbbf0710bb5ff6d2dd1ca0e093606c41099c9b67e0b7942dfc29ea0513ec5a3b0a31f52111aaf202392950a00df61566839009751946fcdde031e346e212c45798ba5f2e1e55931d3544eb5c"
    }
  
    componentDidMount() {
        w3s.initContract()
        // const web3Provider = window.web3 ? window.web3.currentProvider : null;

        // this.web3 = web3Provider
        //     ? new Web3(web3Provider)
        //     : new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/75cc8cba22ab40b9bfa7406ae9b69a27'));

        // this.web3.eth.defaultAccount = this.web3.eth.accounts[0];
    }


    deposit = async () => {

        try {
            if (!this.state.amount) {
                await this.setState({ isError: true, error: "uint256 must required!" })
                return
            }
            else {
                await this.setState({ isError: false })
            }

            console.log("[LOAD TOKEN]")
            const myContract = await w3s.createHydroTokenContract();

            //console.log(myContract.methods, "myContract");
            console.log(_spender, "_spender");
            console.log(this.state.amount, "amount");
            console.log(this.state.comments, "comments");


            // this.web3.eth.sendSignedTransaction(this.state.test, (err, tx) => {
            //     alert(err)
            // });



            let token = await myContract.methods.approveAndCall(_spender, toWei(this.state.amount.toString()), '0x42').send({ from: this.props.route.params.walletToken })

        }
        catch (ex) {
            console.log(ex)
            await this.setState({ isError: true })
            if (ex.message)
                await this.setState({ error: ex.message })
        }

    }

    render() {
        console.log(this.props.route.params.walletToken, "Props")
        return (
            <BgView>
                <Header.Back title="Deposits" onBackPress={this.props.navigation.goBack} containerStyle={styles.header} />

                <View style={styles.container}>
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingVertical: width * 0.02 }} />
                        
                        
                        <LabelInput
                            label="Amount"
                            placeholder="0.00"
                            keyboardType={'number-pad'}
                            value={this.state.amount}
                            onChangeText={(value) => {
                                console.log(value)
                                this.setState({ amount: value })
                            }}
                        />
                        <LabelInput
                            label="Comments"
                            placeholder="Comments"
                            value={this.state.comments}
                            onChangeText={(value) => {
                                console.log(value)
                                this.setState({ comments: value })
                            }}
                        />

                        {this.state.isError &&
                            <Text style={{ color: 'red' }}>
                                Error : {this.state.error}
                            </Text>
                        }
                        {this.state.isSuccess &&
                            <Text style={{ color: 'green' }}>
                                Deposit Successfully !
                            </Text>
                        }

                        <View style={styles.button}>
                            <Button text="Deposit" onPress={this.deposit} />
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

export default Deposits;