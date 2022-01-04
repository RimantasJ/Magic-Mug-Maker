var recentBlobId = "";

function mugOrderFormHandling(){

    if(!formValidation()){
        return false;
    }

    // Serialization to JSON
    var unindexed_array = $("#mugOrderForm").serializeArray();
    var formData = {};
    var extrasArray = [];
    $.map(unindexed_array, function (n) {
        if(n["name"] == "extrasSelect"){
            extrasArray.push(n["value"]);
        }
        formData[n["name"]] = n["value"];
    });
    formData.extrasSelect = extrasArray;

    $.ajax({
        url: "https://jsonblob.com/api/jsonBlob",
        headers: {
            "Content-Type": "application/json"
        },
        type: "POST",
        dataType: "json",
        data: JSON.stringify(formData),
        
        success: function (data, textStatus, request) {
            recentBlobId = request.getResponseHeader("Location");
            alert("Order sent successfully");
        },
        error: function () {
            alert("Error sending data");
        }
    });
} 

function loadRecentOrder() {
    $.ajax({
        url: recentBlobId,
        headers: {
            "Content-Type": "application/json"
        },
        type: "GET",
        dataType: "json",   

        success: function (recData) {
            $("#nameCell").text(recData.nameField);
            $("#ageCell").text(recData.ageField);
            $("#deliveryDateCell").text(recData.year + "-" + recData.month + "-" + recData.day);
            $("#occupationCell").text(recData.occupation);
            $("#componentOneCell").text(recData.componentOne);
            $("#componentTwoCell").text(recData.componentTwo);
            $("#extrasCell").text(recData.extrasSelect);
        },
        error: function () {
            alert("Error sending data");
        }
    });
}

function formValidation(){

    // Validation
    if (document.forms["mugOrderForm"]["nameField"].value == "") {
        alert("Name must be filled out");
        return false;
    }

    var reg = new RegExp("^([0-9]+)$");
    var term = document.forms["mugOrderForm"]["ageField"].value;
    if (!(reg.test(term))) {
        alert("Age must be a natural number");
        return false;
    }
    var year = document.forms["mugOrderForm"]["year"].value;
    var month = document.forms["mugOrderForm"]["month"].value;
    var day = document.forms["mugOrderForm"]["day"].value;

    if (!dateValidation(year, month, day)){
        alert("Delivery date is invalid");
        return false;
    }

    if (!document.mugOrderForm.responsibilityAcceptance.checked) {
        alert("You must accept the power and responsibility");
        return false;
    }

    return true;
}

function dateValidation(year, month, day) {

    var currDate = new Date();

    if (month < 1 || month > 12 || day < 1 || day > 31 ) {
        return false;
    }

    if (month == (4 || 6 || 9 || 11) && day == 31) {
        return false;
    }

    if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0) && month == 2 && day > 29) {
        return false;
    }

    if (!(year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) && month == 2 && day > 28) {
        return false;
    }
    
    if (year < currDate.getFullYear() || 
        (year == currDate.getFullYear() && ((month < currDate.getMonth() + 1) || 
        ((month == currDate.getMonth() + 1) && day <= currDate.getDate())))){
        return false;
    }
    return true;
}

function checkName() {
    var temp = $("input[name='nameField']").val();
    $("#orderName").text("Name: " + temp);
}

function checkAge() {
    $("#logo").css("color", "red");
    var temp = $("input[name='ageField']").val();
    $("#orderAge").text("Age: " + temp);
    
    if (temp < 42) {
        $("#extrasHeader").css("display", "none");
        $("#mugOrder select").css("display", "none");
        $("#extrasList").empty();
        $("select[name='extrasSelect']").val([]);
    } else {
        $("#extrasHeader").css("display", "block");
        $("#mugOrder select").css("display", "block");
    }
}

function checkDate(){
    var year = $("input[name='year']").val();
    var month = $("input[name='month']").val();
    var day = $("input[name='day']").val();

    if(year != "" && month != "" && day != ""){
        $("#orderDeliveryDate").text("Delivery Date: " + year + "-" + month + "-" + day);
    }
}

function checkOccupation(occupation) {
    $("#orderOccupation").text("Occupation: " + occupation);
}

function checkCompOne(component) {
    $("#orderCompOne").text("Component one: " + component);
}

function checkCompTwo(component) {
    $("#orderCompTwo").text("Component two: " + component);
}   

function checkExtras() {
    var extras = $("#extrasList").empty();

    extras = $("select[name='extrasSelect']").val();
    extras.forEach(addExtraItem);
}

function addExtraItem(item, index) {
    $("#extrasList").append("<li>" + item + "</li>");
}

