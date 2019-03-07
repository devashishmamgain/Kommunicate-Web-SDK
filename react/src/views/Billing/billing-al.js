import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import Modal from 'react-modal';
import moment from 'moment';
import CloseButton from '../../components/Modal/CloseButton';
import CommonUtils from '../../utils/CommonUtils';
import './billing.css';
import AnalyticsTracking from '../../utils/AnalyticsTracking';
import ApplozicClient, {SUBSCRIPTION_PACKAGES, PRICING_PLANS} from '../../utils/applozicClient';
import { getConfig } from '../../config/config';
import MultiToggleSwitch from '../../components/MultiToggleSwitch';
import Button from '../../components/Buttons/Button';
import { SettingsHeader } from '../../components/SettingsComponent/SettingsComponents';
import AlBillingPlansTables from './AlBillingPlansTables';
import { ConfirmationTick } from '../../assets/svg/svgs';
import Notification from '../model/Notification';


class BillingApplozic extends Component {

    constructor(props) {
        super(props);

        let subscription = CommonUtils.getUserSession().subscription;
        if (typeof CommonUtils.getUserSession().subscription === 'undefined' || CommonUtils.getUserSession().subscription == '' || CommonUtils.getUserSession().subscription == '0') {
            subscription = 'startup';
        }

        let that = this;
        let stripeHandler = StripeCheckout.configure({
            key: getConfig().applozic.stripe,
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: function(token) {
                that.state.stripeHandlerCallback(token);
            }
          });

        this.state = {
            stripeHandler: stripeHandler,
            stripeHandlerCallback: that.subscribe,
            modalIsOpen: false,
            subscription: subscription,
            currentPlan: '',
            trialLeft: 0,
            showPlanSelection: false,
            currentPlanDetailsText: "Trial period plan details",
            seatsBillable: "",
            planHeading: "",
            nextBillingDate: 0,
            totalPlanAmount: 0,
            disableSelectedPlanButton: false,
            clickedPlan:  'startup',
            currentModal: "",
            billingCycleText: "Monthly",
            hidePlanDetails: true,
            pricingPackage: 0,
            isModalOpen: false,
            selectedPlanAmount: 0,
            that: this,
            subscriptionDetails: {}
        };

        this.buyPlan = this.buyPlan.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.changeCardClick = this.changeCardClick.bind(this);
    };

    componentDidMount() {
          // Close Checkout on page navigation:
        window.addEventListener('popstate', function() {
            this.state.stripeHandler.close();
        });
        this.getSubscriptionDetail();
    }

    getSubscriptionDetail = () => {
        ApplozicClient.subscriptionDetail().then(response => {
            if(response.data.status === "success") {
                let subscription = response.data.response.subscriptions.data[0];
                console.log(subscription);
                this.setState({
                    subscriptionDetails: subscription
                })
            }
        }).catch(err => {
            console.log(err);
            Notification.error("An error occurred while getting subscription detail. Please try again later.")
        });
    }

    buy(token) {
        // let value = 2; //index selected from the pricing slider;
        let pricingPackage = this.pricingPackage;
        // let quantity = 5; //selected number of MAU/1000

        let userSession = CommonUtils.getUserSession();
        userSession.application.pricingPackage = PRICING_PACKAGE_MAP[pricingPackage];

        // Removing quantity as it is not needed for new plans.
        ApplozicClient.subscribe(token, pricingPackage).then(response => {
            if(response && response.data && (response.data == "success" || response.data == "USER_DETAIL_REQUIRED") )  {
                CommonUtils.setUserSession(userSession);
                this.that.getSubscriptionDetail();
                this.that.toggleModal();
            }
        }).catch(err => {
            console.log(err);
        });
    }

    buyPlan(e) {
        this.setState({
            pricingPackage: e.target.getAttribute("data-pricing-package"),
            selectedPlanAmount: e.target.getAttribute("data-plan-amount")
        })
        this.state.stripeHandlerCallback = this.buy;
        this.state.stripeHandler.open({
            name: 'Applozic, Inc',
            description: 'Chat SDK',
            panelLabel: 'Pay',
            amount: e.target.getAttribute("data-plan-amount")
          });
        
        AnalyticsTracking.acEventTrigger("ac-choose-plan");  
    }

    changeCardClick(e) {
        this.state.stripeHandlerCallback = ApplozicClient.changeCard;
        this.state.stripeHandler.open({
            name: 'Applozic, Inc',
            description: 'Update Card',
            panelLabel: 'Update Card',
          });
    }

    onBillingCyclesSelect = value => {
        this.setState({ 
            billingCycleText: value
        });
    }

    togglePlanDetails = () => {
        this.setState({
            hidePlanDetails: !this.state.hidePlanDetails
        })
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }

    getBillingInterval = () => {
        let interval; 
        if(Object.keys(this.state.subscriptionDetails).length > 0) {
            return interval = this.state.subscriptionDetails.intervalCount === 3 ? "Quarterly Billing" : this.state.subscriptionDetails.intervalCount + "ly Billing";
        } else {
            return interval = "";
        }
    }

    render() {
        let status = SUBSCRIPTION_PACKAGES[CommonUtils.getUserSession().application.pricingPackage];
        let planMAU = CommonUtils.getUserSession().application.supportedMAU;
        let currentPricingPackage = CommonUtils.getUserSession().application.pricingPackage;
        let billingInterval;
        const { subscriptionDetails } = this.state;

        return (
            <Container className="animated fadeIn">

                <SettingsHeader  />
                <div className="container">
                    
                    <PlanBoughtContainer>
                        <PlanBoughtActivePlanContainer>
                            <div>Your plan:</div>
                            <div><span>{status.split("_")[0]}</span> {(Object.keys(subscriptionDetails).length > 0 && currentPricingPackage > 0) ? <span style={{textTransform: "uppercase"}}>{subscriptionDetails.plan.intervalCount === 3 ? "Quarterly Billing" : subscriptionDetails.plan.interval + "ly Billing"}</span> : ""}</div>
                        </PlanBoughtActivePlanContainer>
                        { Object.keys(subscriptionDetails).length > 0 ?
                            <PlanBoughtNextBillingDateContainer>
                                <div>Next billing:</div>
                                <div>You will be charged <strong>${subscriptionDetails.plan.amount / 100}</strong> on <strong>{moment(subscriptionDetails.currentPeriodEnd * 1000).format("DD MMM YYYY")}</strong></div>
                            </PlanBoughtNextBillingDateContainer> : ""
                        }
                        <PlanChangeCardContainer>
                            <Button secondary link type="submit" value="Change Card" onClick={this.changeCardClick}>Change Card</Button>
                        </PlanChangeCardContainer>
                    </PlanBoughtContainer>

                    <MultiToggleSwitch
                        options={billingCycleOptions}
                        selectedOption={this.state.billingCycleText}
                        onSelectOption={this.onBillingCyclesSelect}
                        label="Upgrade to one of our paid plans for premium features"
                        className="al-billing-cycle-toggle"
                    />

                    <div className="row">
                        {(currentPricingPackage > 0 && currentPricingPackage <= 27) ? "" : 
                            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                                <AlBillingPlansTables className="al-starter-plan" briefText="For startups" planTitle="Starter" planAmount={PLANS[this.state.billingCycleText].starter} billingCycleText={this.state.billingCycleText} mauText="1000" planDetails={planDetails.starterPlan} primaryButton={false} togglePlanDetails={this.togglePlanDetails} hidePlanDetails={this.state.hidePlanDetails} everythingText="" buyPlan={this.buyPlan} disabled={currentPricingPackage}
                                />
                            </div>
                        }
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <AlBillingPlansTables className="al-growth-plan" briefText="For growing businesses" planAmount={PLANS[this.state.billingCycleText].growth} planTitle="Growth" billingCycleText={this.state.billingCycleText} mauText="10,000" planDetails={planDetails.growthPlan} primaryButton={true} togglePlanDetails={this.togglePlanDetails} hidePlanDetails={this.state.hidePlanDetails} everythingText="Starter" buyPlan={this.buyPlan} disabled={currentPricingPackage}
                            />
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <AlBillingPlansTables className="al-pro-plan" briefText="For mid-sized companies" planAmount={PLANS[this.state.billingCycleText].pro} planTitle="Pro" billingCycleText={this.state.billingCycleText} mauText="100,000" planDetails={planDetails.proPlan} primaryButton={false} togglePlanDetails={this.togglePlanDetails} hidePlanDetails={this.state.hidePlanDetails} everythingText="Growth" buyPlan={this.buyPlan} disabled={currentPricingPackage}
                            />
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <AlBillingPlansTables className="al-enterprise-plan" briefText="For enterprises" planAmount={"CUSTOM PRICING"} planTitle="Enterprise" billingCycleText={this.state.billingCycleText} mauText="Unlimited" planDetails={planDetails.enterprisePlan} primaryButton={false} togglePlanDetails={this.togglePlanDetails} hidePlanDetails={this.state.hidePlanDetails} everythingText="Pro" buyPlan={this.buyPlan}
                            />
                        </div>
                    </div>


                    <ContactUsContainer>
                        <ContactUsText>
                            For downgrading your account or unsubscribing drop a line on <a href="mailto:support@applozic.com">support@applozic.com</a>
                        </ContactUsText>
                    </ContactUsContainer>
                    
                </div>

                <Modal isOpen={this.state.isModalOpen} onRequestClose={this.toggleModal} style={modalStyles} shouldCloseOnOverlayClick={true} ariaHideApp={false} >
                    <ThankYouContainer>
                        <ThankYouTitle>Thanks and welcome aboard!</ThankYouTitle>
                        <ConfirmationTick />
                        <PaymentAmount>${this.state.selectedPlanAmount/100}</PaymentAmount>
                        <ThankYouText>Your payment was successful.</ThankYouText>
                        <ThankYouSubText>Please check your email for the invoice.</ThankYouSubText>
                    </ThankYouContainer>

                    <CloseButton onClick={this.toggleModal}/>
                </Modal>
            </Container>
        );
    }
}

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '550px',
        maxWidth: '900px',
        overflow: 'unset',
    }
};

const billingCycleOptions = [
    {
        displayName: "Monthly",
        value: "Monthly"
    },
    {
        displayName: "Quarterly",
        value: "Quarterly"
    },
    {
        displayName: "Yearly (20% off)",
        value: "Annually"
    }
];

const planDetails = {
    "starterPlan": ["Native Android, iOS & Ionic/PhoneGap SDK", "Unlimited concurrent connections", "Lifetime Message History Retention", "One-to-one & Group chat", "Attachment Sharing", "Push Notifications", "Complimentary Live Chat Plugin (2 Agent Plan)", "Standard Hosting"], 

    "growthPlan": ["Broadcast Messages", "Admin Announcements", "Webhooks Support", "Email Notifications", "Downloadable Reports", "Profanity Filters", "User Moderation", "End-to-end Encryption", "No Applozic Branding"],

    "proPlan": ["No Applozic Branding", "Live Streaming Chat", "Localization Support", "Custom Reports ", "Complimentary Live Chat Plugin (3 Agent Plan)", "Conversation Routing", "Choice of hosting region", "Service Level Agreement", "Phone Support"],

    "enterprisePlan": ["Unlimited Group Member Limit", "Dedicated (Single-Tenant) Hosting", "On-Prem (Self) Hosting", "Complimentary Live Chat Plugin (Upto 10 Agents)", "Bots & Automation", "Choice of Support Channel", "Dedicated Account Manager"]
};

const PRICING_PACKAGE_MAP = {
    '28': 1,
    '29': 1,
    '30': 1,
    '31': 12,
    '32': 12,
    '33': 12,
    '34': 13,
    '35': 13,
    '36': 13,
    '37': 14,
    '38': 14,
    '39': 14,
}

const PLANS = {
    "Monthly": {
        "starter": {
            "amount": 49,
            "mau": 1000,
            "pricingPackage": 28,
            "subscriptionId": "starter_plan_monthly"
        },
        "growth": {
            "amount": 149,
            "mau": 10000,
            "pricingPackage": 31,
            "subscriptionId": "growth_plan_monthly"
        },
        "pro": {
            "amount": 499,
            "mau": 100000,
            "pricingPackage": 34,
            "subscriptionId": "pro_plan_monthly"
        }
    },
    "Quarterly": {
        "starter": {
            "amount": 44,
            "mau": 1000,
            "pricingPackage": 29,
            "subscriptionId": "starter_plan_quarterly"
        },
        "growth": {
            "amount": 129,
            "mau": 10000,
            "pricingPackage": 32,
            "subscriptionId": "growth_plan_quarterly"
        },
        "pro": {
            "amount": 449,
            "mau": 100000,
            "pricingPackage": 35,
            "subscriptionId": "pro_plan_quarterly"
        }
    },
    "Annually": {
        "starter": {
            "amount": 39,
            "mau": 1000,
            "pricingPackage": 30,
            "subscriptionId": "starter_plan_annual"
        },
        "growth": {
            "amount": 119,
            "mau": 10000,
            "pricingPackage": 33,
            "subscriptionId": "growth_plan_annual"
        },
        "pro": {
            "amount": 399,
            "mau": 100000,
            "pricingPackage": 36,
            "subscriptionId": "pro_plan_annual"
        }
    }
};

const flex = css`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;
const Container = styled.div`
    max-width: 998px;
    & .col-lg-3 {
        padding: 0 20px;
    } 
    & .row {
        ${flex}
        justify-content: center;
        margin-top: 25px;
    }
    & .al-billing-cycle-toggle .toggle-container {
        max-width: 500px;
        margin: 0 auto;
    }
    & .al-billing-cycle-toggle label {
        font-size: 18px;
    }
`;
const PlanBoughtContainer = styled.div`
    padding-bottom: 20px;
    border-bottom: 1px solid #e9e9e9;
    margin-bottom: 0px;
`;
const PlanBoughtActivePlanContainer = styled.div`
    ${flex}

    & div:first-child {
        min-width: 125px;
    }
    & div {
        font-size: 18px;
        letter-spacing: 0.9px;
        color: #121212;
        margin-bottom: 7px;
    }
    & div:last-child span {
        border-radius: 2px;
        background-color: rgba(204, 231, 248, 0.7);
        padding: 3px 12px;
        text-transform: uppercase;
    }
`;
const PlanBoughtNextBillingDateContainer = styled(PlanBoughtActivePlanContainer)``;
const PlanChangeCardContainer = styled.div`
    & button {
        margin-left: 110px;
        height: 20px;
    }
`;
const ContactUsContainer = styled.div`
    text-align: center;
`;
const ContactUsText = styled.p`
    font-size: 16px;
`;

const ThankYouContainer = styled.div`
    text-align: center;
    padding: 15px 0;
`;
const ThankYouTitle = styled.h4`
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 1.7px;
    color: #2DD35C;
    margin-bottom: 25px;
`;
const PaymentAmount = styled(ThankYouTitle)`
    color: #242424;
    margin: 10px 0;
`;
const ThankYouText = styled.p`
    font-size: 22px;
    font-weight: bold;
    letter-spacing: 1.5px;
    color: #242424;
    margin-bottom: 0;
`;
const ThankYouSubText = styled(ThankYouText)`
    font-size: 16px;
    font-weight: normal;
    letter-spacing: 1.1px;
    color: #4a4a4a;
`;

export default BillingApplozic;
