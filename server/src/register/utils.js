exports.KOMMUNICATE_SUBSCRIPTION = {
    STARTUP:'startup',
    
    PER_AGENT_YEARLY :'per_agent_yearly',
    PER_AGENT_MONTHLY:'per_agent_monthly',

    ENTERPRISE_YEARLY:'enterprise',
    ENTERPRISE_MONTHLY:'enterprise-per-agent-monthly',
    
    EARLY_BIRD_MONTHLY:'early_bird_monthly',
    EARLY_BIRD_YEARLY:'early_bird_yearly',
    
    GROWTH_MONTHLY: 'growth_monthly'
    
}

const APPLOZIC_PRICING_PACKAGE = {};
APPLOZIC_PRICING_PACKAGE[this.KOMMUNICATE_SUBSCRIPTION.STARTUP]  = 101;
APPLOZIC_PRICING_PACKAGE[this.KOMMUNICATE_SUBSCRIPTION.PER_AGENT_MONTHLY]  = 102;
APPLOZIC_PRICING_PACKAGE[this.KOMMUNICATE_SUBSCRIPTION.PER_AGENT_YEARLY]  = 103;
APPLOZIC_PRICING_PACKAGE[this.KOMMUNICATE_SUBSCRIPTION.GROWTH_MONTHLY]  = 104; 
APPLOZIC_PRICING_PACKAGE[this.KOMMUNICATE_SUBSCRIPTION.ENTERPRISE_MONTHLY]  = 105;
APPLOZIC_PRICING_PACKAGE[this.KOMMUNICATE_SUBSCRIPTION.ENTERPRISE_YEARLY]  = 106;
APPLOZIC_PRICING_PACKAGE[this.KOMMUNICATE_SUBSCRIPTION.EARLY_BIRD_MONTHLY]  = 107;
APPLOZIC_PRICING_PACKAGE[this.KOMMUNICATE_SUBSCRIPTION.EARLY_BIRD_YEARLY]  = 108;

exports.APPLOZIC_PRICING_PACKAGE = APPLOZIC_PRICING_PACKAGE;










