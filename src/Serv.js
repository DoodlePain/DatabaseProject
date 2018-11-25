import React, {Component} from 'react'
import Button from '@material-ui/core/Button';
import axios from 'axios'
import Faker from 'Faker'
import TextField from '@material-ui/core/TextField';
var querystring = require('querystring');


export default class App extends Component {
    state = {
        result: '',
        limitServerRecords:100,
        NoRServer:0
    }
    handleChangeNoRServer = name => event => {
        this.setState({
            limitServerRecords: event.target.value,
        });
      };

    shouldComponentUpdate(nextProps,nextState){
        if(this.state.NoRServer !== nextState.NoRServer) return true
        if(this.state.limitServerRecords !== nextState.limitServerRecords) return true
        if(this.state.result !== nextState.result) return true
        return false
    }

    render() {
        axios.get('http://localhost:3001/Server/count')
                .then(res => {
                    this.setState({NoRServer:res.data.response[0].length})
                    return res.data.response.length
        })
        
        var queryResult = () => {
            axios.get('http://localhost:3001/Server/query')
            .then(res => {
                this.setState({result:JSON.stringify(res.data.response),NoRServer:res.data.response.length})
            })
        }  

        var serversByLocation = () => {
            axios.get('http://localhost:3001/Server/countServerByLocation')
            .then(res => {
                this.setState({result:JSON.stringify(res.data.response),NoRServer:res.data.response.length})
            })
        }
        
        var deleteServer = () => {
            axios.get('http://localhost:3001/Server/deleteServer')
            .then(res => {
                this.setState({result:JSON.stringify(res.data.response)})
            })
        }

        var repeatPost = (index) =>{
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Server/insert',querystring.stringify({
                    ip:Faker.Internet.ip(),
                    porta:Math.round(Math.random() * (3100 - 3000) + 3000),
                    locazione:Faker.Address.city(),
                    tick:128
                }))
                .then((response)=>{
                    index++
                    return repeatPost(index)
                })
        }

        var serverFiller = () => {
            repeatPost(0)
        } 


        var clearServerResult = () => {
            this.setState({
                result: ''
            });
        };
    

        return (
            <div>
                <br/>
                <Button variant="raised" color="primary" onClick={queryResult}>
                    Records : {this.state.NoRServer}
                </Button>
                <Button variant="raised" color="primary" onClick={clearServerResult}>
                    Clear server result
                </Button>
                <br/>
                {this.state.result}
                <br/>

                <TextField
                    id="name"
                    label="Number of records"
                    className="textField"
                    value={this.state.limitServerRecords}
                    onChange={this.handleChangeNoRServer('name')}
                    />
                <br/>
                <br/>
                <Button variant="raised" color="primary" onClick={serverFiller}>
                    ServerFiller
                </Button>
                <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button>
                <br/>
                <br/>
                <br/>
                <Button variant="raised" color="primary" onClick={serversByLocation}>
                    Number of server for each location
                </Button>
            </div>
        )
    }
}