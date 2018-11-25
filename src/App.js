import React, {Component} from 'react'
import Button from '@material-ui/core/Button';
import axios from 'axios'
import Faker from 'faker'
import TextField from '@material-ui/core/TextField';
import { log } from 'util';
var querystring = require('querystring');


export default class App extends Component {
    state = {
        result: '',
        limitServerRecords:100,
        NoRServer:0,
        fk_stats: [],
        test:'SELECT FROM ;'
    }
    handleChangeNoRServer = name => event => {
        this.setState({
            limitServerRecords: event.target.value,
        });
      };

    handleTestQuery = name => event => {
        console.log(event.target.value);
        
        this.setState({
            test:event.target.value
        })
    }

    shouldComponentUpdate(nextProps,nextState){
        if(this.state.NoRServer !== nextState.NoRServer) return true
        if(this.state.limitServerRecords !== nextState.limitServerRecords) return true
        if(this.state.test !== nextState.test) return true
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

        var repeatServer = (index) =>{
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Server/insert',querystring.stringify({
                    ip:Faker.internet.ip(),
                    porta:Math.round(Math.random() * (3100 - 3000) + 3000),
                    locazione:Faker.address.country(),
                    tick:128
                }))
                .then((response)=>{
                    index++
                    return repeatServer(index)
                })
        }

        var serverFiller = () => {
            repeatServer(0)
        } 


        var repeatUser = (index,Stat_id) =>{
            if (index === parseInt(this.state.limitServerRecords)) return 1
            const arraySeed = Math.floor(Math.random()*25000)+1
            axios.post('http://localhost:3001/Utente/insert',querystring.stringify({
                    username:Faker.internet.userName(),
                    email:Faker.internet.email(),
                    lingua: Faker.random.locale(),
                    nome:Faker.name.firstName() + ' '+ Faker.name.lastName(),
                    sesso:(Faker.random.boolean()===true)?'m':'f',
                    data_di_nascita:JSON.stringify(Faker.date.between(1960,2000)).slice(1,11),
                    indirizzo:Faker.address.streetAddress(),
                    tfa:Faker.random.boolean(),
                    steamid: (Faker.random.boolean()?'0:0:':'1:1:')+''+(Math.floor(Math.random() * 99999999) + 10000000),
                    FK_Statistiche:arraySeed
                }))
                .then((response)=>{
                    index++
                    return repeatUser(index)
                })
        }

        var userFiller = () => {
            var ids = []
            if(this.state.fk_stats === [] ){
                axios.post('http://localhost:3001/Statistiche/getId').then(
                    (res) =>{
                        const result = res.data.result
                        Object.keys(result).map((element)=>{
                            ids.push(result[element].id_stat)
                        })
                    }
                )
            }
            this.setState({fk_stats:ids})
            repeatUser(0,this.state.fk_stats)
        } 

        var repeatStatistiche = (index) =>{
            if (index === parseInt(this.state.limitServerRecords)) return 1
            const partite_giocate = (Math.floor(Math.random() * 5000) + 1)
            const partite_vinte = (Math.floor(Math.random() * partite_giocate) + 1)
            const partite_perse = partite_giocate-partite_vinte
            const winrate = (partite_vinte*100)/partite_giocate
            const livello = Math.floor(Math.random() * 10) + 1
            let elo = 0;
            switch(livello){
                case 1: 
                    elo = Math.floor(Math.random() * 800) + 100;
                    break;
                case 10:
                    elo = 2000 + Math.floor(Math.random() * 3000) + 1;
                    break;
                default:
                    elo = (800+((2-2)*250)+Math.floor(Math.random() * 149) + 1);
                    break;
            }

            axios.post('http://localhost:3001/Statistiche/insert',querystring.stringify({
                    elo:elo,
                    livello:livello,
                    lega:Faker.random.arrayElement(['Bronze','Silver','Gold','Diamond','Master']),
                    class_nazionale:Math.floor(Math.random() * 1000000) + 1,
                    class_continentale:Math.floor(Math.random() * 5000000) + 1,
                    partite_giocate:partite_giocate,
                    partite_vinte:partite_vinte,
                    partite_perse:partite_perse,
                    winrate:winrate
                }))
                .then((response)=>{
                    index++
                    return repeatStatistiche(index)
                })
        }

        var statisticheFiller = () => {
            repeatStatistiche(0)
        } 

        var repeatSponsor = (index) =>{
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Server/insert',querystring.stringify({
                    nome:Faker.company.companyName(),
                    nazione:Faker.address.country(),
                    ambito:Faker.company.bs(),
                    societa:Faker.company.companyName() + " " +Faker.company.companySuffix()
                }))
                .then((response)=>{
                    index++
                    return repeatSponsor(index)
                })
        }

        var sponsorFiller = () => {
            repeatSponsor(0)
        } 

        var repeatOrganizzatori = (index) =>{
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Server/insert',querystring.stringify({
                    nome:Faker.company.companyName(),
                    ambito:Faker.company.bs(),
                    societa:Faker.company.companyName() + " " +Faker.company.companySuffix(),
                    nazione:Faker.address.country(),
                    contatto:Faker.phone.phoneNumberFormat(),
                    verificato: Faker.random.boolean(),
                    FK_Utente:Math.floor(Math.random()*17000)+1
                }))
                .then((response)=>{
                    index++
                    return repeatOrganizzatori(index)
                })
        }

        var organizzatoriFiller = () => {
            repeatOrganizzatori(0)
        } 

        var repeatStaff = (index) =>{
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Server/insert',querystring.stringify({
                    ambito:Faker.random.arrayElement(['shop', 'in-game','web-site','server']),
                    ruolo:Faker.random.arrayElement(['admin', 'developer','moderator','supervisor']),
                    FK_Utente:Math.floor(Math.random()*17000)+1
                }))
                .then((response)=>{
                    index++
                    return repeatStaff(index)
                })
        }

        var staffFiller = () => {
            repeatStaff(0)
        } 

        var repeatSquadra = (index) =>{
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Server/insert',querystring.stringify({
                    nome: Faker.random.words(),
                    FK_Componenti:Math.floor(Math.random()*17000)+1,
                    FK_Sponsor:Math.floor(Math.random()*17000)+1,
                    FK_Leader:Math.floor(Math.random()*17000)+1,
                    FK_Manager:Math.floor(Math.random()*17000)+1,
                    FK_Statistiche:Math.floor(Math.random()*17000)+1,
                }))
                .then((response)=>{
                    index++
                    return repeatSquadra(index)
                })
        }

        var squadraFiller = () => {
            repeatSquadra(0)
        } 
        
        var repeatComponenti = (index) =>{
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Server/insert',querystring.stringify({
                FK_Utente1:Math.floor(Math.random()*17000)+1,
                FK_Utente2:Math.floor(Math.random()*17000)+1,
                FK_Utente3:Math.floor(Math.random()*17000)+1,
                FK_Utente4:Math.floor(Math.random()*17000)+1,
                FK_Utente5:Math.floor(Math.random()*17000)+1
                }))
                .then((response)=>{
                    index++
                    return repeatComponenti(index)
                })
        }

        var componentiFiller = () => {
            repeatComponenti(0)
        } 

        var repeatPartita = (index) =>{
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Server/insert',querystring.stringify({
                FK_Squadra1:Math.floor(Math.random()*17000)+1,
                FK_Squadra1:Math.floor(Math.random()*17000)+1,
                FK_Server:Math.floor(Math.random()*27000)+1
                }))
                .then((response)=>{
                    index++
                    return repeatPartita(index)
                })
        }

        var partitaFiller = () => {
            repeatPartita(0)
        } 









        

        var clearServerResult = () => {
            this.setState({
                result: ''
            });
        };
        
        var testQuery = () => { 
            axios.post('http://localhost:3001/testquery',querystring.stringify({
                test:this.state.test
            }))
            .then((response)=>{
                console.log(response);
            })
        }


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

                <TextField
                    id="test"
                    label="test query"
                    className="textField"
                    value={this.state.test}
                    onChange={this.handleTestQuery('test')}
                    />
                <Button variant="raised" onClick={testQuery}>
                    testquery
                </Button>                
                <br/>
                <br/>
                <Button variant="raised" color="primary" onClick={serverFiller}>
                    Server
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
                <br/>
                <br/>

                <Button variant="raised" color="primary" onClick={userFiller}>
                    Utente
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br/>
                <br/>

                <Button variant="raised" color="primary" onClick={statisticheFiller}>
                    Statistiche
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br/>
                <br/>

                <Button variant="raised" color="primary" onClick={sponsorFiller}>
                    Sponsor
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br/>
                <br/>

                <Button variant="raised" color="primary" onClick={organizzatoriFiller}>
                    Organizzatori
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br/>
                <br/>

                <Button variant="raised" color="primary" onClick={serverFiller}>
                    Gioco 
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br/>
                <br/>



                <Button variant="raised" color="primary" onClick={serverFiller}>
                    Mappe
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
            </div>
        )
    }
}