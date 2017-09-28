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

        if (trainName === "" || destination === "" || firstTrainTime === "" || frequency === "") {
            alert("Please fill in all fields!");
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

    database.ref().orderByChild("timeAdded").on("child_added", function(snapshot) {
        var snapshotData = snapshot.val();

        var currentTime = moment();

        var firstTrain = moment(snapshotData.firstTrainTime, "HH:mm");

        var diffTime = moment().diff(firstTrain, "minutes");
        var timeRemainder = diffTime % snapshotData.frequency;
        var minutesUntilTrain = snapshotData.frequency - timeRemainder;
        var nextTrain = moment().add(minutesUntilTrain,"minutes");

        var newRow = $("<tr>");

        var newTrainNameData = $("<td>");
        var newDestinationData = $("<td>");
        var newFrequencyData = $("<td>");
        var nextArrivalData = $("<td>");
        var minutesAwayData = $("<td>");

        newTrainNameData.append(snapshotData.trainName);
        newDestinationData.append(snapshotData.destination);
        newFrequencyData.append(snapshotData.frequency);
        nextArrivalData.append(moment(nextTrain).format("HH:mm"));
        minutesAwayData.append(minutesUntilTrain);

        newRow.append(newTrainNameData, newDestinationData,  newFrequencyData, nextArrivalData, minutesAwayData);

        $("tbody").append(newRow);
    });
});
