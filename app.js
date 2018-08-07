window.addEventListener('load',init);

// Initialize Firebase
let config = {
    apiKey: "AIzaSyBYe0uC7IvKqmGky2jRSv-CHLnVLC0IXHQ",
    authDomain: "cruiseship2018-f5ba9.firebaseapp.com",
    databaseURL: "https://cruiseship2018-f5ba9.firebaseio.com",
    projectId: "cruiseship2018-f5ba9",
    storageBucket: "cruiseship2018-f5ba9.appspot.com",
    messagingSenderId: "406180801322"
};
firebase.initializeApp(config);
const dbRef = firebase.database().ref();
const shipRef = dbRef.child('ships');

// Global variables
const shipListUI = document.getElementById("shipList");
const todayDateUI = document.getElementById("todaysDate");
const todaysShipUI = document.getElementById("todaysShip");
const todaysShipIntroductionUI = document.getElementById("todaysShipIntroduction");
const searchResultUI = document.getElementById("searchResult");
const searchUI = document.getElementById("search");

let shipResultArray = [];
let numberOfShips = 0;


function init() {
    todayDateUI.innerHTML = getTodaysDate();
    searchUI.addEventListener('input', matchWithSearch);
    getTodaysShips();

    // Get list of ships from Firebase DB
    shipRef.on("child_added", (snap) => {
        let ship = snap.val();
        shipResultArray.push(ship);
        /*
        let li = document.createElement("li");
        li.innerHTML = ship.nameShip;
        li.setAttribute("child-key", snap.key);
        li.addEventListener("click", shipClicked);
        shipListUI.append(li);
        */


    });
}
    function getTodaysShips() {
        let message ='';
        shipRef.on("child_added", snap =>{
            let ship = snap.val();
            if (ship.date === getTodaysDate()){
                let li = document.createElement("li");
                li.innerHTML = ship.nameShip;
                li.setAttribute("child-key", snap.key);
                li.className = "card bg-secondary mb-3";
                li.addEventListener("click", shipClicked);
                todaysShipUI.append(li);
                numberOfShips++;
            }
            if(numberOfShips > 1){
                todaysShipIntroductionUI.innerHTML = `I dag kommer det ${numberOfShips} skip til Eidfjord:`
            }else if(numberOfShips === 1){
                todaysShipIntroductionUI.innerHTML = `Dagens skip er: `
            }else{
                todaysShipIntroductionUI.innerHTML = "Det er ingen skip i dag."
            }

        });

    }

    function shipClicked(e) {
        let shipID = e.target.getAttribute("child-key");
        const shipRef = dbRef.child('ships/' + shipID);
        const shipDetailUI = document.getElementById("shipDetail");
        shipDetailUI.innerHTML = "";

        shipRef.on("child_added", snap => {
            let $p = document.createElement("p");
            $p.innerHTML = snap.key + " - " + snap.val();
            shipDetailUI.append($p);
        });
    }

    function getTodaysDate() {
        const newDate = new Date();
        const day = ("0" + newDate.getDate()).slice(-2);
        const month = ("0" + (newDate.getMonth() + 1)).slice(-2); // January is 0!
        const year = newDate.getFullYear();
        return day + '.' + month + '.' + year;

    }

    function matchWithSearch(e){
        shipResultArray.map((ship) =>{
            if(ship.nameShip.toUpperCase() === searchUI.value.toUpperCase()){
                    let li = document.createElement("li");
                    li.innerHTML = `Skipet ${ship.nameShip} kommer til Eidfjord den ${ship.date} har ${ship.maxPassengers} passasjerer med ${ship.nasjonality} nasjonalitet.
                    Skipet blir liggende i Eidfjord i tidsrommet ${ship.anchorTime}`;
                    searchResultUI.append(li);
                    li.className="mb-3";
                    console.log('snap val:'+ ship.date);
                }
                console.log("jippi")

            });

    }



