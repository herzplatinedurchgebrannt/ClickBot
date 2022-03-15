let interval = 1000

let loops = 4;

function changeInterval(){
    interval += 100
}


function count(){
    setTimeout(() => {
        
        if (loops > 0){
            count()
            console.log("jo")
            changeInterval();
            loops -= 1;
        }
    }, interval);
}

count();