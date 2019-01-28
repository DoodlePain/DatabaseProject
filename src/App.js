import React, { Component } from 'react'
import { InputNumber, Button, Input, Menu, Icon, Row, Col } from 'antd'
import 'antd/dist/antd.css';
import axios from 'axios'
import Faker from 'faker'
import './App.css'
import ServerData from './ServerData.json'
import servers from './servers.json'
var querystring = require('querystring');

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            limitServerRecords: 1000,
            NoRServer: 0,
            fk_stats: [],
            test: 'SELECT FROM ;',
            current: 'query',
            status: false
        }
        this.testQuery = null
        this.serverAdded = []
    }
    handleChangeNoRServer = (value) => {
        this.setState({
            limitServerRecords: value,
        });
    };

    handleTestQuery = event => {
        this.setState({
            test: event.target.value
        })
    }

    componentDidMount() {
        if (this.testQuery !== null) {
            axios.get('http://localhost:3001/Server/count')
                .then(res => {
                    this.setState({ NoRServer: res.data.response[0].length })
                    return res.data.response.length
                })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.NoRServer !== nextState.NoRServer) return true
        if (this.state.limitServerRecords !== nextState.limitServerRecords) return true
        if (this.state.test !== nextState.test) return true
        if (this.state.result !== nextState.result) return true
        if (this.state.current !== nextState.current) return true
        if (this.state.status !== nextState.status) return true
        return false
    }

    render() {


        var queryResult = () => {
            axios.get('http://localhost:3001/Server/query')
                .then(res => {
                    this.setState({ result: JSON.stringify(res.data.response), NoRServer: res.data.response.length })
                })
        }

        var serversByLocation = () => {
            axios.get('http://localhost:3001/Server/countServerByLocation')
                .then(res => {
                    this.setState({ result: JSON.stringify(res.data.response), NoRServer: res.data.response.length })
                })
        }

        var deleteServer = () => {
            axios.get('http://localhost:3001/Server/deleteServer')
                .then(res => {
                    this.setState({ result: JSON.stringify(res.data.response) })
                })
        }

        var repeatServer = (index) => {
            if (index === parseInt(this.state.limitServerRecords)) return 1
            var ip = Faker.internet.ip()
            axios.post('http://localhost:3001/Server/insert', querystring.stringify({
                ip: ip,
                locazione: Faker.address.country(),
                tick: 128
            }))
                .then((response) => {
                    index++
                    return repeatServer(index)
                })
        }

        var serverFiller = () => {
            toggleStatus()
            repeatServer(0)
            toggleStatus()
        }


        var repeatUser = (index, Stat_id) => {
            if (index === parseInt(this.state.limitServerRecords)) return 1
            const arraySeed = Math.floor(Math.random() * 25000) + 1
            axios.post('http://localhost:3001/Utente/insert', querystring.stringify({
                username: Faker.internet.userName(),
                email: Faker.internet.email(),
                lingua: Faker.random.locale(),
                nome: Faker.name.firstName() + ' ' + Faker.name.lastName(),
                sesso: (Faker.random.boolean() === true) ? 'm' : 'f',
                data_di_nascita: JSON.stringify(Faker.date.between(1960, 2000)).slice(1, 11),
                indirizzo: Faker.address.streetAddress(),
                tfa: Faker.random.boolean(),
                steamid: (Faker.random.boolean() ? '0:0:' : '1:1:') + '' + (Math.floor(Math.random() * 99999999) + 10000000),
                FK_Statistiche: arraySeed
            }))
                .then((response) => {
                    index++
                    return repeatUser(index)
                })
        }

        var userFiller = () => {
            var ids = []
            if (this.state.fk_stats === []) {
                axios.post('http://localhost:3001/Statistiche/getId').then(
                    (res) => {
                        // const result = res.data.result
                        // Object.keys(result).map((element) => {
                        //     ids.push(result[element].id_stat)
                        // })
                    }
                )
            }
            this.setState({ fk_stats: ids })
            toggleStatus()

            repeatUser(0, this.state.fk_stats)
            toggleStatus()

        }

        var repeatStatistiche = (index) => {
            if (index === parseInt(this.state.limitServerRecords)) return 1
            const partite_giocate = (Math.floor(Math.random() * 5000) + 1)
            const partite_vinte = (Math.floor(Math.random() * partite_giocate) + 1)
            const partite_perse = partite_giocate - partite_vinte
            const winrate = (partite_vinte * 100) / partite_giocate
            const livello = Math.floor(Math.random() * 10) + 1
            let elo = 0;
            switch (livello) {
                case 1:
                    elo = Math.floor(Math.random() * 800) + 100;
                    break;
                case 10:
                    elo = 2000 + Math.floor(Math.random() * 3000) + 1;
                    break;
                default:
                    elo = (800 + ((2 - 2) * 250) + Math.floor(Math.random() * 149) + 1);
                    break;
            }

            axios.post('http://localhost:3001/Statistiche/insert', querystring.stringify({
                elo: elo,
                livello: livello,
                lega: Faker.random.arrayElement(['Bronze', 'Silver', 'Gold', 'Diamond', 'Master']),
                class_nazionale: Math.floor(Math.random() * 1000000) + 1,
                class_continentale: Math.floor(Math.random() * 5000000) + 1,
                partite_giocate: partite_giocate,
                partite_vinte: partite_vinte,
                partite_perse: partite_perse,
                winrate: winrate
            }))
                .then((response) => {
                    index++
                    return repeatStatistiche(index)
                })
        }

        var statisticheFiller = () => {
            toggleStatus()
            repeatStatistiche(0)
            toggleStatus()
        }

        var repeatSponsor = (index) => {
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Sponsor/insert', querystring.stringify({
                nome: Faker.company.companyName(),
                nazione: Faker.address.country(),
                ambito: Faker.company.bs(),
                societa: Faker.company.companyName() + " " + Faker.company.companySuffix()
            }))
                .then((response) => {
                    index++
                    return repeatSponsor(index)
                })
        }

        var sponsorFiller = () => {
            toggleStatus()
            repeatSponsor(0)
            toggleStatus()
        }

        var repeatOrganizzatori = (index) => {
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Organizzatori/insert', querystring.stringify({
                nome: Faker.company.companyName(),
                ambito: Faker.company.bs(),
                societa: Faker.company.companyName() + " " + Faker.company.companySuffix(),
                nazione: Faker.address.country(),
                contatto: Faker.phone.phoneNumberFormat(),
                verificato: Faker.random.boolean() ? 1 : 0,
                utente: Math.floor(Math.random() * 17000) + 1
            }))
                .then((response) => {
                    index++
                    return repeatOrganizzatori(index)
                })
        }

        var organizzatoriFiller = () => {
            toggleStatus()
            repeatOrganizzatori(0)
            toggleStatus()
        }


        var repeatStaff = (index) => {
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Staff/insert', querystring.stringify({
                ambito: Faker.random.arrayElement(['shop', 'in-game', 'web-site', 'server']),
                ruolo: Faker.random.arrayElement(['admin', 'developer', 'moderator', 'supervisor']),
                utente: Math.floor(Math.random() * 17000) + 1
            }))
                .then((response) => {
                    index++
                    return repeatStaff(index)
                })
        }

        var staffFiller = () => {
            toggleStatus()
            repeatStaff(0)
            toggleStatus()
        }

        var repeatTorneo = (index) => {
            if (index === parseInt(this.state.limitServerRecords)) return 1
            var datai = "201" + (Math.floor(Math.random() * 6) + 1) + "-" + (Math.floor(Math.random() * 12) + 1) + "-" + (Math.floor(Math.random() * 30) + 1)
            axios.post('http://localhost:3001/Torneo/insert', querystring.stringify({
                nome: Faker.address.country() + "'s " + Faker.hacker.verb() + " Cup",
                data_inizio: datai,
                data_fine: datai,
                slot: Math.floor(Math.random() * 64) + 1,
                FK_Sponsor: Math.floor(Math.random() * 100) + 1,
                FK_Organizzatore: Math.floor(Math.random() * 100) + 1,
                premio: (Math.floor(Math.random() * 100) + 1) * Faker.random.arrayElement([10, 100, 1000, 10000])
            }))
                .then((response) => {
                    index++
                    return repeatTorneo(index)
                })
        }

        var torneoFiller = () => {
            toggleStatus()
            repeatTorneo(0)
            toggleStatus()
        }

        var repeatSquadra = (index) => {
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Squadra/insert', querystring.stringify({
                nome: Faker.random.words(),
                FK_Sponsor: Math.floor(Math.random() * 100) + 1,
                FK_Leader: Math.floor(Math.random() * 17000) + 1,
                FK_Manager: Math.floor(Math.random() * 17000) + 1,
                FK_Statistiche: Math.floor(Math.random() * 17000) + 1,
            }))
                .then((response) => {
                    index++
                    return repeatSquadra(index)
                })
        }

        var squadraFiller = () => {
            toggleStatus()
            repeatSquadra(0)
            toggleStatus()
        }

        var repeatComponenti = (index) => {
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Componenti/insert', querystring.stringify({
                utente: Math.floor(Math.random() * 239000) + 1,
                FK_Squadra: Math.floor(Math.random() * 12061) + 1
            }))
                .then((response) => {
                    index++
                    return repeatComponenti(index)
                })
        }

        var componentiFiller = () => {
            toggleStatus()
            repeatComponenti(0)
            toggleStatus()
        }

        var repeatPartita = (index) => {
            if (index === parseInt(this.state.limitServerRecords)) return 1
            var selectIp = Math.floor(Math.random() * 4500) + 1
            var ip = ServerData[selectIp].ip
            var porta = ServerData[selectIp].porta
            var FK_Server = servers.pop()
            axios.get('http://localhost:3001/popData').then(res => {
                console.log("Popped last");
            });
            axios.post('http://localhost:3001/Partita/insert', querystring.stringify({
                data_partita: "201" + parseInt(Math.floor(Math.random() * 2) + 7) + "-" + Math.floor(Math.random() * 12) + "-" + Math.floor(Math.random() * 30),
                ora: "" + (Math.floor(Math.random() * 24) + 1) + ":" + (Math.floor(Math.random() * 60) + 1) + "",
                FK_Squadra1: Math.floor(Math.random() * 17000) + 1,
                FK_Squadra2: Math.floor(Math.random() * 17000) + 1,
                FK_Server: FK_Server,
                FK_Mappa: Math.floor(Math.random() * 33) + 1,
            }))
                .then((response) => {
                    index++
                    return repeatPartita(index)
                })
        }

        var partitaFiller = () => {
            toggleStatus()
            repeatPartita(0)
            toggleStatus()
        }



        var repeatIscrizione = (index) => {
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Iscrizione/insert', querystring.stringify({
                FK_Squadra: Math.floor(Math.random() * 12061) + 1,
                FK_Torneo: Math.floor(Math.random() * 1162) + 300
            }))
                .then((response) => {
                    index++
                    return repeatIscrizione(index)
                })
        }

        var iscrizioneFiller = () => {
            toggleStatus()
            repeatIscrizione(0)
            toggleStatus()
        }




        var repeatMissione = (index) => {
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Missione/insert', querystring.stringify({
                nome: Faker.company.companyName(),
                ambito: Faker.company.bs(),
                societa: Faker.company.companyName() + " " + Faker.company.companySuffix(),
                nazione: Faker.address.country(),
                contatto: Faker.phone.phoneNumberFormat(),
                verificato: Faker.random.boolean() ? 1 : 0,
                utente: Math.floor(Math.random() * 17000) + 1
            }))
                .then((response) => {
                    index++
                    return repeatMissione(index)
                })
        }

        var missioneFiller = () => {
            toggleStatus()
            repeatMissione(0)
            toggleStatus()
        }




        var repeatSottoscrizione = (index) => {
            var durata = [1, 3, 6, 12]
            var mese = Math.floor(Math.random() * 4)
            var data_inizio = '201' + (Math.floor(Math.random() * 3) + 6) + '-' + (Math.floor(Math.random() * 12)) + '-' + (Math.floor(Math.random() * 30))
            var data_fine = abbonamento(data_inizio, durata[mese])
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Sottoscrizione/insert', querystring.stringify({
                data_inizio,
                data_fine,
                FK_Abbonamento: (durata[mese] * Math.floor(Math.random() * 4) + 1),
                FK_Utente: Math.floor(Math.random() * 17000) + 1
            }))
                .then((response) => {
                    index++
                    return repeatSottoscrizione(index)
                })
        }

        var sottoscrizioneFiller = () => {
            toggleStatus()
            repeatSottoscrizione(0)
            toggleStatus()
        }



        var clearServerResult = () => {
            this.setState({
                result: ''
            });
        };


        this.testQuery = () => {
            axios.post('http://localhost:3001/testquery', querystring.stringify({
                test: this.state.test
            }))
                .then((response) => {
                    this.setState({ result: JSON.stringify(response.data.data) })
                })
        }


        var abbonamento = (data_inizio, mesi) => {
            var anno = parseInt(data_inizio.split('-')[0])
            var mese = parseInt(data_inizio.split('-')[1]) + mesi
            if (mese > 12) {
                anno = anno + 1
                mese = mese % 12
            }
            var giorno = parseInt(data_inizio.split('-')[2])
            var data_fine = '' + anno + "-" + mese + '-' + giorno
            return data_fine
        }


        var handleClickMenu = (e) => {
            this.setState({
                current: e.key,
            });
        }

        var toggleStatus = () => {
            var status = this.state.status
            status = !status
            console.log(this.state.status, status);
            this.setState({ status })
            // console.log(this.state.status ? "Turned ON" : "Turned OFF");

        }



        const { TextArea } = Input;
        var bStyle = { width: '130px', height: '40px', background: 'rgba(0,0,0,0.2)', color: 'white' }
        return (
            <div>
                <h1>FACEIT DATABASE FILLER <img src="https://static.hltv.org/images/eventLogos/1616.png" alt="Faceit logo" style={{ width: '50px', height: '50px' }} /></h1>
                <Menu
                    onClick={handleClickMenu}
                    selectedKeys={[this.state.current]}
                    defaultValue="query"
                    mode="horizontal"
                    style={{ background: '#323838', color: '#EBEFF3' }}
                >
                    <Menu.Item key="query">
                        <Icon type="search" /> Query
                    </Menu.Item>
                    <Menu.Item key="insert">
                        <Icon type="edit" /> Insert
                    </Menu.Item>
                </Menu>
                <div className="query"
                    style={{ display: this.state.current == "query" ? "inline" : "none" }}
                >
                    <h5 style={{ display: 'inline' }}>
                        Query :
                </h5>
                    <Input style={{ width: '600px', marginLeft: '15px', display: 'inline' }} placeholder="Query example : SELECT * FROM Utente;" onChange={this.handleTestQuery} />
                    < Button size="large" onClick={this.testQuery} style={{ display: 'inline', marginLeft: '7px' }}>
                        Submit Query
                </Button>
                    <br />
                    <br />
                    <TextArea style={{ width: '850px', height: '600px' }} placeholder="There will be the result of the query" value={this.state.result}>
                        {this.state.result}
                    </TextArea>
                </div>

                <div className="insert"
                    style={{ display: this.state.current == "insert" ? "inline" : "none" }}
                >
                    <br />
                    <h5 style={{ display: 'inline' }}>
                        Select the number of records :
                </h5>
                    <InputNumber defaultValue={1000} onChange={this.handleChangeNoRServer} />
                    <br />
                    <h1>{this.state.status ? "Loading . . . " : ""}</h1>
                    <br />
                    <Row>
                        < Button type="dashed" size="large" onClick={componentiFiller} style={bStyle}>Componenti</Button>
                        < Button type="dashed" size="large" onClick={serverFiller} style={bStyle}>Gioco</Button>
                        < Button type="dashed" size="large" onClick={iscrizioneFiller} style={bStyle}>Iscrizione</Button>
                        < Button type="dashed" size="large" onClick={serverFiller} style={bStyle}>Mappe</Button>

                    </Row>
                    <Row>

                        < Button type="dashed" size="large" onClick={organizzatoriFiller} style={bStyle}>Organizzatori</Button>
                        < Button type="dashed" size="large" onClick={partitaFiller} style={bStyle}>Partita</Button>
                        < Button type="dashed" size="large" onClick={serverFiller} style={bStyle}>Server</Button>
                        < Button type="dashed" size="large" onClick={sottoscrizioneFiller} style={bStyle}>Sottoscrizione</Button>

                    </Row>
                    <Row>
                        < Button type="dashed" size="large" onClick={sponsorFiller} style={bStyle}>Sponsor</Button>
                        < Button type="dashed" size="large" onClick={squadraFiller} style={bStyle}>Squadra</Button>
                        < Button type="dashed" size="large" onClick={staffFiller} style={bStyle}>Staff</Button>
                        < Button type="dashed" size="large" onClick={statisticheFiller} style={bStyle}>Statistiche</Button>

                    </Row>
                    <Row>
                        < Button type="dashed" size="large" onClick={torneoFiller} style={bStyle}>Torneo</Button>
                        < Button type="dashed" size="large" onClick={userFiller} style={bStyle}>Utente</Button>
                    </Row>

                </div>
            </div >
        )
    }
}