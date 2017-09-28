$(document).ready(function(){
    //initializing variables
    var database = firebase.database();
    var trainName;
    var destination;
    var firstTrainTime;
    var frequency;

    $("#submit").on("click", function(event){

        //prevents default button event
        event.preventDefault();

        //updates variables based on the text within the input fields
        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        firstTrainTime = $("#firstTrainTime").val().trim();
        frequency = $("#frequency").val().trim();

        //all input values must be filled
        if (trainName === "" || destination === "" || firstTrainTime === "" || frequency === "") {
            alert("Please fill in all fields!");
            //time data must be in correct format in input
        } else if (moment(firstTrainTime,"HH:mm",true).isValid() && (frequency%1) === 0) {
            //pushes data to the firebase database
            database.ref().push({
                trainName,
                destination,
                firstTrainTime,
                frequency,
                timeAdded: firebase.database.ServerValue.TIMESTAMP
            });

            //empties input text boxes
            $("input").val("");
        }
        else {
            alert("Please enter correct time format");
        }

    });

    //when data is added to firebase
    database.ref().orderByChild("timeAdded").on("child_added", function(snapshot) {
        //initialize variables
        var snapshotData = snapshot.val();

        //current time of user at time of button click
        var currentTime = moment();

        //formats first train data
        var firstTrain = moment(snapshotData.firstTrainTime, "HH:mm");

        //uses the data to calculate time until next train and the time of the next train
        var diffTime = moment().diff(firstTrain, "minutes");
        var timeRemainder = diffTime % snapshotData.frequency;
        var minutesUntilTrain = snapshotData.frequency - timeRemainder;
        var nextTrain = moment().add(minutesUntilTrain,"minutes");

        //creates a new table row to store the data
        var newRow = $("<tr>");

        //creates new table data elements to store data
        var newTrainNameData = $("<td>");
        var newDestinationData = $("<td>");
        var newFrequencyData = $("<td>");
        var nextArrivalData = $("<td>");
        var minutesAwayData = $("<td>");

        //appends data to table data elements
        newTrainNameData.append(snapshotData.trainName);
        newDestinationData.append(snapshotData.destination);
        newFrequencyData.append(snapshotData.frequency);
        nextArrivalData.append(moment(nextTrain).format("HH:mm"));
        minutesAwayData.append(minutesUntilTrain);

        //appends table data elements to table row
        newRow.append(newTrainNameData, newDestinationData,  newFrequencyData, nextArrivalData, minutesAwayData);

        //appends the new table row to the table body
        $("tbody").append(newRow);
    });
});
