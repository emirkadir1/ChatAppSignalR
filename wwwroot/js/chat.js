"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").withAutomaticReconnect().build();

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${user} says ${message}`;
});
connection.on("clientJoined", function (nickName) {
    var alert = document.getElementById("clientJoinedAlert");
    var p = document.createElement("p");
    p.textContent = `${nickName} İsmi ile Giriş Yapıldı!`;
    alert.appendChild(p);
    $(document).ready(function () {
        window.setTimeout(function () {
            $("#clientJoinedAlert").fadeTo(0,100).slideUp(2000, function () {
                $(this).remove();
            });
        },0);
    });
});
connection.on("userLeaved", function (conId) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${conId} Leaved! `;
});
connection.on("clients", function (users) {
    const userList = document.getElementById("clients");
    userList.innerHTML = "";
    users.forEach(function (user) {
        const listItem = document.createElement("li");
        console.log(user);
        listItem.innerText = user.nickName;
        userList.appendChild(listItem);
    });
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});
document.getElementById("groupButton").addEventListener("click", function (event) {
    var groupName = document.getElementById("groupName").value;
    connection.invoke("AddGroup", groupName).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});
document.getElementById("LogIn").addEventListener("click", function (event) {
    var userName = document.getElementById("userInput").value;
    connection.invoke("GetNickName", userName).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});
document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    var groupName = document.getElementById("groupName").value;
    if (groupName == "") {
        connection.invoke("SendMessage", user, message).catch(function (err) {
            return console.error(err.toString());
        });
    }
    else {
        connection.invoke("SendMessageGroup", user, message, groupName).catch(function (err) {
            return console.error(err.toString());
        });
    }

    event.preventDefault();
});