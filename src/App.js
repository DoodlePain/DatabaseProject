import React, {Component} from 'react'
import Button from '@material-ui/core/Button';
import axios from 'axios'
import Faker from 'Faker'
import TextField from '@material-ui/core/TextField';
var querystring = require('querystring');


export default class App extends Component {
    state = {
        result: '',
        limit:100,
        NoR:0
    }
    handleChangeNoR = name => event => {
        this.setState({
          limit: event.target.value,
        });
      };
    
    shouldComponentUpdate(nextProps,nextState){
        if(this.state.NoR !== nextState.NoR) return true
        if(this.state.limit !== nextState.limit) return true
        if(this.state.result !== nextState.result) return true
        return false
    }

    render() {
        axios.get('http://localhost:3001/query')
                .then(res => {
                    this.setState({NoR:res.data.response.length})
                    return res.data.response.length
        })
        
        var queryResult = () => {
            axios.get('http://localhost:3001/query')
            .then(res => {
                this.setState({result:JSON.stringify(res.data.response),NoR:res.data.response.length})
            })
        }

        var deleteServer = () => {
            axios.get('http://localhost:3001/deleteServer')
            .then(res => {
                this.setState({result:JSON.stringify(res.data.response)})
            })
        }

        var repeatPost = (index) =>{
            if (index === parseInt(this.state.limit)) return 1
            axios.post('http://localhost:3001/insert',querystring.stringify({
                    ip:Faker.Internet.ip(),
                    porta:Math.round(Math.random() * (3100 - 3000) + 3000),
                    locazione:Faker.Address.usState(),
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

        return (
            <div>
                <br/>
                <Button variant="raised" color="primary" onClick={queryResult}>
                    Records : {this.state.NoR}
                </Button>
                <br/>
                {this.state.result}
                <br/>

                <TextField
                    id="name"
                    label="Number of records"
                    className="textField"
                    value={this.state.limit}
                    onChange={this.handleChangeNoR('name')}
                    margin="normal"
                    />
                <Button variant="raised" color="primary" onClick={serverFiller}>
                    ServerFiller
                </Button>
                <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button>
            </div>
        )
    }
}