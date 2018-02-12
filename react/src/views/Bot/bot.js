import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import BotDescription from './BotDescription.js';
import Notification from '../model/Notification';
import {getUsersByType,createCustomerOrAgent, callSendEmailAPI, getIntegratedBots} from '../../utils/kommunicateClient';
import CommonUtils from '../../utils/CommonUtils';
import Cato from './images/cato-bot-integration.png'
import Amazon from './images/amazon-icon.png'
import Diaglflow from './images/dialogflow-icon.png'
import Microsoft from './images/microsoft-icon.png'
import Tick from './images/tick-icon.png'
import KmIcon from './images/km-icon.png'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class Tabs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1',
      descriptionType :"ADD_BOT",
      descriptionHeader:"Step 1",
      userid: '',
      username: '',
      password:'',
      role :'BOT',
      bot: '',
      ctoken: '',
      platform:'api.ai',
      dtoken :'',
      // amap of {botId :botName}
      botOptionList:[],
      useCaseModal: false,
      dialogFlowModal: false,
      botProfileModal: false,
      otherPlatformModal: false,
      editBotIntegrationModal: false,
      deleteBotIntegrationModal: false,
      useCaseSubmitted: false,
      clientToken: '',
      devToken: '',
      showNewBot: true,
      showOldBot: false,
      botUseCaseText: '',
      otherPlatformText: '',
      botName: '',
      dialogFlowIntegrated: false,
      microsoftIntegrated: false,
      amazonIntegrated: false,
      botNameAlreadyExists: false,
      disableIntegrateBotButton: false,
      listOfIntegratedBots: [],
    };
  let userSession = CommonUtils.getUserSession();
  this.applicationId = userSession.application.applicationId;

  this.toggle = this.toggle.bind(this);
   };
   componentWillMount =()=>{
    //this.populateBotOptions();
   }
  componentDidMount=()=>{
    //console.log("options",this.state.botListInnerHtml);

    getIntegratedBots().then(response => {
      console.log(response);
      this.setState({
        listOfIntegratedBots: response
      })
    });
  
  }

  clearBotForm = ()=>{
    this.state.userid="";
    this.state.username="";
    this.state.password="";
    this.state.bot="";
    this.state.ctoken="";
    this.setState({dtoken:""});
   }
   
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  populateBotOptions=()=>{
    var _this =this;
    Promise.resolve(getUsersByType(this.applicationId,2)).then(data=>{
      console.log("received data",data);
      //_this.state.botOptionList.push({"value":"","label":"Select",disabled:true,selected:true,clearableValue:false});
      data.forEach(function(elem){
        let botName =elem.name||elem.userName;
        let botId =elem.userName;
        //_this.state.botNameMap[botId] =botName;
        _this.state.botOptionList.push({value:botId,label:botName});
        _this.setState({botOptionList:_this.state.botOptionList});
      });
    }).catch(err=>{
      console.log("err while fetching bot list ",err);
    });
  }
  handleClickOnConfigureTab=()=>{
     this.toggle('2'); 
     this.state.descriptionType = "CONFIGURE_BOT";
     this.state.descriptionHeader="Step 2";
     this.state.botOptionList=[];
     this.populateBotOptions();
  }
  handleOnChangeforBotId =(e)=>{
        
        this.setState({userid:e.target.value});
  }

  toggleUseCaseModal = () => {
      this.setState({
          useCaseModal: !this.state.useCaseModal
      });
    }

  submitEmail = (type) => {

    if(type === "USE_CASE_REQUEST" && this.state.botUseCaseText.trim().length > 0){

      let options = {
       templateName: "BOT_USE_CASE_EMAIL",
       botUseCase: this.state.botUseCaseText,
       subject: "Custom Bot Request"
      }

      callSendEmailAPI(options).then(response => {
        console.log(response);
        if(response.status ==  200 && response.data.code == "SUCCESS"){
          Notification.success("Use case submitted");
          this.toggleUseCaseModal()
          this.setState({
            useCaseSubmitted: true,
            botUseCaseText: ''
          })
        }
      });
    }else if(type === "BOT_PLATFORM_REQUEST" && this.state.otherPlatformText.trim().length > 0){

      let options = {
       templateName: "BOT_USE_CASE_EMAIL",
       botUseCase: this.state.otherPlatformText,
       subject: "Other Bot Platform Request"
      }

      callSendEmailAPI(options).then(response => {
        console.log(response);
        if(response.status ==  200 && response.data.code == "SUCCESS"){
          Notification.success("Other bot platform request submitted");
          this.toggleOtherPlatformModal()
          this.setState({otherPlatformText: ''})
        }
      });
    }else if(this.state.botUseCaseText.trim().length < 1 || this.state.otherPlatformText.trim().length < 1 ){
      Notification.info("Please enter the text");
    }
  }

  toggleDialogFlowModal = () => {
      this.setState({
          dialogFlowModal: !this.state.dialogFlowModal
      });
    }

  toggleBotProfileModal = () => {
    this.setState({
        botProfileModal: !this.state.botProfileModal
    });
  }

  integrateBot = (aiPlatform) => {

    if(!this.state.botName){
      Notification.info("Bot name missing");
      return;
    }else if(!this.state.clientToken){
      Notification.info("Client token missing");
      return;
    }else if(!this.state.devToken){
      Notification.info("Dev Token missing");
      return;
    }

    let _this =this;

    let data = {
      clientToken : this.state.clientToken,
      devToken : this.state.devToken,
      aiPlatform : aiPlatform,
      botName:this.state.botName,
    }

    let userSession = CommonUtils.getUserSession();
    let applicationId = userSession.application.applicationId;
    let authorization = userSession.authorization;
    let password = CommonUtils.getUserSession().password;
    let device = atob(authorization);
    let devicekey = device.split(":")[1];
    let env = getEnvironmentId();
    let userDetailUrl =getConfig().applozicPlugin.userDetailUrl;
    let userIdList = {"userIdList" : [this.state.botName]}

    this.setState({disableIntegrateBotButton: true})

    this.checkBotNameAvailability().then( bot => {
      axios({
      method: 'post',
      url:userDetailUrl,
      data: userIdList,
      headers: {
        "Apz-Product-App": true,
        "Apz-Token": 'Basic ' + new Buffer(CommonUtils.getUserSession().userName+':'+CommonUtils.getUserSession().password).toString('base64'),
        "Content-Type": "application/json",
        "Apz-AppId":applicationId
      }}).then(function(response) {
        if(response.status==200 ){
          console.log(response);
          console.log("success");
          axios({
            method: 'post',
            url:getConfig().applozicPlugin.addBotUrl+"/"+response.data.response[0].id+'/configure',
            data:JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            }
          }).then(function(response){
            if(response.status==200 ){
              _this.clearBotForm();
              Notification.info("Bot integrated successfully");
              _this.setState({disableIntegrateBotButton: false}) 
              if(aiPlatform === "dialogflow"){
                _this.setState({dialogFlowIntegrated: true})
              }else if( aiPlatform === "microsoft"){
                _this.setState({microsoftIntegrated: true})
              }else{

              }
              _this.toggleBotProfileModal()
            }
          });
        }
      });
    }).catch( err => {
      if(err.code=="USER_ALREADY_EXISTS"){
        // _this.setState({botNameAlreadyExists:true})
        Notification.info("Bot name taken. Try again.");
      }else{
        Notification.error("Something went wrong");
        console.log("Error creating bot", err);
      }
      this.setState({disableIntegrateBotButton: false})
    })
  }

  toggleOtherPlatformModal = () => {
    this.setState({
      otherPlatformModal: !this.state.otherPlatformModal
    })
  }

  openBotProfileModal = () => {
    if(this.state.clientToken.trim().length < 1){
      Notification.info("Client Token is empty");
      return;
    }else if(this.state.devToken.trim().length < 1){
      Notification.info("Dev Token is empty");
      return;
    }else if( this.state.clientToken.trim().length > 0 && this.state.devToken.trim().length > 0 ){
      this.toggleDialogFlowModal()
      this.toggleBotProfileModal()
    }
  }

  checkBotNameAvailability() {

    if(!this.state.botName){
      Notification.info("Please enter a bot name !!");
      return;
    }

    let userSession = CommonUtils.getUserSession();
    let applicationId = userSession.application.applicationId;

    return Promise.resolve(
      createCustomerOrAgent({
        userName:this.state.botName,
        type:2,
        applicationId:applicationId,
        password:this.state.botName,
        name:this.state.botName
      },"BOT")).then( bot => {
        Notification.info("Bot successfully created");
        return bot;
      })
  }

  toggleEditBotIntegrationModal = () => {
    this.setState({
      editBotIntegrationModal: !this.state.editBotIntegrationModal
    })
  }

  toggleDeleteBotIntegrationModal = () => {
    this.setState({
      deleteBotIntegrationModal: !this.state.deleteBotIntegrationModal
    })
  }

  render() {
    return (
      <div className="animated fadeIn" >
      {/* Change showNewBot to false to hide new bot section*/}
        <div className="card" style={{display: this.state.showNewBot ? null:"none"} }>
          <div className="card-block">
            <div style={{width: "60%", margin: "0 auto"}}>
              <div className="row">
                <div className="col-sm-12 km-bot-integration-heading">
                  <p>Integrating a bot will allow you to send answers to some customer <br />queries automatically</p>
                </div>
              </div>
              <div className={this.state.listOfIntegratedBots.length > 0 ? "mt-4 km-bot-integrated-bots-container":"n-vis"}>
                <div style={{height:"4px", backgroundColor: "#5C5AA7"}}></div>
                <div style={{padding: "10px"}}>
                  <h3>My Integrated Bots</h3>
                  <hr />
                </div>
                <div className="km-bot-list-of-integrated-bots-container">
                  {this.state.listOfIntegratedBots.map(bot => (
                    <div>
                      <div className="row col-sm-12" key={bot.id}>
                        <div className="row col-sm-6">
                          <div className="col-sm-2">
                            <img src={Diaglflow} className="km-bot-integration-dialogflow-icon km-bot-integration-icon-margin" />
                          </div>
                          <div className="col-sm-2">
                            <span>{"DialogFlow"}<br />{bot.name}</span>
                          </div> 
                        </div>
                        <div className="col-sm-3">
                          <p>Enabled</p>
                        </div>
                        <div className="col-sm-3" style={{textAlign: "right"}}>
                          <button className="btn btn-primary" onClick={this.toggleEditBotIntegrationModal}>
                            Edit
                          </button>
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))}
                </div>
              </div>
              <div className={!this.state.useCaseSubmitted ? "row mt-4 km-bot-integration-second-container":"n-vis"}>
                <div className="col-sm-6 km-bot-integration-second-container-text-container">
                  <p>Want a custom bot?</p>
                  <p>Tell us your bot use-case and we will take <br />care of everything else</p>
                  <p onClick={this.toggleUseCaseModal}>REQUEST CUSTOM BOT</p>
                </div>
                <div className="col-sm-1">
                </div>
                <div className="col-sm-4 km-bot-integration-second-container-cato-container">
                  <img src={Cato} className="km-bot-integration-cato" />
                </div>
              </div>
              <div className={this.state.useCaseSubmitted ? "row mt-4 km-bot-integration-use-case-sbmt-container":"n-vis"}>
                <div className="col-sm-1 km-bot-integration-tick-container">
                  <img src={Tick} className="km-bot-integration-tick-icon" />
                </div>
                <div className="col-sm-9 km-bot-integration-use-case-sbmt-text-container">
                  <p>Use case submitted. We will get back to you over phone or <br />email soon with more details.</p>
                  <p>Schedule a call with our Product Team right away if you have something more to add. We will be glad to assist !!</p>
                  <a className="btn schedule-call-btn" href="https://calendly.com/kommunicate/15min" target="_blank">Schedule a Call</a>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-sm-2">
                </div>
                <div className="col-sm-8 km-bot-integration-third-container">
                  <p><strong>OR</strong>, integrate a bot from one of the platforms below</p>
                </div>
                <div className="col-sm-2">
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-sm-3" style={{textAlign: "center"}}>
                  <p className={this.state.dialogFlowIntegrated ? null:"n-vis" } style={{"color": "#22d674"}}>Integrated</p>
                </div>
                <div style={{textAlign: "center", width:"12.5%"}}>
                  <p></p>
                </div>
                <div className="col-sm-3" style={{textAlign: "center"}}>
                  <p className={this.state.microsoftIntegrated ? null:"n-vis" } style={{"color": "#22d674"}}>Integrated</p>
                </div>
                <div style={{textAlign: "center", width:"12.5%"}}>
                  <p></p>
                </div>
                <div className="col-sm-3" style={{textAlign: "center"}}>
                  <p className={this.state.amazonIntegrated ? null:"n-vis" } style={{"color": "#22d674"}}>Integrated</p>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3 km-bot-integration-logo-container" style={{textAlign: "center"}}>
                  <div className={this.state.dialogFlowIntegrated ? null:"n-vis" } style={{height:"4px", backgroundColor: "#22d674"}}></div>
                  <img src={Diaglflow} className="km-bot-integration-dialogflow-icon km-bot-integration-icon-margin" />
                  <p className="km-bot-integration-dialogflow-text">Dialogflow <br />(Api.ai)</p>
                  <p onClick={this.toggleDialogFlowModal} style={{cursor: "pointer", color: "#5c5aa7"}}>Settings</p>
                </div>
                <div style={{textAlign: "center", width:"12.5%"}}>
                  <p></p>
                </div>
                <div className="col-sm-3 km-bot-integration-logo-container" style={{textAlign: "center"}}>
                  <div className={this.state.microsoftIntegrated ? null:"n-vis" } style={{height:"4px", backgroundColor: "#22d674"}}></div>
                  <img src={Microsoft} className="km-bot-integration-microsoft-icon km-bot-integration-icon-margin" />
                  <p className="km-bot-integration-microsoft-text">Microsoft Bot <br />Framework</p>
                  <p className="km-bot-integration-coming-soon">Coming Soon</p>
                </div>
                <div style={{textAlign: "center", width:"12.5%"}}>
                  <p></p>
                </div>
                <div className="col-sm-3 km-bot-integration-logo-container" style={{textAlign: "center"}}>
                  <div className={this.state.amazonIntegrated ? null:"n-vis" } style={{height:"4px", backgroundColor: "#22d674"}}></div>
                  <img src={Amazon} className="km-bot-integration-amazon-icon km-bot-integration-icon-margin" />
                  <p className="km-bot-integration-amazon-text">Amazon Lex</p>
                  <p className="km-bot-integration-coming-soon">Coming Soon</p>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-sm-12" style={{textAlign: "center"}}>
                  <a className="btn km-bot-integration-other-pltform km-bot-cursor-pointer" onClick={this.toggleOtherPlatformModal}>Have some other platform in mind? Let us know</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={this.state.useCaseModal} toggle={this.toggleUseCaseModal} className="modal-dialog">
          <ModalHeader toggle={this.toggleUseCaseModal}>
            <img src={KmIcon} className="km-bot-integration-dialogflow-icon" />
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-sm-12">
                <p className="km-bot-integration-use-case-modal-text">Please explain your bot use case:</p>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <textArea rows="5" className="form-control" style={{resize: "none"}} placeholder="Example: I need a bot for hotel booking. It should be able to manage bookings." onChange={(event) => this.setState({botUseCaseText: event.target.value})} value={this.state.botUseCaseText} />
              </div>
            </div>
            <div className="row" style={{marginTop: "66px"}}>
              <div className="col-sm-12 text-right">
                <button className="btn btn-primary" onClick={ () => {this.submitEmail("USE_CASE_REQUEST")} }>
                  Submit Usecase
                </button>
              </div>  
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.otherPlatformModal} toggle={this.toggleOtherPlatformModal} className="modal-dialog">
          <ModalHeader toggle={this.toggleOtherPlatformModal}>
            <img src={KmIcon} className="km-bot-integration-dialogflow-icon" />
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-sm-12">
                <p className="km-bot-integration-use-case-modal-text">Please explain other bot platform:</p>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <textArea rows="5" className="form-control" style={{resize: "none"}} placeholder="Example: I need to integrate with this bot platform." onChange={(event) => this.setState({otherPlatformText: event.target.value})} value={this.state.otherPlatformText} />
              </div>
            </div>
            <div className="row" style={{marginTop: "66px"}}>
              <div className="col-sm-12 text-right">
                <button className="btn btn-primary" onClick={ () => {this.submitEmail("BOT_PLATFORM_REQUEST")}}>
                  Submit Platform Request
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.dialogFlowModal} toggle={this.toggleDialogFlowModal} className="modal-dialog">
          <ModalHeader toggle={this.toggleDialogFlowModal}>
            <img src={Diaglflow} className="km-bot-integration-dialogflow-icon" />
            <span className="km-bot-integration-use-case-modal-text">Integrating your Dialogflow bot with Kommunicate</span>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-sm-12">
                <p className="km-bot-integration-use-case-modal-text">Instructions:</p>
                <BotDescription />
              </div>
            </div>
            <div className="row">
              <label className="col-sm-3" htmlFor="hf-password">Client Token:</label>
              <div className="col-sm-9">
                <input type="text" onChange = {(event) => this.setState({clientToken:event.target.value})} value ={this.state.clientToken} name="hf-password" className="form-control input-field"/>
              </div>
            </div>
            <div className="row mt-4">
              <label className="col-md-3" htmlFor="hf-password">Dev Token:</label>
              <div className="col-md-9">
                <input type="text" onChange = {(event) => this.setState({devToken:event.target.value})} value ={this.state.devToken} name="hf-password" className="form-control input-field"/>
              </div>
            </div>
            <div className="row" style={{marginTop: "66px"}}>
              <div className="col-sm-12 text-right">
                <button className="btn btn-primary" onClick={this.openBotProfileModal}>
                  Next
                </button>
              </div>  
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.botProfileModal} toggle={this.toggleBotProfileModal} className="modal-dialog">
          <ModalHeader toggle={this.toggleBotProfileModal}>
            <img src={KmIcon} className="km-bot-integration-dialogflow-icon" />
            <span style={{fontSize: "14px", color: "#6c6a6a", marginLeft: "10px"}}>Bot Profile</span>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-sm-12">
                <p className="km-bot-integration-use-case-modal-text">Give a name to your bot from DialogFlow   </p>
              </div>
            </div>
            <div className="row" style={{marginTop: "75px"}}>
              <label className="col-sm-3" htmlFor="hf-password">Bot Name:</label>
              <div className="col-sm-6">
                <input type="text" onChange = {(event) => this.setState({botName:event.target.value})} value ={this.state.botName} name="hf-password" className="form-control input-field" placeholder="Example: Alex, Bot " />
              </div>
            </div>
            <div className="row" style={{marginTop: "0px"}}>
              <label className="col-sm-3" htmlFor="hf-password"></label>
              <div className="col-sm-7">
                <span className={this.state.botNameAlreadyExists ? "n-vis":"help-block km-bot-profile-modal-text"}>The name you select here will be seen <br /> by your customers</span>
                <span className={this.state.botNameAlreadyExists ? "help-block":"n-vis"} style={{color: "red"}}>Bot name is taken. Try again.</span>
              </div>
            </div>
            <div className="row" style={{marginTop: "66px"}}>
              <div className="col-sm-12 text-right">
                <button className="btn btn-primary" onClick={() => {this.integrateBot("dialogflow")}} disabled={this.state.disableIntegrateBotButton}>
                  Integrate and Setup Bot Profile
                </button>
              </div>  
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.editBotIntegrationModal} toggle={this.toggleEditBotIntegrationModal} className="modal-dialog">
          <ModalHeader toggle={this.toggleEditBotIntegrationModal}>
            <img src={Diaglflow} className="km-bot-integration-dialogflow-icon" />
            <span style={{fontSize: "14px", color: "#6c6a6a", marginLeft: "10px"}}>Edit Bot Profile</span>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <label className="col-sm-3">Client Token:</label>
              <div className="col-sm-6">
                <input type="text" onChange = {(event) => this.setState({clientToken:event.target.value})} value ={this.state.clientToken} name="hf-password" className="form-control input-field"/>
              </div>
            </div>
            <div className="row mt-4">
              <label className="col-md-3">Dev Token:</label>
              <div className="col-md-6">
                <input type="text" onChange = {(event) => this.setState({devToken:event.target.value})} value ={this.state.devToken} name="hf-password" className="form-control input-field"/>
              </div>
            </div>
            <div className="row mt-4">
              <label className="col-sm-3">Bot Name:</label>
              <div className="col-sm-6">
                <input type="text" onChange = {(event) => this.setState({botName:event.target.value})} value ={this.state.botName} name="hf-password" className="form-control input-field" placeholder="Example: Alex, Bot " />
              </div>
            </div>
            <div className="row" style={{marginTop: "66px"}}>
              <div className="col-sm-6">
              </div> 
              <div className="row col-sm-6 text-right">
                <div className="row col-sm-6">
                  <button className="btn btn-primary" onClick={ () => {this.toggleDeleteBotIntegrationModal(); this.toggleEditBotIntegrationModal();}}>
                    Delete Integration
                  </button>
                </div>
                <div className="row col-sm-6">
                  <button className="btn btn-primary" >
                    Save Changes
                  </button>
                </div>
              </div>  
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.deleteBotIntegrationModal} toggle={this.toggleDeleteBotIntegrationModal} className="modal-dialog">
          <ModalHeader toggle={this.toggleDeleteBotIntegrationModal}>
            <span style={{fontSize: "14px", color: "#6c6a6a", marginLeft: "10px"}}>Delete Integration</span>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-sm-12">
                <p className="km-bot-integration-use-case-modal-text">Are you sure you want to delete this integration? </p>
              </div>
            </div>
            <div className="row" style={{marginTop: "75px"}}>
            </div>
            <div className="row" style={{marginTop: "66px"}}>
              <div className="col-sm-6">
              </div> 
              <div className="row col-sm-6 text-right">
                <div className="row col-sm-6 text-right">
                  <button className="btn btn-primary" >
                    Cancel
                  </button>
                </div>
                <div className="row col-sm-6 text-right">
                  <button className="btn btn-primary" >
                    Delete
                  </button>
                </div>
              </div>  
            </div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

// "key" : "0376d7e9-dfad-4121-8632-e3e29c532573",
// "name" : "bot",
// "applicationKey" : "31ac5a02baeb4dce22eb06a0abf3b1fa7",
// "accessToken" : "bot", //password
// "authorization" : "Ym90OjgyNGRiNmNmLWFiYjgtNDkzZS04MDk1LTdjYjAxMDRmNDAzNw==", //base64(userName:password)
// "brokerUrl" : "tcp://apps.applozic.com:8080",
// "platform" : "aiPlatform",
// "clientToken": "4372f06b2a214580a8dc20d782c4e29c", // get from user
// "devToken": "0662feba0ad84bfb9455cb0205afb66f",  // get from user
// "deleted" : false,
// "type" : "KOMMUNICATE_SUPPORT",
// // "handlerModule": "DEFAULT_KOMMUNICATE_SUPPORT_BOT" // 

export default Tabs;