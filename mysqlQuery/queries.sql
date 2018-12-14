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
CREATE TABLE Organizzatore (
    id_organizzatore int PRIMARY KEY auto_increment,
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

-- create table Abbonamento
CREATE TABLE Abbonamento (
    id_abbonamento int PRIMARY KEY NOT NULL auto_increment,
    durata int NOT NULL,
    costo   real NOT NULL,
    tipo VARCHAR(100) NOT NULL
    );

-- create table Torneto 
create table Torneo (
    id_torneo int not null primary key auto_increment,
    slot int,
    data_inizio date not null,
    data_fine date not null,
    FK_Organizzatore int NOT NULL REFERENCES Organizzatore(id_organizzatore) ON DELETE CASCADE,
    FK_Sponsor int NOT NULL REFERENCES Sponsor(id_sponsor) ON DELETE CASCADE,
    premio int default 0);

-- Games rows
insert into Gioco (nome,abbreviazione,piattaforma) values 
    ('Dota 2','D2','Steam'),
    ('Counter-Strike: Global Offensive','CS:GO','Steam'),
    ('CS:GO Danger Zone','CS:DZ','Steam'),
    ("PlayersUnknown's Battlegrounds",'PUBG','Steam'),
    ('Rocket League','RL','Steam'),
    ('Smite','Smite','HiRez'),
    ('Team Fortress 2','TF2','Steam'),
    ('Insidia','Insidia','Steam'),
    ('Dirty Bomb','DB','Steam'),
    ('World of tanks','WOT','Wargaming.net'),
    ('League of Legends','LOL','RIOT'),
    ('Nationa Hockey League','NLH','EASports'),
    ('Overwatch','OW','Blizzard'),
    ('Minion Masters','MM','Steam');


-- Games maps
insert into  Mappe (nome,numero_giocatori,modalita,FK_Gioco) values 
('aquadome',6,'arena','RL'),
('beckwith_park',6,'arena','RL'),
('champions_field',6,'arena','RL'),
('dfh_stadium',6,'arena','RL'),
('mannfield',6,'arena','RL'),
('neo_tokyo',6,'arena','RL'),
('salty_shores',6,'arena','RL'),
('starbase_arc',6,'arena','RL'),
('urban_central',6,'arena','RL'),
('Utopia_coliseum',6,'arena','RL'),
('westeland',6,'arena','RL'),
('standard_map',10,'arena','Insidia'),
('de_dust2',10,'competitive','CS:GO'),
('de_mirage',10,'competitive','CS:GO'),
('de_cache',10,'competitive','CS:GO'),
('de_train',10,'competitive','CS:GO'),
('de_inferno',10,'competitive','CS:GO'),
('de_nuke',10,'competitive','CS:GO'),
('de_overpass',10,'competitive','CS:GO'),
('classic_5_vs_5',10,'captains mode','D2'),
('summoners_rift',10,'draft','LOL'),
('olympus',10,'conquest','Smite'),
('cp_badlands',12,'competitive','TF2'),
('cp_granary_pro_rc4',12,'competitive','TF2'),
('cp_gullywash_final1',12,'competitive','TF2'),
('cp_metalworks',12,'competitive','TF2'),
('cp_process_final',12,'competitive','TF2'),
('cp_reckoner_b3a',12,'competitive','TF2'),
('cp_snakewater_final1',12,'competitive','TF2'),
('cp_sunshine_*',12,'competitive','TF2'),
('koth_forge_b3',12,'competitive','TF2'),
('koth_product_rc8',12,'competitive','TF2'),
('dz_blacksite',16,'danger zone','CS:DZ')
;

-- Abbonamenti
insert into Abbonamento (tipo,costo,durata) values 
('CSGO',5.99,1),
('CSGO',17.97,3),
('CSGO',29.94,6),
('CSGO',39.99,12),
('PUBG',5.99,1),
('PUBG',17.97,3),
('PUBG',29.94,6),
('PUBG',39.99,12),
('D2',5.99,1),
('D2',17.97,3),
('D2',29.94,6),
('D2',39.99,12),
('premium',9.99,1),
('premium',29.97,3),
('premium',53.95,6),
('premium',83.88,12);
