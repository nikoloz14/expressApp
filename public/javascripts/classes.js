"use strict";
class ProgrammesList {
    
    constructor(bachelor, master, phd, prof) {
        this.bachelor = bachelor;
        this.master = master;
        this.phd = phd;
        this.prof = prof;
    }
    
}

class ProgrammeType {
    
    constructor(freeuni, agruni) {
        this.freeuni = freeuni;
        this.agruni = agruni;
    }
}

class Programme {
    
    constructor(name, id, progType, progSchool) {
        this.name = name;
        this.id = id;
        this.progType = progType;
        this.progSchool = progSchool;
    }
    
}

class Competition {
    
    constructor(name,link, id) {
        this.name = name;
        this.id = id;
        this.link = link;
    }
    
}

class Event {
    
    constructor(title,date,description,imageURL,lecturer,room, id) {
        this.title = title;
        this.id = id;
        this.imageURL = imageURL;
        this.date = date;
        this.description = description;
        this.lecturer = lecturer;
        this.room = room;
    }
    
}