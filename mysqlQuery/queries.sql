-- create table Server
CREATE TABLE Server (
                          -> ip VARCHAR(15) PRIMARY KEY NOT NULL,
                          -> porta int NOT NULL,
                          -> locazione VARCHAR(50) NOT NULL,
                          -> tick int NOT NULL DEFAULT 128)
                          -> Engine=InnoDB;




-- create table Utente
CREATE TABLE Utente (
    idUtente int PRIMARY KEY auto_increment ,               
    username VARCHAR(50) NOT NULL, 
    email VARCHAR(100) NOT NULL ,     
    lingua VARCHAR(50) NOT NULL ,                           
    nome VARCHAR(50) NOT NULL ,                          
    sesso CHAR NOT NULL ,                                   
    data_di_nascita DATE NOT NULL,                       
    indirizzo VARCHAR(100) NOT NULL ,                       
    tfa BIT NOT NULL,                                    
    steamid VARCHAR(50) NOT NULL)
    Engine=InnoDB;  