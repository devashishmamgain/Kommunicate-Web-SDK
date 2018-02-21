import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {getJsCode, getJsInstructions} from '../../../utils/customerSetUp';

import Notification from '../../model/Notification';
import MultiEmail from '../../MultiEmail/';
import Integration from '../../Settings/Integration/';
import CommonUtils from '../../../utils/CommonUtils';

class Step3 extends Component {
 static defaultProps ={ hideSkipForNow : true }
	constructor(props) {
		super(props);

    this.state = {
      hideNextBtn:false
    }

    this.jsScript = getJsCode();
    this.jsInstructions = getJsInstructions();
	}

  componentDidMount(){
		//document.getElementById('instruction-display-area').innerHTML=getJsInstructions();
  }

  componentWillMount(){
    if(this.props.location && this.props.location.pathname ==="/installation" &&this.props.location.search){
      //const search = encodeURIComponent(this.props.location.search);
      let paramArray = this.props.location.search.substr(1).split("&");
      let params = {};
      for(var i=0;i<paramArray.length;i++){
        var item = paramArray[i].split("=");
        params[item[0]]=item[1];
      }
      console.log("search",params);
       localStorage.setItem("agentId",params.agentId||"default_agent_id");
       localStorage.setItem("agentName",params.agentName||"agent_display_name");

       let userSession = CommonUtils.getUserSession();
       if (!userSession.application) {
          console.log("application not found in user session, creating {}");
          userSession.application = {};
       }
       userSession.application.applicationId = params.applicationId||"your _application_id";
       CommonUtils.setUserSession(userSession);

       this.setState({
        hideNextBtn : true
       })
       }
  }
  jumpToDashboard = (e) => {
		e.preventDefault()
		this.props.history.push('/dashboard');
	}

  render() {
    return (
      <form>
        <div className="col-lg-12 text-center">
          <div className={this.props.hideSkipForNow? "step-number-div" : "n-vis"}>
            3/3
          </div>
          <h1 className="setup-heading">{this.props.pageTitle}Integration</h1>
          <h4 className="setup-sub-heading">Install Kommunicate to your product within <strong>2 minutes</strong></h4>
          <h2 className="setup-integration-later-text">Installation instructions can also be found inside <span>Settings > CONFIGURATION > Install</span> later</h2>
          <div className="button-link-container">
          <MultiEmail template="SEND_KOMMUNICATE_SCRIPT" />
          </div>
          <hr></hr>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-10">
            <Integration customerInfo={this.props.customerInfo}cardSize={12}/>
            <div className="form-group">
          <button className={this.props.hideSkipForNow? "n-vis" : "btn btn-sm btn-primary px-4 ml-40 btn-primary-custom"} onClick={this.jumpToDashboard} hidden={this.state.hideNextBtn}> Finish setup</button>
        </div>
          </div>
        </div>
      </form>
    )
  }
}

export default Step3