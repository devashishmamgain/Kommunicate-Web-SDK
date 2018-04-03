
const logger = require("../utils/logger");
const axios = require("axios");
var userId = "4047878";
const API_KEY = '5b37f277e072d90ada8d7d9852a1386079fdcce7';

const ADD_ORGANIZATION_API_URL = "https://applozic.pipedrive.com/v1/organizations?api_token=";
const ADD_PERSON_API_URL = "https://applozic.pipedrive.com/v1/persons?api_token=";
const ADD_DEAL_API_URL = "https://applozic.pipedrive.com/v1/deals?api_token=";


exports.createDealInPipeDrive = (organization, person) => {
    let deal = { title: organization.name, person_id: '', org_id: '', stage_id: 6, }
    console.log('organization: ', organization, 'person: ', person);
    return createOrganization(organization).then(organizationId => {
        console.log('response of organization: ', organizationId);
        person.org_id = organizationId;
        deal.org_id = organizationId;
        return createPerson(person).then(personId => {
            console.log('personId:', personId)
            deal.person_id = personId;
            deal.user_id = userId;
            return createDeal(deal).then(result => {
                console.log('final response: ', result);
                return { message: 'SUCCESS', data: result.data };
            })
        })
    }).catch(err => {
        console.log('err:', err)
        return { message: 'ERROR', data: 'error' };
    })

}

const createOrganization = (options) => {
    //option={name:'companyName'}
    return Promise.resolve(axios.post(ADD_ORGANIZATION_API_URL + API_KEY, options)).then(organization => {
        return organization.data.data.id;
    });
}

const createPerson = (person) => {
    //person={name:"", email:"",org_id:"",phone:""}
    return Promise.resolve(axios.post(ADD_PERSON_API_URL + API_KEY, person)).then(person => {
        return person.data.data.id
    });
}

const createDeal = (deal) => {
    return Promise.resolve(axios.post(ADD_DEAL_API_URL + API_KEY, deal)).then(result => {
        return result
    });
}

