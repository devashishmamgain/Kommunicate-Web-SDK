import React, { Component } from 'react';
import './EmailFallback.css';
import CommonUtils from '../../utils/CommonUtils';
import Notification from '../../views/model/Notification';
import axios from 'axios';
import { getConfig } from '../../config/config';
import { SettingsHeader } from '../../../src/components/SettingsComponent/SettingsComponents';
// import SliderToggle from '../../components/SliderToggle/SliderToggle';
import LockBadge from '../../components/LockBadge/LockBadge';
import { editApplicationDetails, sendProfileImage } from '../../utils/kommunicateClient';
import KMLogo from '../Faq/LizSVG';
import ThirdPartyScripts from '../../utils/ThirdPartyScripts';
export default class EmailFallback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            switchIsEnabled: true,
            uploadedCompanyLogo: CommonUtils.getUserSession().application.companyLogo,
            uploadImageText: "Replace",
            disableUploadBtn: false
        };
        this.handleFileOnChange = this.handleFileOnChange.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.submitWebhooksDetails = this.submitWebhooksDetails.bind(this);
    }
    handleFileOnChange(e) {
        var file = e.target.files[0];
        if(file) {
            this.setState({
                uploadImageText: "Uploading...",
                disableUploadBtn: true
            })
        }
        
        this.uploadImage(file);
    }


    uploadImage = (file) => {
        let that=this;
        if (file) {
            sendProfileImage(file, `${CommonUtils.getUserSession().application.applicationId}-${file.name}`)
            .then(response => {
                if (response.data.code === "SUCCESSFUL_UPLOAD_TO_S3") {
                    that.setState({ uploadedCompanyLogo: response.data.profileImageUrl });
                    Notification.info(response.data.message);
                    let imgTag = document.querySelector("#branding_logo--image-placeholder img");
                    imgTag.src = response.data.profileImageUrl;
                    that.submitWebhooksDetails();
                    that.setState({
                        uploadImageText: "Replace",
                        disableUploadBtn: false
                    });
                } else if (response.data.code === "FAILED_TO_UPLOAD_TO_S3") {
                    Notification.info(response.data.message);
                    that.setState({
                        uploadImageText: "Replace",
                        disableUploadBtn: false
                    });
                }
            })
            .catch(err => {
                Notification.info("Error while uploading")
                that.setState({
                    uploadImageText: "Replace",
                    disableUploadBtn: false
                });
            })
        } else {
            Notification.info("No file to upload")
            that.setState({
                uploadImageText: "Replace",
                disableUploadBtn: false
            });
        }
    }

    submitWebhooksDetails = () => {
        let userSession = CommonUtils.getUserSession();
        let applicationData = userSession;

        let companyLogo = this.state.uploadedCompanyLogo;

        applicationData.application.companyLogo = companyLogo;

        Promise.resolve(editApplicationDetails(applicationData)).then((response) => {
            CommonUtils.setUserSession(applicationData);
        }).catch((error) => {
            console.log(error);
        })
    }

    render() {
        let defaultLogoClass = "";
        if(this.state.uploadedCompanyLogo.indexOf('/img/logo02.png') > 0) {
            defaultLogoClass = "km-default-logo";
        }

        return (
            <div className="animated fadeIn email-fallback-div">
                <div className="km-heading-wrapper">
                    <SettingsHeader />
                </div>
                <div className="row">
                    <div className=" col-md-8 col-sm-12">

                        <div className="email-fallback--branding-container">
                            <h3>Branding in fallback emails:</h3>
                            <p className="email-fallback--branding-description">We use the Kommunicate logo in the fallback emails by default. You can give the fallback emails your brand identity by replacing the below Kommunicate logo with your own.</p>
                            <div className="email-fallback--branding_logo-container">
                                <div className="branding_logo--image-upload">
                                    <p className="email-fallback--branding-description">Logo used in fallback mails:</p>
                                    <div id={`branding_logo--image-placeholder`} className={`branding_logo--image-placeholder ${defaultLogoClass}`}>
                                        <img src={this.state.uploadedCompanyLogo} />
                                    </div>
                                    {(CommonUtils.isTrialPlan()) ? <div>
                                        <input type="file" name="file" id="email-fallback-file" className="inputfile" onChange={this.handleFileOnChange} accept=".jpg, .jpeg, .png" disabled={this.state.disableUploadBtn}/>
                                        <label htmlFor="email-fallback-file">{this.state.uploadImageText}</label>
                                    </div> : (CommonUtils.isStartupPlan()) ? <LockBadge className={"lock-with-text"} text={"Available in Growth Plan"} history={this.props.history} onClickGoTo={"/settings/billing"} /> : <div>
                                        <input type="file" name="file" id="email-fallback-file" className="inputfile" onChange={this.handleFileOnChange} accept=".jpg, .jpeg, .png" disabled={this.state.disableUploadBtn}/>
                                        <label htmlFor="email-fallback-file">{this.state.uploadImageText}</label>
                                    </div>}
                                </div>



                            </div>
                            <hr />
                        </div>
                        {/* COMMENTING BELOW CODE BECAUSE THE FUNCTIONALITY IS NOT YET CREATED FROM API SIDE */}
                        {/* <div className="email-fallback--how-to-container">
                            <h3>How to send fallback emails?</h3>
                            <div className="email-fallback--how-to_toggle-switch">
                                <div className="email-fallback--branding-description">
                                    Allow Kommunicate to send all fallback emails
                                </div>
                                <div>
                                    <SliderToggle checked={this.state.switchIsEnabled} handleOnChange={this.handleToggleSwitch} />
                                </div>
                            </div>
                            <p className="email-fallback--branding-description">We will stop sending fallback emails to your users from our side. Just set up the API URLs from the Webhook Setup section to get the relevant data from us. You can use the data to send fallback emails from your end.</p>
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }
} 