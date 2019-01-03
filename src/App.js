import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import axios from 'axios'
import Faker from 'faker'
import TextField from '@material-ui/core/TextField';
import ServerData from './ServerData.json'
import servers from './servers.json'
var querystring = require('querystring');

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            limitServerRecords: 100,
            NoRServer: 0,
            fk_stats: [],
            test: 'SELECT FROM ;'
        }
        this.testQuery = null
        this.serverAdded = []
    }
    handleChangeNoRServer = name => event => {
        this.setState({
            limitServerRecords: event.target.value,
        });
    };

    handleTestQuery = name => event => {
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
            var ip = Faker.internet.ip() + ":" + (Math.round(Math.random() * (3100 - 3000) + 3000))
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
            repeatServer(0)

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
                        const result = res.data.result
                        Object.keys(result).map((element) => {
                            ids.push(result[element].id_stat)
                        })
                    }
                )
            }
            this.setState({ fk_stats: ids })
            repeatUser(0, this.state.fk_stats)
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
            repeatStatistiche(0)
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
            repeatSponsor(0)
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
            repeatOrganizzatori(0)
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
            repeatStaff(0)
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
            repeatTorneo(0)
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
            repeatSquadra(0)
        }

        var repeatComponenti = (index) => {
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Componenti/insert', querystring.stringify({
                utente1: Math.floor(Math.random() * 17000) + 1,
                utente2: Math.floor(Math.random() * 17000) + 1,
                utente3: Math.floor(Math.random() * 17000) + 1,
                utente4: Math.floor(Math.random() * 17000) + 1,
                utente5: Math.floor(Math.random() * 17000) + 1,
                utente6: Math.floor(Math.random() * 17000) + 1,
                utente7: Math.floor(Math.random() * 17000) + 1,
                utente8: Math.floor(Math.random() * 17000) + 1,
                FK_Squadra: Math.floor(Math.random() * 2000) + 1
            }))
                .then((response) => {
                    index++
                    return repeatComponenti(index)
                })
        }

        var componentiFiller = () => {
            repeatComponenti(0)
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
                data: "201" + (Math.floor(Math.random() * 6) + 1) + "-" + Math.floor(Math.random() * 12) + 1 + "-" + Math.floor(Math.random() * 30) + 1,
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
            repeatPartita(0)
        }



        var repeatIscrizione = (index) => {
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Iscrizione/insert', querystring.stringify({
                FK_Squadra: Math.floor(Math.random() * 2000) + 1,
                FK_Torneo: Math.floor(Math.random() * 100) + 1
            }))
                .then((response) => {
                    index++
                    return repeatIscrizione(index)
                })
        }

        var iscrizioneFiller = () => {
            repeatIscrizione(0)
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
            repeatMissione(0)
        }




        var repeatSottoscrizione = (index) => {
            var durata = [1, 3, 6, 12]
            var mese = Math.floor(Math.random() * 4) + 1
            if (index === parseInt(this.state.limitServerRecords)) return 1
            axios.post('http://localhost:3001/Sottoscrizione/insert', querystring.stringify({
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
                    return repeatSottoscrizione(index)
                })
        }

        var sottoscrizioneFiller = () => {
            repeatSottoscrizione(0)
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
                    console.log(response.data.data[0]);
                })
        }

        return (
            <div>
                <br />
                <Button variant="raised" color="primary" onClick={queryResult}>
                    Records : {this.state.NoRServer}
                </Button>
                <Button variant="raised" color="primary" onClick={clearServerResult}>
                    Clear server result
                </Button>
                <br />
                {this.state.result}
                <br />

                <TextField
                    id="name"
                    label="Number of records"
                    className="textField"
                    value={this.state.limitServerRecords}
                    onChange={this.handleChangeNoRServer('name')}
                />
                <br />
                <br />

                <TextField
                    id="test"
                    label="test query"
                    className="textField"
                    value={this.state.test}
                    onChange={this.handleTestQuery('test')}
                />
                <Button variant="raised" onClick={this.testQuery}>
                    testquery
                </Button>
                <br />
                <br />
                <Button variant="raised" color="primary" onClick={serverFiller}>
                    Server
                </Button>
                <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button>
                <br />
                <br />
                <br />
                <Button variant="raised" color="primary" onClick={serversByLocation}>
                    Number of server for each location
                </Button>
                <br />
                <br />

                <Button variant="raised" color="primary" onClick={userFiller}>
                    Utente
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br />
                <br />

                <Button variant="raised" color="primary" onClick={statisticheFiller}>
                    Statistiche
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br />
                <br />

                <Button variant="raised" color="primary" onClick={sponsorFiller}>
                    Sponsor
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br />
                <br />

                <Button variant="raised" color="primary" onClick={organizzatoriFiller}>
                    Organizzatori
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br />
                <br />

                <Button variant="raised" color="primary" onClick={serverFiller}>
                    Gioco
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br />

                <br />
                <Button variant="raised" color="primary" onClick={staffFiller}>
                    Staff
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br />
                <br />

                <br />
                <Button variant="raised" color="primary" onClick={squadraFiller}>
                    Squadra
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br />
                <br />


                <br />
                <Button variant="raised" color="primary" onClick={componentiFiller}>
                    Componenti
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br />
                <br />

                <br />
                <Button variant="raised" color="primary" onClick={partitaFiller}>
                    Partita
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br />
                <br />

                <br />
                <Button variant="raised" color="primary" onClick={torneoFiller}>
                    Torneo
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br />
                <br />

                <br />
                <Button variant="raised" color="primary" onClick={iscrizioneFiller}>
                    Iscrizione
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br />
                <br />

                <br />
                <Button variant="raised" color="primary" onClick={sottoscrizioneFiller}>
                    Sottoscrizione
                </Button>
                {/* <Button variant="raised" color="primary" onClick={deleteServer}>
                    Delete server
                </Button> */}
                <br />
                <br />



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