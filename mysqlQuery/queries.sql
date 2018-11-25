-- create table Server
CREATE TABLE Server (
    ip VARCHAR(15) PRIMARY KEY NOT NULL,
    porta int NOT NULL,
    locazione VARCHAR(50) NOT NULL,
    tick int NOT NULL DEFAULT 128) 
Engine=InnoDB;




-- create table Utente
CREATE TABLE Utente (
    id_utente int PRIMARY KEY auto_increment ,               
    username VARCHAR(50) NOT NULL, 
    email VARCHAR(100) NOT NULL ,     
    lingua VARCHAR(50) NOT NULL ,                           
    nome VARCHAR(50) NOT NULL ,                          
    sesso CHAR NOT NULL ,                                   
    data_di_nascita DATE NOT NULL,                       
    indirizzo VARCHAR(100) NOT NULL ,                       
    tfa Boolean NOT NULL DEFAULT 0,                                    
    steamid VARCHAR(50) NOT NULL,
    FK_Statistiche int NOT NULL REFERENCES Statistiche(id_stat) ON DELETE CASCADE
    )
    Engine=InnoDB;  


-- create table Statistiche
CREATE TABLE Statistiche (
    id_stat int PRIMARY KEY auto_increment,
    elo int NOT NULL,
    livello int NOT NULL,
    lega VARCHAR(30),
    class_nazionale int NOT NULL,   
    class_continentale int NOT NULL,
    partite_giocate int NOT NULL,
    partite_vinte int NOT NULL,
    partite_perse int NOT NULL,
    winrate int NOT NULL
);

-- create table Sponsor
CREATE TABLE Sponsor (
    id_sponsor int PRIMARY KEY auto_increment,
    nome VARCHAR(100) NOT NULL,
    nazione VARCHAR(100) NOT NULL,
    ambito VARCHAR(100) NOT NULL,
    societa VARCHAR(100) NOT NULL
);

-- create table Organizzatori
CREATE TABLE Organizzatori (
    id_sponsor int PRIMARY KEY auto_increment,
    nome VARCHAR(100) NOT NULL,
    ambito VARCHAR(100) NOT NULL,
    societa VARCHAR(100) NOT NULL,
    nazione VARCHAR(100) NOT NULL,
    contatto VARCHAR(100) NOT NULL,
    verificato Boolean NOT NULL,
    FK_Utente int NOT NULL REFERENCES Utente(id_utente) ON DELETE CASCADE
);

-- create table Gioco 
CREATE TABLE Gioco (
    nome VARCHAR(100) NOT NULL PRIMARY KEY,
    piattaforma VARCHAR(100) NOT NULL
);

-- create table Mappe
CREATE TABLE Mappe (
    id_mappa int PRIMARY KEY NOT NULL,
    nome VARCHAR(100) NOT NULL,
    numero_giocatori int NOT NULL,
    modalita VARCHAR(100) NOT NULL
);

-- create table Staff
CREATE TABLE Staff (
    id_staff int PRIMARY KEY NOT NULL,
    ambito VARCHAR(100) NOT NULL,
    ruolo VARCHAR(100) NOT NULL,
    FK_Utente int NOT NULL REFERENCES Utente(id_utente) ON DELETE CASCADE
);

-- create table Missioni
CREATE TABLE Missioni (
    id_missione int PRIMARY KEY NOT NULL,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    scopo VARCHAR(100) NOT NULL,
    FK_Gioco VARCHAR(100) NOT NULL REFERENCES Gioco(nome),
    FK_Premio int NOT NULL REFERENCES Oggetti(id_ogetto) ON DELETE CASCADE
);

-- create table Squadra
CREATE TABLE Squadra (
    id_squadra int PRIMARY KEY NOT NULL,
    nome VARCHAR(100) NOT NULL,
    FK_Sponsor int NOT NULL REFERENCES Sponsor(id_sponsor) ON DELETE CASCADE,
    FK_Leader int NOT NULL REFERENCES Utente(id_utente) ON DELETE CASCADE,
    FK_Manager int NOT NULL REFERENCES Utente(id_utente) ON DELETE CASCADE,
    FK_Componenti int NOT NULL REFERENCES Componenti(id_party) ON DELETE CASCADE,
    FK_Statistiche int NOT NULL REFERENCES Statistiche(id_stat) ON DELETE CASCADE
);

-- create table Componenti
CREATE TABLE Componenti (
    id_componenti int PRIMARY KEY NOT NULL,
    FK_Utente1 int NOT NULL REFERENCES Utente(id_utente) ON DELETE CASCADE,
    FK_Utente2 int NOT NULL REFERENCES Utente(id_utente) ON DELETE CASCADE,
    FK_Utente3 int NOT NULL REFERENCES Utente(id_utente) ON DELETE CASCADE,
    FK_Utente4 int NOT NULL REFERENCES Utente(id_utente) ON DELETE CASCADE,
    FK_Utente5 int NOT NULL REFERENCES Utente(id_utente) ON DELETE CASCADE
);

-- create table Partita
CREATE TABLE Partita (
    id_partita int PRIMARY KEY NOT NULL,
    FK_Squadra1 int NOT NULL REFERENCES Squadra(id_squadra) ON DELETE CASCADE,
    FK_Squadra2 int NOT NULL REFERENCES Squadra(id_squadra) ON DELETE CASCADE,
    FK_Server int NOT NULL REFERENCES Server(ip) ON DELETE CASCADE,
);