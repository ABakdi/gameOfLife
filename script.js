var settingsButton = document.getElementById("settings-button")
var controlPanel =  document.getElementById("control-panel")
var gameOfLife = document.getElementById("game-of-life")
var startStopButtons = document.getElementsByClassName('start-stop')
var itterateButton = document.getElementById('itterate')
var itterationsInputElement = document.getElementById('itterations')
var speedButtons = document.getElementsByClassName('speed-buttons')[0].children
var speedLabel = document.getElementById('speed-label')
var itterationsLabel = document.getElementById('itterations-label')
var dimensionLabel = document.getElementById('dimensions-label')
var randomizeButtons = document.getElementsByClassName('randomize')
var setGridDimonsionButton = document.getElementById('set-dimension')
var itterationsDone = 0
var TimeUnit = 1000
var settingsButtonClicked = false
var interval = null
var XCELLS
var YCELLS
//a Set to store all alive cells in the grid
var aliveCells = new Set()
var allCells = null

//event listener to handle setGridDimonsionButton
setGridDimonsionButton.addEventListener('click', function(){
    x = Number(document.getElementById('X').value)
    y = Number(document.getElementById('Y').value)
    if(x != NaN && y != NaN && x>0 && y>0){
        clearInterval(interval)
        allCells = null
        setGridDimonsion(x, y)
    }
})

//Evant listener for the randomizeButtons to fill the grid randomaly with living cells
for(let randomizeButton of randomizeButtons){
    randomizeButton.addEventListener('click', function(){
        n = Math.floor(Math.random()*(XCELLS*YCELLS) + 1)
        console.log(n)

        for(i = 0; i<n; i++){
            x = Math.floor(Math.random()*XCELLS) +1
            y = Math.floor(Math.random()*YCELLS) +1
            changeCellState(document.getElementById('X-'+x+'-Y-'+y))
        }
    })

}

//this function is going to be called when clicking on start in startStopButton
function lambda(){
    //keep the current TimeUnit in refreshingTime variable
    refreshingTime = TimeUnit
    //start game of life
    interval = setInterval(function(){
        //update the grid
        updateGridState()
        //check if the speed has been changed
        //if it has
        if(refreshingTime != TimeUnit){
            //stop game of life
            clearInterval(interval)
            //reacall lambda to start game of life with the new speed
            lambda()
        }
    },refreshingTime)
}
//Event listener for setting button to slide the settings up and down(works only in small screens < 600px)
settingsButton.addEventListener('click', function(){
    controlPanel.classList.toggle("slide-up")
    settingsButtonClicked = !settingsButtonClicked
})

//Event listener for the Two start/stop button to start/stop game of life
for(let startStopButton of startStopButtons){
    startStopButton.addEventListener('click',function(){
        //stop game of life
        clearInterval(interval)
        //toggle the start/stop button for both buttons to avoid confusing the user when changing the view port
        //both buttons should be clicked or not at the same time
        for(let stb of startStopButtons)
            stb.classList.toggle('clicked')
        //if the startStopButton contains clicked class meaning we clicked start
        if(startStopButton.classList.contains('clicked')){
            //change the text on startStopButton to Stop
            startStopButton.innerHTML = "Stop"
            //update the grid every TimeUnit
            lambda()
        //if the clicked class isn't present meaning we clicked Stop
        }else{
            //stop game of life
            clearInterval(interval)
            //changethe text on startStopButton to start
            startStopButton.innerHTML = "Start"
        }
    })
}
//Evant listener to control the speed in which the game of life is going to run by handling the click events on speed buttons
for(let speedButton of speedButtons){
    speedButton.addEventListener('click',function(){
        for(let sb of speedButtons)
            sb.classList.remove('clicked')
        if(!speedButton.classList.contains('clicked')){
            TimeUnit = 1000/Number(speedButton.id.split('x')[1])
            speedButton.classList.add('clicked')
            speedLabel.innerHTML = "Speed: " + speedButton.id
        }
    })
}



//Evanet listener to handle the itterate button.
//itterate game-of-life for x itterations 
//we get x from the itterationsInputElement
itterateButton.addEventListener('click',function(){
    //stop game of life
    clearInterval(interval)
    //toggle clicked class
    //this class is present when itterating, and it will be removed if we stop or finish itterating
    itterateButton.classList.toggle('clicked')
    //if the button has been clicked (the text on it is itterate
    if(itterateButton.classList.contains('clicked')){
        //get the number of itteratins from itterationsInputElement
        x = Number(itterationsInputElement.value)
        //if the value in itterationsInputElement is a number and greater than 0
        if(x != NaN && x >0){
            //change the text in itterateButton to Stop now that we are going to itterate
            //evedently clicking on the button one more time(after changing the text on it to Stop)
            //will stop the itteration
            itterateButton.innerHTML = "Stop"
            //inetialize itterationsDone with zero because we havent started itterating yet
            //this is a procaution in case the value of itterationsDone isn't zero after previos itterations
            itterationsDone = 0
            //put the number of itterations we are going to do in the second<i> tag after /
            itterationsLabel.children[1].innerHTML = x
            //put the number of itterations we have done (0) in the first <i> tag before /
            //we get : number_of_itteration_we_have_done / number_of_itteration_we_have_to_do
            //in the itterationsLabel in th html page
            itterationsLabel.children[0].innerHTML = itterationsDone
            //call itterate function to start itterating
            //x: number of itterations we have to do (we got this from itterationsInputElement)
            //the callback function is going to be excuted after we are done itterating
            itterate(x, function(){
                //remove the clicked class from itterateButton
                itterateButton.classList.remove('clicked')
                //change the text on itterateButton from Stop to Itterate(after we're done itterating)
                itterateButton.innerHTML = "Itterate"
            })
        }
    //if the button has been clicked (the text on it is Stop)
    //the class clicked has been removed the moment we clicked itterateButton
    }else{
        itterateButton.innerHTML = "Itterate"
    }
})

//itterate
//ittr: the number of itterations we have to do
//_callback: a function to call whan we are done itterating
function itterate(ittr, _callback){
    //we use the current TimeUnit as the refresh rate of the grid
    refreshingTime = TimeUnit
    //x: is the number of itterations we have to do
    var x = ittr
    //here we keep a referenca to the current interval in a global variabale (interval)
    interval = setInterval(function(){
        //update the grid
        updateGridState()
        //decrement the itteration number we have to do evrry time we updte the grid
        x--
        //increment the number of itterations we have already done
        itterationsDone++
        //update the number of itterations we have alredy done in the html page (the itterations label)
        itterationsLabel.children[0].innerHTML = itterationsDone
        //in case we clicked on one of the speed buttons TimeUnit will change and we need to change the refresh rate of the grid
        //so here we compare the refreshTime(the current refresh rate) if the are not equal that means one of the speed buttons
        //has been clicked and we need to change the refresh rate
        if(refreshingTime!=TimeUnit){
            //stop itterating/stop game of life
            clearInterval(interval)
            //start itterating with x being what number of itterations is left to do
            itterate(x,_callback)
        }
        //when we complete itterating x reashes 0
        //we stop itterating
        if(x<=0){
            //stop itterating
            clearInterval(interval)
            //excute _callback because we are done
            _callback()
        }
        //reupdate the grid every refreshingTime milli seconds
    }, refreshingTime)
}

//populate the area with cells
setGridDimonsion(50, 50)

//handler to control the number of cells by setting Xcells and Ycells
function setGridDimonsion(Xcells, Ycells){
    XCELLS = Xcells
    YCELLS = Ycells
    gameOfLife.innerHTML = ""
    dimensionLabel.children[0].innerHTML = Xcells + "X" + Ycells
    for(var i=1; i<=Ycells; i++){
        gameOfLife.innerHTML +='<div class="YContainer" id="Y'+ i +'"></div>'
        var YContainer = document.getElementById("Y"+i)
        for(var j=1; j<=Xcells; j++){
            YContainer.innerHTML += '<div class="Cell" id="X-'+ j + '-Y-' + i +'"></div>'
        }
    }
    addChangeCellStateHandler()
}


//handler to change the state of a cell
function addChangeCellStateHandler(){
    var allCells = document.getElementsByClassName('Cell')

    for(let cell of allCells){
        cell.addEventListener('click', function(){
            changeCellState(cell)
        })
    }
}
//make a cell alive
function changeCellState(cell){
    cell.classList.toggle('alive-cell')
    if(isAlive(cell)){
        aliveCells.add(cell)
    }else{
        aliveCells.delete(cell)
    }
}

//return the cells that willDie and cells willBeBorn
function passJudgment(){
        //this set of cells contains dead cells which have the potential to be born and living cells that have potential to die.
        var potentialCells = new Map()
        //these cell are going to die when updating the grid
        willDie = new Set()
        //these cells will be born when updateing the grid
        willBeBorn = new Set()
        aliveCells.forEach(function(cell){
            neighbors = getNeighbors(cell)
            //console.log(cell, "neighbors are:", neighbors, "the living ones are: ", returnAlive(neighbors))
            //A living cell will die if it has more than 3 neighbors(Rule1: over population)
            //A living cell will die if it has 1 or no neighbors(Rule: isolation)
            if(returnAlive(neighbors).size == 0 || returnAlive(neighbors).size == 1 || returnAlive(neighbors).size > 3){
                willDie.add(cell)
            }

            neighbors.forEach(function(ncell){
                if(potentialCells.has(ncell)){
                    //console.log('has')
                    rep = potentialCells.get(ncell)
                    potentialCells.set(ncell, rep+1)
                }else{
                    potentialCells.set(ncell, 1)
                }
            })
        })

        //here we will decide the fate of potentialCells the final judgment is whether a living cell will die or not and whether a dead cell
        //will be born or not
        potentialCells.forEach(function(numberOfNeighbors, pcell){
            //A dead cell will be born if it has exactly 3 living neighbors
            if(!isAlive(pcell) && numberOfNeighbors==3){
               willBeBorn.add(pcell)
            }
            //the rest of the cells will stay as they are
        })
        //console.log("AliveNow: ",aliveCells)
        //console.log("PCells: ",potentialCells)
        //console.log("willBeBorn: ", willBeBorn, "willDie: ", willDie)
        return new Set([...willBeBorn, ...willDie])
}


function updateGridState(){
    //this set contains the living cells that are going to die and the dead cells that are going to be born
    //we simply are going to flip there states.
    flipState = passJudgment()
    flipState.forEach(function(cell){
        changeCellState(cell)
    })
}

//get the neighboring cells od cell
function getNeighbors(cell){
    var neighbors = new Set();
    var X = Number(cell.id.split('-')[1])
    var Y = Number(cell.id.split('-')[3])
    for(i = X-1; i<= X+1 ; i++){
        for(j = Y-1; j<= Y+1; j++){
            if(i == X && j==Y)
                continue
            element = document.getElementById('X-'+i+'-Y-'+j)
            if(element)
               neighbors.add(element)
        }
    }
    return neighbors
}

//return only living cells from a set os cells
function returnAlive(cells){
    alive = new Set()
    cells.forEach(function(cell){
        if(isAlive(cell))
            alive.add(cell)
    })
    return alive
}

//return true if cell is alive, false otherwise
function isAlive(cell){
    if(cell.classList.length == 2)
        return true
    return false
}



