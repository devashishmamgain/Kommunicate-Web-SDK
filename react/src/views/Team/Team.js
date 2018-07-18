import React, { Component } from 'react';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import isEmail from 'validator/lib/isEmail';
import axios from 'axios';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import UserItem from '../UserItem/'
import {notifyThatEmailIsSent, getUsersByType} from '../../utils/kommunicateClient' ;
import '../MultiEmail/multiple-email.css'
import ValidationUtils from '../../utils/validationUtils'
import Notification from '../model/Notification';
import './team.css';
import CommonUtils from '../../utils/CommonUtils';
import { USER_TYPE, GROUP_ROLE, LIZ, DEFAULT_BOT } from '../../utils/Constant';
import { Agent } from 'https';
import Modal from 'react-modal';
import CloseButton from './../../components/Modal/CloseButton.js';
import InputField from '../../components/InputField/InputField.js';

const customStyles = {
  content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '580px',
      // maxWidth: '580px',
      overflow: 'visible'
  }
};

class Integration extends Component {
   constructor(props) {
    super(props);
    this.state = {
        email:'',
        result: [],
        multipleEmailAddress: [],
        emailAddress:"",
        adminUserId:"",
        agentsInfo:[],
        applicationId:"",
        hideErrorMessage:true
      };
      this.getUsers  = this.getUsers.bind(this);
      window.addEventListener("kmFullViewInitilized",this.getUsers,true);
      this.onOpenModal = this.onOpenModal.bind(this);
      this.onCloseModal = this.onCloseModal.bind(this);

  }
  componentWillMount() {
    this.getUsers();
    
    let userSession = CommonUtils.getUserSession();
    let adminUserName = userSession.adminUserName;
    let applicationId = userSession.application.applicationId;
    this.setState({
      adminUserId:adminUserName,
      applicationId:applicationId
    },this.getAgents);
  }
  getUsers = () => {
    var _this = this;
    window.$kmApplozic.fn.applozic("fetchContacts", {roleNameList: ['APPLICATION_ADMIN', 'APPLICATION_WEB_ADMIN'], 'callback': function(response) {
        _this.setState({result: response.response.users});
      }
    });
  }
  showEmailInput=(e)=>{
    e.preventDefault();
    this.setState({emailInstructions : true})
  }
  onOpenModal = () => {
    this.setState({modalIsOpen: true });
  };

  onCloseModal = () => {
    this.setState({ modalIsOpen: false });
  };
  validateEmail = (e) => {
    let email = this.state.email;
    var mailformat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

    if (email.match(mailformat)) {
      this.CloseButton();
      notifyThatEmailIsSent({ to: email, templateName: "INVITE_TEAM_MAIL" }).then(data => {
        console.log(data);
        email = "";
        this.setState({ email: email })
      });

    } else {
      Notification.error(email + " is an invalid Email");
      email = "";
      this.setState({email:email})
      return false;
    }
  }


  sendMail=(e)=>{
     const _this =this;
     console.log(_this.state.email);
    if(!_this.state.emailAddress && _this.state.multipleEmailAddress.length === 0){
      Notification.info("Please enter email address");
      return;
    }
    e.preventDefault();

    let multipleEmailAddress = this.state.multipleEmailAddress;
    if(isEmail(this.state.emailAddress)) {
        multipleEmailAddress = multipleEmailAddress.concat([this.state.emailAddress]);
        this.setState({ multipleEmailAddress: this.state.multipleEmailAddress.concat([this.state.emailAddress]) })
        this.setState({ emailAddress: '' });
    }
    if(multipleEmailAddress.length >= 1){
      for(let i = 0; i < multipleEmailAddress.length; i++){
        if(!isEmail(multipleEmailAddress[i])){
          Notification.error(multipleEmailAddress[i] + " is an invalid Email");
          return;
        }
      }

      for(let i = 0; i < multipleEmailAddress.length; i++){
        notifyThatEmailIsSent({to:multipleEmailAddress[i],templateName:"INVITE_TEAM_MAIL"}).then(data=>{
          _this.setState({multipleEmailAddress: [],emailAddress:""});
        });
      }

    }else{
      console.log(this.state.emailAddress)
      if(this.state.emailAddress&&!isEmail(this.state.emailAddress)){
        Notification.error(this.state.emailAddress + " is an invalid Email");
        return;
      }else{
        notifyThatEmailIsSent({to:this.state.emailAddress,templateName:"INVITE_TEAM_MAIL"}).then(data=>{
          _this.setState({multipleEmailAddress: [],emailAddress:""});

        });
      }
    }
  }
  getAgents() {
     var that = this;
     window.$kmApplozic("#assign").empty();
     let users = [USER_TYPE.AGENT, USER_TYPE.ADMIN,USER_TYPE.BOT];
     return Promise.resolve(getUsersByType(this.state.applicationId, users)).then(data => {
       let agentsInfo = data;
       this.setState({agentsInfo:agentsInfo})
     }).catch(err => {
       // console.log("err while fetching users list ", err);
     });
  }
  multipleEmailHandler=(e)=>{
    if(e.target.value.includes(' ')){
     // this.setState({emailAddress: ''})
    }else{
      this.setState({emailAddress: e.target.value});
    }
  }

  checkForSpace=(e)=>{
    if((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 13) && ValidationUtils.isValidEmail(this.state.emailAddress)) {
      this.setState({multipleEmailAddress: this.state.multipleEmailAddress.concat([this.state.emailAddress])})
      this.setState({emailAddress: ''})
    }

  }

  removeEmail=(removeEmail)=>{
    // console.log(this.state.multipleEmailAddress);
    const filteredEmails = this.state.multipleEmailAddress.filter(email => email !== removeEmail)
    this.setState({multipleEmailAddress: filteredEmails})
    // console.log(this.state.multipleEmailAddress);
  }
  onKeyPress = (e) => {
    console.log(e.target.value);
  }

  render() {
    var agentList = this.state.result;
    var getUsers = this.getUsers;
    var adminUserId = this.state.adminUserId;
    var agentsInfo = this.state.agentsInfo;
    // var availabilityStatus = 0;
    var isAway = false;
    var isOnline = false;
    // var isOffline = false;
    var result = this.state.result.map(function(result,index){
      let userId = result.userId;
      let isOnline = result.connected;
      if (!result.deactivated) {
        agentsInfo.map(function(user,i){
          if(userId == user.userName){
            // console.log(user.availabilityStatus);
            // availabilityStatus = user.availabilityStatus;
            if(user.availabilityStatus && isOnline ){
              //agent is online
              isOnline = true;
            } else if (!user.availabilityStatus && isOnline){
              //agent is away
              isAway= true;
            } else {
              //agent is offline
              isOnline = false

            }
          }
        })
        return <UserItem key={index} user={result} agentList={agentList} index={index} hideConversation="true" getUsers={getUsers} adminUserId = {adminUserId} isOnline= {isOnline} isAway ={isAway} />
      }
    });
    return (
      <div className="animated fadeIn teammate-table">
       <div className="row">
         <div className="col-md-12">
           <div className="card">
             <div className="card-block">
                 <h5 className="form-control-label teammates-description">See the list of all the team members, their roles, add new team members and edit member details.</h5>
                  <button className="km-button km-button--primary teammates-add-member-btn" onClick= {this.onOpenModal}>+Add a team member</button>
                 
             </div>
             <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.onCloseModal} style={customStyles} ariaHideApp={false} >
                <div className="teammates-add-member-modal-wrapper">
                  <div className="teammates-add-member-modal-header">
                    <p className="teammates-add-member-modal-header-title" >New team member</p>
                  </div>
                  <hr className="teammates-add-member-modal-divider" />
                  <div className="teammates-add-member-modal-content-wrapper">
                    <h5 className="teammates-add-member-modal-content-title">Whom do you want to add?</h5>
                    {/* <InputField inputType={'email'}  title={'Email Id'} name={'email'} controlFunc={this.setEmail} content={this.state.email} errorMessage={this.state.errorMessageText} 
                   hideErrorMessage={this.state.hideErrorMessage} required={'required'} blurFunc ={this.state.handleUserNameBlur} keyPressFunc={this.onKeyPress} />  */}
                   <input type="text" className="form-control email-field" id="email-field" 
								  onChange={(e) => {
									let email = this.state.email;
									email = e.target.value;
									this.setState({ email: email  })
								  }}
									
								 placeholder="Enter your email" />
                  </div>
                  <div className="teammates-add-member-modal-btn">
                    <button className="km-button km-button--secondary teammates-add-member-modal-cancel-btn" onClick = {this.onCloseModal}>Cancel</button>
                    <button className="km-button km-button--primary teammates-add-member-modal-add-btn" onClick= {this.validateEmail}>Add member</button>
                  </div>  
                </div>  
              <span onClick={this.onCloseModal}><CloseButton /></span>
              </Modal>
             {/* <div className="card-block">
                 <label className="form-control-label invite-team" htmlFor="invite">Invite Your Team</label>
                 <div className="col-md-9 row email-field-wrapper ">
                 <div className="form-group col-md-5 multiple-email-box">
                   {this.state.multipleEmailAddress.map((email, i) => (
                     <div className="single-email-container" key={i}>
                       <span>{email}</span>
                       <span className="remove-email" onClick={() => {this.removeEmail(email)}}>| X</span>
                     </div>
                   ))}
                   <input className="input-email" value={this.state.emailAddress} onKeyDown={this.checkForSpace} onChange={this.multipleEmailHandler}  placeholder="You can enter multiple emails here" style={{paddingLeft: "10px", borderRadius: "4px"}}/>
                 </div>
                 </div>
             </div> */}
              {/* <div className="card-block invite-btn-wrapper">
                <button type="button" onClick={this.sendMail} className="km-button km-button--primary"><i className="fa fa-dot-circle-o"></i> Invite</button>
              </div> */}
           </div>
         </div>
         <div className="col-md-12">
           <div className="card">
             <div className="card-block">
               {/* <label className="col-md-3 form-control-label invite-team" htmlFor="invite">Team</label> */}
               <table className="table table-hover mb-0 hidden-sm-down">
                 <thead className="thead-default">
                   <tr>
                      {/* <th className="text-center"><i className="icon-people"></i></th> */}
                      <th className="team-name-title">Name</th>
                      <th>Email id</th>
                      <th>Role</th>
                      {/* <th>Last Activity</th> */}
                      <th>Status</th>
                      <th className="team-th-delete-edit">Delete</th>
                      <th className="text-center n-vis">Add Info</th>
                      <th className="text-center n-vis">Actions</th>
                      <th className="text-center n-vis">Country</th>
                      <th className="n-vis">Usage</th>
                      <th className="text-center n-vis">Payment Method</th>
                      <th className="n-vis">Activity</th>
                   </tr>
                 </thead>
                 <tbody>
                   {result}
                 </tbody>
               </table>
             </div>
           </div>
         </div>
       </div>
      </div>

    )
  }
  }

  export default Integration;
