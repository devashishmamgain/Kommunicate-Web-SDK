import React, { Component } from 'react';
import {Container} from '../../components/Container/Container';
import {CommonUtils} from '../../utils/CommonUtils';
import {HelpcenterClient} from '../../utils/HelpcenterClient';
import {ArticleWrapper, ArticleHeading, ArticleContent} from './ArticleComponents';
import  BreadCrumb  from '../../components/BreadCrumb/BreadCrumb';
import { HelpCenterData } from '../../context/HelpcenterDataContext'


export default class Article extends Component {
    static contextType = HelpCenterData;
    constructor(props) {
        super(props);
        this.state = {
            appId: '',
            faqIdentifier: '',
            faqHeading: '',
            faqId: '',
            faqContent: ''
        };
    };

    getFaqArticle = ()=>{
        this.setState({
            query: window.location.pathname.replace('/article','')
        }, () => {
            HelpcenterClient.getSelectedFaq(this.context.helpCenter.appId, this.state.query).then(response => {
                response && response.data && this.setState({
                    faqHeading: response.data[0].name,
                    faqContent: response.data[0].content,
                    faqId: response.data[0].id
                }),
                document.title = this.state.faqHeading + " | Helpcenter";
            })
        })
    }


    componentDidMount = () => {
           this.getFaqArticle();
    }

    updateArticlesPage = (query) => {
        let faqId = window.location.pathname.replace('/article','');
        query != faqId && this.getFaqArticle();
    }

    componentDidUpdate(prevProps, prevState) {
        let query = prevState.query;
        //Interval added to account for the flicker when react re-renders a component
        query && setInterval(this.updateArticlesPage(query), 1000)
    }
     
    render() {
        return (
                <Container className="animated slide-animated">
                    {
                        this.state.faqContent ? 
                        <ArticleWrapper className="animated slide-animated ">
                            <BreadCrumb 
                                crumbObject={[
                                    {
                                        pageUrl : '/',
                                        queryUrl : '?appId='+this.context.helpCenter.appId,
                                        crumbName : 'Kommunicate Help center'
                                    },
                                    {
                                        pageUrl : '/article/'+this.state.query,
                                        crumbName : this.state.faqHeading
                                    }
                                ]}
                            />
                                <ArticleHeading>{this.state.faqHeading}</ArticleHeading>
                                   <div className="ql-container ql-snow">
                                        <div className="ql-editor">
                                            <ArticleContent dangerouslySetInnerHTML={{__html: this.state.faqContent}} />
                                        </div>
                                   </div>
                        </ArticleWrapper> : ""
                    }
                </Container>
        )
    }
}

