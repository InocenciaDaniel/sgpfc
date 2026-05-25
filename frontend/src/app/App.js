import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';
import 'primereact/resources/themes/saga-blue/theme.css';  
import 'primereact/resources/primereact.min.css';         
import 'primeicons/primeicons.css';                       
import 'primeflex/primeflex.css';                         
import AppRoutes from './AppRoutes';

class App extends Component {

  render() {

    return (

      <div>
        <style>
          {`
            body{
              background: #f0f0f0;
            }
          `}
        </style>
        
        <AppRoutes />
        
      </div>
    );
  }
 
};

export default withRouter(App);
