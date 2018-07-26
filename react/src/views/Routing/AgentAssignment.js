import React, { Component } from 'react'
import './AgentAssignment.css';
import Notification from '../model/Notification';
import RadioButton from '../../components/RadioButton/RadioButton';
import { enableNotifyEveryBody, enableAutomaticAssignment, enableOrDisableBotRouting, getCustomerByApplicationId} from '../../utils/kommunicateClient'
import axios from 'axios';
import { ROUND_ROUBIN } from './Constants.js';
import CommonUtils from '../../utils/CommonUtils';
import SliderToggle from '../../components/SliderToggle/SliderToggle';
import {Link} from 'react-router-dom';
import {SplitButton, MenuItem, DropdownButton} from 'react-bootstrap';
import { Collapse } from 'reactstrap';
import { getIntegratedBots, conversationHandlingByBot  } from '../../utils/kommunicateClient';
import Diaglflow from '../Bot/images/dialogflow-icon.png';
import botPlatformClient from '../../utils/botPlatformClient';
import LockBadge from '../../components/LockBadge/LockBadge';

class AgentAssignemnt extends Component{
    constructor(props) {
        super(props);
        this.state = {
            checked: 1,
            checkedNotifyEverybody:true,
            checkedAutomaticAssignemnt:false,
            preventMultiCallAutoAssignment:false,
            preventMultiCallNotifyEverybody:false,
            botsAreAvailable: false,
            assignConversationToBot: false,
            openAgentRoutingRules: false,
            listOfBots: [],
            listOfBotsDropDown: false,
            dropDownBoxTitle: 'Select a bot',
            previousSelectedBot: null,
            currentSelectedBot: null,
        };

    }
componentWillMount (){
    this.getRoutingState();
}

componentDidMount(){
    this.getIntegratedBots();
}
getIntegratedBots = () => {
    getIntegratedBots().then(response => {
        // console.log(response.allBots)
        if (response && response.allBots && response.allBots.length > 0) {
            this.setState({
                listOfBots: response.allBots,
                botsAreAvailable: true
            }, () => {
                this.state.listOfBots.map( bot => {
                    if (parseInt(bot.allConversations) == 1 && parseInt(bot.bot_availability_status) === 1) {
                        this.setState({
                            currentSelectedBot: bot.userName,
                            dropDownBoxTitle: bot.name,
                            // assignConversationToBot: true,
                        })
                    }
                })
            })
        }
    })
}
getRoutingState = () => {
    return Promise.resolve(getCustomerByApplicationId()).then(response => {
        response.data.data.botRouting && this.setState({assignConversationToBot:true})
        if (response.data.data.agentRouting === 1) {
            this.setState({
                checkedNotifyEverybody: false,
                checkedAutomaticAssignemnt: true,
                preventMultiCallAutoAssignment: true,
                preventMultiCallNotifyEverybody: false
            })
        }
        else {
            this.setState({
                checkedNotifyEverybody: true,
                checkedAutomaticAssignemnt: false,
                preventMultiCallNotifyEverybody: true,
                preventMultiCallAutoAssignment: false
            })
        }
    }).catch(err => {
        console.log("error while fetching routing state/round roubin state", err);
    })
}
handleRadioBtnNotifyEverybody = () => {
    this.setState({
        checkedNotifyEverybody: true,
        checkedAutomaticAssignemnt: false
    })
    if (this.state.preventMultiCallNotifyEverybody == false) {
        return Promise.resolve(enableNotifyEveryBody({ routingState: ROUND_ROUBIN.DISABLE }).then(response => {
            if (response.status === 200 && response.data.code === "SUCCESS") {
                let userSession = CommonUtils.getUserSession();
                userSession.routingState = ROUND_ROUBIN.DISABLE;
                CommonUtils.setUserSession(userSession)
                Notification.success('Notify everybody is enabled');
                this.setState({
                    preventMultiCallAutoAssignment: false,
                    preventMultiCallNotifyEverybody: true
                })
            }
        })).catch(err => {
            console.log("error while updating agent routing", err);
        })
    }
}
handleRadioBtnAutomaticAssignment = () => {
    this.setState({
        checkedNotifyEverybody: false,
        checkedAutomaticAssignemnt: true,
    })
    if (this.state.preventMultiCallAutoAssignment == false) {
        return Promise.resolve(enableAutomaticAssignment({ routingState: ROUND_ROUBIN.ENABLE }).then(response => {
            if (response.status === 200 && response.data.code === "SUCCESS") {
                let userSession = CommonUtils.getUserSession();
                userSession.routingState = ROUND_ROUBIN.ENABLE;
                CommonUtils.setUserSession(userSession);
                Notification.success('Automatic assignment is enabled');
                this.setState({
                    preventMultiCallAutoAssignment: true,
                    preventMultiCallNotifyEverybody: false
                })
            }
        })).catch(err => {
            console.log("error while updating agent routing", err);
        })
    }
}

toggleConversationAssignment = () => {
    this.setState({
        assignConversationToBot: !this.state.assignConversationToBot
    })
    // console.log("state",this.state);
    // let status = !this.state.assignConversationToBot?"enabled":"disabled";
    let status = !this.state.assignConversationToBot
    // let currentSelectedBot = this.state.listOfBots.filter(item =>item.userName==this.state.currentSelectedBot)
    // if(currentSelectedBot.length){
    // botPlatformClient.toggleMute(currentSelectedBot[0].userKey,status).then(data=>{
    //     if(data.code=="success"){
    //         // console.log("bot routing disabled..");
    //     }
    //     })
    // }
    return Promise.resolve(enableOrDisableBotRouting({ routingState: status }).then(response => {
        if (response.status === 200 && response.data.code === "SUCCESS") {
            let userSession = CommonUtils.getUserSession();
            userSession.botRouting = status;
            CommonUtils.setUserSession(userSession);
        }
    })).catch(err => {
        console.log("error while updating bot routing", err);
    })

}


  render() {
      const notifyEverybodyContainer = (
          <div className={this.state.checkedNotifyEverybody ? "row notify-everybody-wrapper active-agent-routing" : "row notify-everybody-wrapper non-active-agent-routing"}>
              <div className="col-radio-btn col-md-1 col-lg-1">
              </div>
              <div className="col-md-11 col-lg-11">
                  <h4 className="routing-title">Notify everybody <span className="notify-everybody-sub-title">(recommended for small teams)</span></h4>
                  <p className="routing-description">Message notification will be sent to the entire team and whoever acts on it first is assigned the conversation</p>
              </div>
          </div>
      )
      const automaticAssignmentContainer = (
          <div className={!this.state.checkedNotifyEverybody ? "row notify-everybody-wrapper active-agent-routing" : "row notify-everybody-wrapper non-active-agent-routing"}>
              <div className="col-radio-btn col-md-1 col-lg-1">
              </div>
              <div className="col-md-11 col-lg-11">
                {   (CommonUtils.isTrialPlan()) ? <h4 className="routing-title">Automatic assignment</h4> :  (CommonUtils.isStartupPlan()) ? <div className="badge-design">
                    <h4 className="routing-title startup-badge">Automatic assignment</h4> <LockBadge className={"lock-with-text"} text={"Available in Growth Plan"} history={this.props.history} onClickGoTo={"/settings/billing"}/> </div> : <h4 className="routing-title">Automatic assignment</h4>
                }
                  {/* <h4 className="routing-title">Automatic assignment</h4> */}
                  <p className="routing-description">All new conversations will be automatically assigned to each agent on a round robin basis.</p>
              </div>
          </div>
    )

    return (
        <div>
            <div className="col-md-8 col-sm-12">
                <div className="row" className="conversation-routing-title-wrapper">
                    <h4 className="agent-assignment-title">Set up how you want conversations to be assigned to your bots and agents</h4>
                </div>
            </div>
            <div className="col-md-9 col-sm-12">
                <div className="card-block">
                    <div className="row agent-assignment-wrapper">
                        <div className="options-wrapper">
                            <div className="row">
                                <div className="col-md-8 col-sm-8">
                                    <h4 className="options-wrapper-title">Assign new conversations to bot </h4>
                                </div>
                                <div className="col-md-4 col-sm-4 text-center">
                                    <SliderToggle checked={this.state.assignConversationToBot} handleOnChange={this.toggleConversationAssignment} />
                                </div>
                            </div>
                            <div className={this.state.assignConversationToBot ? "n-vis":"row"}>
                                <div className="col-md-8 col-sm-8" style={{width: "70%", margin:"30px auto"}}>
                                    <div style={this.state.botsAreAvailable ? { border: "1px dashed #c0c0c0", padding: "23px 17px", backgroundColor: "#cce7f8"}:{ border: "1px dashed #c0c0c0", padding: "23px 17px"}} className="text-center">
                                        {
                                            this.state.botsAreAvailable ?  <p className="km-routing-do-not-have-bots">You have bots available. Turn on this section to use them in conversations.</p> : <p className="km-routing-do-not-have-bots">You do not have any bots available. You may start with your <Link className="routing-bot-link" to="/bot">Bot Integration</Link> or set up your <Link className="routing-bot-link" to="/faq">FAQ</Link> section </p> 
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={!this.state.assignConversationToBot ? "n-vis":null}>
                                <div className="row" style={{marginTop: "42px"}}>
                                    <div className="col-md-10 col-sm-12">
                                        <p className="km-routing-assign-bot-text-1">All new conversations will be assigned to a single bot only. Other available bots (if any) will remain idle.</p>
                                    </div>
                                </div>
                                <div className="row" style={{marginTop: "28px"}}>
                                    <div className="col-md-7 col-sm-12" style={{marginTop: "20px"}}>
                                        <p className="km-routing-assign-bot-text-2">Select a bot to handle all new conversations: </p>
                                    </div>
                                    <div className="col-md-4 col-sm-12 drop-down-container" style={{ marginLeft: "-50px" }}>
                                        <DropdownButton title={this.state.dropDownBoxTitle}  className="drop-down-list-of-bots km-button km-button--secondary" id="#">
                                              {
                                                this.state.listOfBots.map( bot => {
                                                    return (
                                                        <MenuItem className="ul-list-of-bots" key={bot.id} onClick={()=>{
                                                            if (parseInt(bot.bot_availability_status) === 1) {
                                                                this.setState({"dropDownBoxTitle":bot.name}, () => {
                                                                    if (bot.allConversations == 0) {
                                                                        if(this.state.currentSelectedBot){
                                                                            conversationHandlingByBot(this.state.currentSelectedBot, 0)
                                                                        }
                                                                        conversationHandlingByBot(bot.userName, 1).then(response => {
                                                                            // console.log(response);
                                                                            if(response.data.code === "success"){
                                                                                Notification.info('Conversations assigned to ' + bot.name);
                                                                                window.Aside.loadAgents();
                                                                                this.getIntegratedBots();
                                                                            } else {
                                                                                 Notification.info('Conversations not assigned to ' + bot.name)
                                                                            }
                                                                        }).catch(err => {console.log(err)})
                                                                    } else if (bot.allConversations == 1) {
                                                                        Notification.info( bot.name + ' is already selected.')
                                                                    }
                                                                 })
                                                            } else if (parseInt(bot.bot_availability_status) === 0) {
                                                                Notification.warning( bot.name + ' is disabled')
                                                            }
                                                        }}>
                                                            <img src={Diaglflow} style={{ width: "39px", height: "37.5px"}} />
                                                            <span className="bot-name-drop-down-list">{bot.name}</span>
                                                            {
                                                                (parseInt(bot.bot_availability_status) === 1) ? <span style={{marginLeft: '5px'}} className="km-bot-list-of-integrated-bots-badge badge-enabled">Enabled</span>:<span style={{marginLeft: '5px'}} className="km-bot-list-of-integrated-bots-badge badge-disabled">Disabled</span>
                                                            }
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </DropdownButton>
                                    </div>
                                </div>
                                <div className="row" style={{marginTop: "73px"}}>
                                    <div className="col-md-11 col-sm-11">
                                        <p style={{ border: "1px solid #c0c0c0", padding:"6px"}} className="km-routing-assign-bot-text-3">Want more routing rules for bot assignment? <a className="see-docs-link" href="https://docs.kommunicate.io/docs/web-installation.html" target="_blank" >See Docs</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-block">
                    <div className="row agent-assignment-wrapper">
                        <div className="options-wrapper">
                            <div className="row" onClick={() => {this.setState({openAgentRoutingRules:!this.state.openAgentRoutingRules})}} style={{cursor: "pointer"}}>
                                <div className="col-md-8 col-sm-8">
                                    <h4 className="options-wrapper-title">Routing rules for agents </h4>
                                </div>
                                <div className="col-md-4 col-sm-4 text-center">
                                    <i className={this.state.openAgentRoutingRules ? "icon-arrow-up icons font-2xl d-blockx":"icon-arrow-down icons font-2xl d-blockx"}></i>
                                </div>
                            </div>
                            <form className={this.state.openAgentRoutingRules ? null:"n-vis"}>
                                <RadioButton idRadioButton={'notify-everybody-radio'} handleOnChange={this.handleRadioBtnNotifyEverybody}
                                    checked={this.state.checkedNotifyEverybody} label={notifyEverybodyContainer} />
                                 
                                <RadioButton idRadioButton={'automatic-assignemnt-radio'} handleOnChange={this.handleRadioBtnAutomaticAssignment}
                                    checked={this.state.checkedAutomaticAssignemnt} label={automaticAssignmentContainer} disabled={(CommonUtils.isTrialPlan())?false: (CommonUtils.isStartupPlan()) ? true : false}/>
                            
                                    {/* automatic message comming soon
                                    <div  >{automaticAssignmentContainer}</div>*/}
                            </form>
                            <div className={this.state.openAgentRoutingRules ? "row":"n-vis"} style={{backgroundColor: "#cce7f8"}}>
                                <span style={{padding: "6px"}} className="km-agent-routing-note-text"><strong>NOTE:</strong> An agent will also be assigned to every conversation irrespective of bot routing rules</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>            
    )
  }
}

export default AgentAssignemnt;