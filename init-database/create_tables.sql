ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

create database optimise;

use optimise;

create table if not exists Users (
	username VARCHAR(255) NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    PRIMARY KEY (username)
); 

create table if not exists Lists (
	list_id int not null auto_increment, 
    list_name varchar(255) not null,
    creator VARCHAR(255) not null, 
    primary key (list_id), 
    foreign key (creator) references Users(username) on delete cascade
);

create table if not exists Todos (
	todo_id int not null auto_increment, 
	todo_name varchar(255) not null, 
	todo_description varchar(255) not null, 
    todo_deadline DATE not null, 
    parent_list int not null, 
    creator VARCHAR(255) not null,
    completed TINYINT(1) DEFAULT 0,
    primary key (todo_id), 
    foreign key (parent_list) references Lists(list_id) on delete cascade,
    foreign key (creator) references Users(username) on delete cascade
);