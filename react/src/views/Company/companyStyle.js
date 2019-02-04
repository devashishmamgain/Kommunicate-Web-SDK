import styled, { withTheme } from 'styled-components';

const CompanyInfoContainer =  styled.div`
& > .input-field-title {
  font-size: 17px;
  letter-spacing: 1.3px;
  color: #616366;
}
& input {
    width: 35%;
    border-radius: 4px;
    height: 40px;
    border:1px solid #a1a1a1;
    padding: 16px;
    margin-bottom: 28px;
}
& input::placeholder  {
    font-size: 14px;
    color: #cacaca;
}
& label {
    font-size: 15px;
    letter-spacing: 0.3px;
    color: #616366;
    margin-right:6px;
}
& > .km-company-btn-wrapper {
    display: flex;
}
& > .km-company-btn-wrapper > .km-company-cancel-btn {
    margin-left: 12px;
}
`
export {
    CompanyInfoContainer
}