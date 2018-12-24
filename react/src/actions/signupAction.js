const updateOnBoardingStatus = (payload) => ({ 
    type: 'UPDATE_KM_ON_BOARDING_STATUS',
    payload
});
const updateOnBoardingModalStatus = (payload) => ({ 
    type: 'UPDATE_KM_ON_BOARDING_MODAL_STATUS',
    payload
});
const updatePseudoNameBannerStatus = (payload) => ({ 
    type: 'UPDATE_PSEUDO_BANNER_STATUS',
    payload
});
export {
    updateOnBoardingStatus,
    updateOnBoardingModalStatus,
    updatePseudoNameBannerStatus
}