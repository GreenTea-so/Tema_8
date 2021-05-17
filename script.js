function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
  }



function invite_direct(departament, size_invite){  //паттерн стратегия
    for(let i=0; i<size_invite; i++){
        workers.push(new Worker(1))
        departament.invite()
        stats_invite++
    }
}


let instance_direct = false

class Direct{

    static invite_worker_web
    static invite_worker_mobile


    constructor(){
        if (!instance_direct){   //паттерн одиночка
            instance_direct = this
        }
        this.invite_worker_web = 0
        this.invite_worker_mobile = 0
        return instance_direct
    }

    invite(){
        invite_direct(webDepartament, this.invite_worker_web) //паттерн стратегия
        invite_direct(mobileDepartament, this.invite_worker_mobile)
        
        this.invite_worker_web =0
        this.invite_worker_mobile = 0
       
    }

    unvite(){
        let stats_uninvite = 0
        for(let i=0; i<workers.length; i++){
            if (workers[i].getStatsuval() >=3){
                stats_uninvite++
            }
                
        }
        
        let day = 0
        //console.log("uninvite", stats_uninvite, day)
        if (stats_uninvite>0 && day==0){
            //console.log("uninvite")
            for(let i =0; i<workers.length; i++){
                if (workers[i].getStatsuval() >=3){
                    if (workers[i].getType() == 1){
                        webDepartament.freework_un()
                    }
                    if (workers[i].getType() == 2){
                        mobileDepartament.freework_un()
                    }
                    if (workers[i].getProject()!=undefined){
                        projects.push(workers[i].getProject())
                    }
                    //console.log("==========================", workers[i])
                    workers.splice(i,1)
                    day++
                    stats_uval++
                }
            }
        }
    }

    getProject(){
        let k = getRandom(0,4)
        let lvl = 0
        let dep = 0
        let array_tmp = []

        for(let i=0; i<k; i++){
            lvl = getRandom(1,3)
            dep = getRandom(1,2)
            array_tmp.push(new Project(lvl, dep))
        }
        return array_tmp
        
    }

    transferProject(){
        for (let i=0; i<projects.length; i++){
            
            if(projects[i].getType() == 1){
                
                if(webDepartament.getFreeWorker()>0){
                    //console.log("============================")
                    webDepartament.transferProject(projects[i])
                    projects.splice(i, 1)
                    //console.log("Projects transfer")
                }
                else{
                    this.invite_worker_web++
                }
            }
            else{

                if(projects[i].getType() == 2){
                    
                    if(mobileDepartament.getFreeWorker()>0){
                        //console.log("============================")
                        mobileDepartament.transferProject(projects[i])
                        projects.splice(i, 1)
                        //console.log("Projects transfer")
                    }
                    else{
                        this.invite_worker_mobile++
                    }
                }
            }
        }
    }



}

class Departament{
    static type
    static free_worker
    static itog_project


    constructor(_type){
        this.type = _type
        this.free_worker = 0
        this.itog_project = 0
    }

    invite(){
        this.free_worker++
    }

    transferProject(_project){
        for(let i=0; i<workers.length; i++){
            
            if (workers[i].getType() == _project.getType() && workers[i].getProject()==undefined){
                //console.log("aaa")
                workers[i].addProject(_project)
                this.free_worker--
                break
                
            }
        }

        if (this.free_worker>0){
            for(let i=0; i<workers.length; i++){
                if (workers[i].getProject()!=undefined){
                    if(workers[i].getType == 2 && workers[i].getProject().getLvl() == 2 && workers[i].getProject().getQuantity()==1){
                        for(let j=0; j<workers.length && workers[i].getProject().getQuantity!=2; j++){
                            if(workers[j].getType == 2 && workers[j].getProject() == undefined){
                                workers[j].addProject(workers[i].getProject())
                                workers[i].getProject().cnahgeQuantity(2)
                                workers[j].getProject().cnahgeQuantity(2)
                                this.free_worker--
                            }
                        }
                    }

                    if(workers[i].getType == 2 && workers[i].getProject().getLvl() == 3 && workers[i].getProject().getQuantity()<3){
                        for(let j=0; j<workers.length && workers[i].getProject().getQuantity<3; j++){
                            if(workers[j].getType == 2 && workers[j].getProject() == undefined){
                                workers[j].addProject(workers[i].getProject())
                                workers[i].getProject().cnahgeQuantity(0)
                                workers[j].getProject().cnahgeQuantity(0)
                                this.free_worker--
                            }
                        }
                    }

                }
            }
        }

        
        
    }

    getFreeWorker(){
        return this.free_worker
    }

    freework(){
        this.free_worker++
    }

    freework_un(){
        this.free_worker--
    }

    getstats(){
        return this.itog_project
    }

    incstats(){
        this.itog_project++
    }

}

var size_id_project = 0

class Project{
    static lvl
    static type
    static id
    static quantity_worker
    

    constructor(_lvl, _type){
        this.lvl = _lvl
        this.type = _type
        this.id = size_id_project
        size_id_project++
        this.quantity_worker = 0
    }

    getLvl(){
        return this.lvl
    }

    getType(){
        return this.type
    }

    joinDay(){
        this.lvl--
        
        if(this.lvl <=0){
            if (this.type ==1){
                webDepartament.incstats()
            }
            if (this.type ==2){
                mobileDepartament.incstats()
            }
            
            return true
        }
        else{
            return false
        }
    }

    cnahgeQuantity(_quantity){
        this.quantity_worker = _quantity
        if (_quantity ==0){
            this.quantity_worker++
        }
    }

    getQuantity(){
        return this.quantity_worker
    }

}





function free_work_web(){
    webDepartament.freework()
}

function free_work_mobile(){
    mobileDepartament.freework()
}


class Worker{
    static project
    static project_stats
    static uval_stats
    static back_day

    constructor(_type){
        this.type = _type
        this.project_stats = 0
        this.uval_stats = 0
        this.back_day = -1
    }

    addProject(_project){
        this.project = _project
        this.project.cnahgeQuantity(1)
    }

    getType(){
        return this.type
    }

    getProject(){
        return this.project
    }

    joinDay(_day){
        let uval = getRandom(0, 20)
       

        //console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUUU", uval, this.back_day +1, _day)
        if ((uval > 15 && this.back_day +1 == _day) || (this.back_day==-1 && uval > 18)){
            this.uval_stats++
            
        }
        else{
            this.uval_stats = 0
        }
        this.back_day = _day
        

        if (this.project.joinDay()){
            if (this.type ==1){  //паттерн стратегия
                free_work_web()
            }

            if (this.type ==2){
                free_work_web()
            }
            QADep.addProject(this.project)
            this.project = undefined
            //stats_project++
            this.project_stats++
        }
    }

    getStatsuval(){
        return this.uval_stats
    }

    
}

let instance_QA

class QADepartament {
    static type
    projects

    constructor(_type){
        if (!instance_QA){   //паттерн одиночка
            instance_QA = this
        }

        this.projects = []
        this.type = _type

        return instance_QA
    }

    addProject(_project){
        this.projects.push(_project)
    }

    getProjects(){
        return this.projects
    }

    joinDay(){
        for(let i = 0; i<this.projects.length; i++){
            stats_project++
            this.projects.splice(i, 1)
        }
    }
}


var stats_project = 0
var stats_uval = 0
var stats_invite = 0


const direct = new Direct()

let projects = []

const workers = []


const webDepartament = new Departament(1)
const mobileDepartament = new Departament(2)
const QADep = new QADepartament(3)



const start = (k)=>{

    for(let i=0; i<k; i++){
        
        direct.invite()
        
        
        projects=  projects.concat(direct.getProject())
        direct.unvite()

        direct.transferProject()
        //console.log("DAY:", i+1)
        //console.log("Projects: ", projects.length, workers.length)
        
        for(let j=0; j<workers.length; j++){
            //console.log(j, workers[j].getProject(), workers.length)
            if(workers[j].getProject()!=undefined){
                workers[j].joinDay(i)
                //console.log(j, workers[j].getProject())
            }

        }

        QADep.joinDay()
    }


    //console.log(stats_project, projects.length)
    //console.log(webDepartament.getstats(), mobileDepartament.getstats(), workers)



    console.log("Уволенных сотрудников: ", stats_uval)

    //console.log(webDepartament.getFreeWorker())

    //console.log(QADep.getProjects().length)

    console.log("Выполненных проектов: ", stats_project)

    console.log("Принятых сотрудников: ", stats_invite)
}











