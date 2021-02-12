import React, { useState, useEffect } from 'react';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

import App from './App.js';
import Cluar from './Cluar.js';

import NotFound from './pages/NotFound';

export default () => {

    const defaultLanguage = Cluar.defaultLanguage();

    const [locale, setLocale] = useState(defaultLanguage.locale);
    
    const storageLocale = window.localStorage.getItem('locale');
    if (storageLocale == null) {
        window.localStorage.setItem('locale', locale);
    } else {
        Cluar.changeLanguage(storageLocale);
    }

    const handleChangeLocale = (newLocale) => {
        Cluar.changeLanguage(newLocale);
        console.log('newLocale = ', newLocale);
        window.localStorage.setItem('locale', newLocale);
        setLocale(newLocale);
    };
    
    const routes = [];

    for (const language of Cluar.languages()) {
        routes.push(<Route path={`/${language.locale}/*`} render={
            (propsRouter) => {
                handleChangeLocale(language.locale);
                return <App 
                         {...propsRouter}
                         locale={locale} 
                         changeLocale={handleChangeLocale} 
                       />;
            }
        }/>);
    }
    
    return <Router>
             <Switch>
               <Route path="/" exact render={(propRouter) => {
                   return <Redirect to={`/${locale}/`} />;
               }} />
               <Route path="/cn/">
                 <Route path="/cn/xpto">
                   XPTO
                 </Route>
                 <Route path="/cn/" exact>
                   HOME
                 </Route>
               </Route>
               { routes }
               <Route path="*" exact render={(propRouter) => {
                   return <Redirect to={`/${locale}/`} />;
               }} />
             </Switch>
           </Router>;
};
