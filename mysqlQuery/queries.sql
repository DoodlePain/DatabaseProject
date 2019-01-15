


-- create table Server
CREATE TABLE Server (
    ip VARCHAR(21) NOT NULL,
    locazione VARCHAR(50) NOT NULL,
    tick int NOT NULL DEFAULT 128,
    primary key (ip)
    ); 

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
    );  


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
    id_gioco int not null primary key auto_increment,
    nome VARCHAR(100) NOT NULL,
    piattaforma VARCHAR(100) NOT NULL,
    abbreviazione VARCHAR(50) not null
);

-- create table Mappa
CREATE TABLE Mappa (
    id_mappa int PRIMARY KEY NOT NULL auto_increment,
    nome VARCHAR(100) NOT NULL,
    numero_giocatori int NOT NULL,
    modalita VARCHAR(100) NOT NULL,
    FK_Gioco VARCHAR(100) not null references Gioco(id_gioco) on delete cascade
);

-- create table Staff
CREATE TABLE Staff (
    id_staff int PRIMARY KEY NOT NULL auto_increment,
    ambito VARCHAR(100) NOT NULL,
    ruolo VARCHAR(100) NOT NULL,
    FK_Utente int NOT NULL REFERENCES Utente(id_utente) ON DELETE CASCADE
);

-- create table Missioni
CREATE TABLE Missioni (
    id_missione int PRIMARY KEY NOT NULL auto_increment,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    scopo VARCHAR(100) NOT NULL,
    FK_Gioco VARCHAR(100) NOT NULL REFERENCES Gioco(nome),
    FK_Premio int NOT NULL REFERENCES Oggetti(id_ogetto) ON DELETE CASCADE
);

-- create table Squadra
CREATE TABLE Squadra (
    id_squadra int PRIMARY KEY NOT NULL auto_increment,
    nome VARCHAR(100) NOT NULL,
    FK_Sponsor int NOT NULL REFERENCES Sponsor(id_sponsor) ,
    FK_Leader int NOT NULL REFERENCES Utente(id_utente) ,
    FK_Manager int NOT NULL REFERENCES Utente(id_utente) ,
    FK_Statistiche int NOT NULL REFERENCES Statistiche(id_stat) ON DELETE CASCADE
);

-- create table Componenti
CREATE TABLE Componenti (
    id_componenti int PRIMARY KEY NOT NULL auto_increment,
    FK_Utente int  REFERENCES Utente(id_utente) ,
    FK_Squadra int  REFERENCES Squadra(id_squadra) 
);

-- create table Partita
CREATE TABLE Partita (
    id_partita int PRIMARY KEY NOT NULL auto_increment,
    data date NOT NULL,
    ora VARCHAR(50) NOT NULL,
    FK_Squadra1 int NOT NULL REFERENCES Squadra(id_squadra) ,
    FK_Squadra2 int NOT NULL REFERENCES Squadra(id_squadra) ,
    FK_Server varchar(21) NOT NULL REFERENCES Server(ip) ,
    FK_Mappa int NOT NULL REFERENCES Mappa(id_mappa) 
);

-- create table Abbonamento
CREATE TABLE Abbonamento (
    id_abbonamento int PRIMARY KEY NOT NULL auto_increment,
    durata int NOT NULL,
    costo   real NOT NULL,
    tipo VARCHAR(100) NOT NULL
    );

-- create table Torneo 
create table Torneo (
    id_torneo int not null primary key auto_increment,
    nome varchar(100) not null,
    slot int,
    data_inizio date not null,
    data_fine date not null,
    FK_Organizzatore int NOT NULL REFERENCES Organizzatore(id_organizzatore) ,
    FK_Sponsor int NOT NULL REFERENCES Sponsor(id_sponsor) ,
    premio int default 0)
    ;

-- create table Sottoscrizione
create table Sottoscrizione (
    id_sottoscrizione int auto_increment not null primary key,
    data_inizio date not null,
    data_fine date not null,
    FK_Utente int NOT NULL REFERENCES Utente(id_utente),
    FK_Abbonamento int NOT NULL REFERENCES Abbonamento(id_abbonamento)
    );

-- create table Iscrizione
create table Iscrizione(
    id_iscrizione int not null auto_increment primary key,
    FK_Squadra int not null references Squadra(id_squadra) ,
    FK_Torneo int not null references Torneo(id_torneo) 
    );

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



insert into  Mappa (nome,numero_giocatori,modalita,FK_Gioco) values 
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



-- QUERY : 
-- Tutti gli staffer, con i relativi ruoli e ambiti 
select username,ruolo, ambito from Staff,Utente where id_utente=FK_Utente

--  Tutti gli utenti italiani con il TFA attivo
select Utente.username from Utente where lingua = "it" and tfa=1;

-- Il nome di tutti i tornei con almeno 32 Slot e un premio di almeno 2000 Punti
select nome from Torneo where slot>=32 and premio>2000;

-- Tutti i nomi delle squadre con almeno un giocatore livello 10
select Squadra.nome from Squadra,Utente, Componenti,Statistiche where (
Componenti.FK_Utente1=Utente.id_utente or
Componenti.FK_Utente2=Utente.id_utente or
Componenti.FK_Utente3=Utente.id_utente or
Componenti.FK_Utente4=Utente.id_utente or
Componenti.FK_Utente5=Utente.id_utente or
Componenti.FK_Utente6=Utente.id_utente or
Componenti.FK_Utente7=Utente.id_utente or
Componenti.FK_Utente8=Utente.id_utente) and FK_Statistiche=id_stat and livello=10 and FK_Squadra = id_Squadra

-- Tutti i giocatori tedeschi in classifica top 10k
select * from Statistiche,Utente where FK_Statistiche = id_stat and class_continentale between 1 and 10000 and lingua like "de%"

-- Tutti i giocatori italiani con un winrate di almeno 45%
select * from Statistiche,Utente where FK_Statistiche = id_stat and winrate>45 and lingua="it"

-- Spesso bisogna controllare gli utenti con statistiche molto elevate per controllare se sono leciti, quindi mostriamo tutti i giocatori con statistiche sopra la media
select Utente.username,winrate  from Utente,Statistiche where FK_Statistiche 
= id_stat and winrate>(select avg(winrate) from Statistiche)+25

-- Utenti che stanno in top 10000 naz e continentale
select * from Statistiche where class_continentale<=10000 or class_nazionale<=1000

-- Eta' media dei giocatori
select avg((CURRENT_DATE - data_di_nascita )/10000) as Anni, data_di_nascita , CURRENT_DATE from Utente;

-- La media dei premi dei tornei nel dicembre del 2016
select avg(premio) from Torneo where slot>30 and (data_inizio between '2016-12-01' and '2016-12-31') and (data_fine between '2016-12-01' and '2016-12-31')

-- Numero di utenti con la mail Gmail
select count(email) from Utente where email like "%gmail.com";

-- Username data di nascita ed eta' delle persone verificate in lega Gold
select username,data_di_nascita,(CURRENT_DATE - data_di_nascita )/10000 as eta from Utente,Statistiche where tfa=1 and FK_Statistiche = id_stat and ((CURRENT_DATE - data_di_nascita )/10000)>18 and lega = "Gold" ;

-- Tutti i server che sono stati usati in piu' di una partita
select *,count(FK_Server) from Partita,Server where FK_Server=ip group by FK_Server having count(FK_Server)>1 ;

-- Tutte gli sponsor che sponsorizzano almeno 2 squadre
select Sponsor.nome,count(FK_Sponsor) as Squadre_Sponsorizzate from Squadra, Sponsor where FK_Sponsor = id_sponsor group by FK_Sponsor having count(FK_Sponsor)>1

-- TUtti gli organizzatori Verificati che non hanno mai organizzato un torneo
select Organizzatore.nome
from Organizzatore LEFT JOIN Torneo ON FK_Organizzatore =id_organizzatore
WHERE FK_Organizzatore IS NULL and verificato=1

-- Numero di squadre iscritte ad ogni torneo 
select nome,Sum(FK_Squadra)  From Iscrizione,Torneo where FK_Torneo = id_torneo order by FK_Torneo asc
DA SISTEMARE

-- Numero di partite giocate su ogni mappa
select nome,count(FK_Mappa) as partite_giocate From Partita,Mappa where FK_Mappa= id_mappa group by nome;

-- Numero di partite giocate nel 2018
select * from Partita where data between '2018-01-01' and '2018-12-31';

-- Numero di abbonamenti venduti per ogni tipo 
select tipo,durata,count(id_sottoscrizione) from Abbonamento,Sottoscrizione where FK_Abbonamento=id_abbonamento Group by id_abbonamento;




TRIGGER
-- Impedisce di creare utenti di eta' minore di 16 anni
CREATE TRIGGER controllo_eta
BEFORE INSERT ON Utente
FOR EACH ROW
IF ((CURRENT_DATE() - NEW.data_di_nascita )/10000)<16
THEN
SET NEW.username = null;
END IF;

-- Imposta un premio minimo a 500 fp 
CREATE TRIGGER premio_minimo
BEFORE INSERT ON torneo
FOR EACH ROW
IF (NEW.premio<500)
THEN
SET NEW.premio = 500
END IF;
