module.exports = function(sequelize, DataTypes) {
  return sequelize.define("customer", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50)
    },
    userName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "IDX_USER_NAME_APP_KEY",
      field: 'user_name'
    },
    email: {
      type: DataTypes.STRING(50)
    },
    password: {
      type: DataTypes.STRING(200)
    },
    role: {
      type: DataTypes.STRING(50)
    },
    contactNo: {
      type: DataTypes.STRING(20),
      field: 'contact_no'
    },
    industry: {
      type: DataTypes.STRING(20)
    },
    companyName: {
      type: DataTypes.STRING(50),
      field: 'company_name'
    },
    companySize: {
      type: DataTypes.STRING(15),
      field: 'company_size'
    },
    applicationId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "IDX_USER_NAME_APP_KEY",
      field: 'application_id'
    }, apzToken: {
        type: DataTypes.STRING(200),
        field: 'apz_token'
    },
    activeCampaignId:{
      type: DataTypes.INTEGER,
      field: 'active_campaign_id'
    },
    agentRouting:{
      type: DataTypes.INTEGER,
      field: "agent_routing"
    },
    subscription:{
      type: DataTypes.STRING(50),
      field: "subscription" //STARTUP, LAUNCH, GROWTH, ENTERPRISE
    },
    billingCustomerId:{
      type: DataTypes.STRING(50),
      field: "billing_cus_id" 
    },
    loginType: {
     type:DataTypes.ENUM,
     field:'login_type'
     values: ['email', 'oauth'],
    },
  }, {
    underscored: true,
    paranoid: true
  });
}
