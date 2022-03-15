
        // To display output
        //var msg = document.getElementById("message");
 
        // Timer
        var t = 200;
 
        f1();
         
        // Function that changes the timer
        function changeTimer(){
            t = t * 1.2;
        }
         
        // Function to run at irregular intervals
        function f1() {
            console.log("bäm")
            changeTimer();
            setTimeout(f1, t);
        }     
     
     
     
     /*// Output message
        //var msg = document.getElementById("message");
 
        var t = 200; // Timer
         
        // Stores the setInterval ID used by
        // clearInterval to stop the timer
        var interval;
 
        f1();
 
        // Function that changes the timer
        function changeTimer(){
            t = t * 1.2;
        }


 
        // Function that run at irregular intervals
        function f1() {
             
            // Clears the previous setInterval timer
            clearInterval(interval);
            let text = "jou";
            console.log(text);

            changeTimer();
            interval = setInterval(f1, t);
        }*/