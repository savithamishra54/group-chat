var userdetail = null;

// signup

function signup(event) {
  event.preventDefault();
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let number = document.getElementById("number").value;
  let password = document.getElementById("password").value;

  let obj = {
    name: name,
    email: email,
    number: number,
    password: password,
  };
  axios
    .post("http://localhost:3000/signup", obj)
    .then((result) => {
      if (result.status == 201) {
        alert("Successfully Signed up");
        window.location.href = "./login.html";
      } else {
        throw new Error("Failed to Signup");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// login
function login(event) {
  event.preventDefault();
  let email = document.getElementById("logemail").value;
  let password = document.getElementById("logpassword").value;

  let details = {
    email: email,
    password: password,
  };
  axios
    .post("http://localhost:3000/login", details)
    .then((response) => {
      // console.log(response.data.data.data);

      console.log(response);
      alert("Successfully Logged in");
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "usergroup",
        JSON.stringify(response.data.usergroup)
      );
      window.location.href = "./group.html";
    })
    .catch((err) => console.log(err));
}

// creating groups

function creategroup(event) {
  event.preventDefault();
  let token = localStorage.getItem("token");
  let groupname = document.getElementById("groupname").value;
  let obj = {
    name: groupname,
  };

  axios
    .post("http://localhost:3000/creategroup", obj, {
      headers: { Authorization: token },
    })
    .then((response) => {
      if (response.status == 201) {
        console.log(response);
        alert(response.data.message);
      } else {
        throw new Error();
      }
    })
    .catch((err) => console.log(err));
}

window.addEventListener("DOMContentLoaded", () => {
  let token = localStorage.getItem("token");
  user = JSON.parse(localStorage.getItem("user"));

  // console.log(user);
  axios
    .get("http://localhost:3000/getgroups", {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response.data.data);
      localStorage.setItem("usergroup", JSON.stringify(response.data.data));
      let groupdiv = document.getElementById("mygroups");
      let content = "";
      let msgcontent = "";
      for (let i = 0; i < response.data.data.length; i++) {
        let grpname = response.data.data[i].group.name;
        let grpid = response.data.data[i].group.id;
        content += `<div class="grpdetail"><span class="grpele">${grpname}</span><button type="submit" onclick="jumpintogroup(${grpid})" class="grpele btn" id="jumpbtn">Jump In</button><div><label>Enter your message:   
        </label><input type="text" id=${grpid}><button onclick="sendmsg(${grpid})" id="sendbtn">Send</button></div></div>`;
      }
      groupdiv.innerHTML = content;
    })
    .catch((err) => console.log(err));
});

function jumpintogroup(grpid) {
  retrivemsg(grpid);
  getmembers(grpid);
}

// // Sending a message

function sendmsg(grpid) {
  // console.log('Hello')
  let groupid = grpid;
  console.log(groupid);
  let message = document.getElementById(grpid).value;
  let obj = {
    message: message,
  };
  const token = localStorage.getItem("token");
  axios
    .post(`http://localhost:3000/sendmsg/${groupid}`, obj, {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);

      if (response.status == 201) {
        alert("Message Sent");
        retrivemsg(groupid);
      } else {
        throw new Error();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// retriving msgs

function retrivemsg(groupid) {
  axios.get(`http://localhost:3000/getmessages/${groupid}`).then((response) => {
    let chathead = document.getElementById("allchats");
    let content = "";
    // console.log(chathead)
    for (let i = 0; i < response.data.data.length; i++) {
      let message = response.data.data[i].message;
      let name = response.data.data[i].user.name;
      content += `<div id="chatdetails"><span class="chats">${name}</span><span class="chats">${message}</span></div>`;
    }
    chathead.innerHTML = content;
  });
}

// calling members of group

function getmembers(groupid) {
  let token = localStorage.getItem("token");
  axios
    .get(`http://localhost:3000/getmembers/${groupid}`, {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);
     
      let userId = JSON.parse(localStorage.getItem("user"));
      let usergroups = JSON.parse(localStorage.getItem("usergroup"));
      let usergroup = null;
      for (let i = 0; i < usergroups.length; i++) {
        if (groupid == usergroups[i].groupId) {
          usergroup = usergroups[i];
          break;
        }
      }

      let parent = document.getElementById("groupmembers");
      let parent2 = document.getElementById("groupmembers2")
      let onemoreparent = document.getElementById("addmems");
      let content = "";
      let onemorecontent = "";
      let anothercontent = '';
      for (let i = 0; i < response.data.data.length; i++) {
        let name = response.data.data[i].user.name;
        let id = response.data.data[i].user.id;
        let isAdmin = response.data.data[i].isadmin;
        if (userId[0].id == id) {
          content += "";
          if (isAdmin) {
            onemorecontent = `<label class="addduser">Add User :</label><input type = "text" id="name" class="addduser">
                                <button onclick="adduser(${groupid})">Add</button>`;
          }
        } else {
          console.log(usergroup.isadmin);
          if (usergroup.isadmin != true) {
            content += `<div class="userdiv"><span class="userele">${name}</span>`;
          } else {
            if (usergroup.isadmin == true) {
              content += `<div class="userdiv"><span class="userele" id="username">${name}</span>
              <button class="userele" onclick="makeadmin(${groupid},${id})">make admin</button>
              <button class="userele" onclick= "removeuser(${groupid},${id})">remove</button></div>`;
              onemorecontent = `<label class="addduser">Add User :</label><input type = "text" id="name" class="addduser">
                                <button onclick="adduser(${groupid})">Add</button>`;
            }
            if (isAdmin == true) {
             
              content = `<div class="userdiv"><span class="userele">${name}</span>
              <button class="userele" onclick="removeadmin(${groupid},${id})">remove admin</button>
             
              <button class="userele" onclick= "removeuser(${groupid},${id})">remove</button></div>`;
              onemorecontent = `<label class="addduser">Add User :</label><input type = "text" id="name" class="addduser">
                                <button onclick="adduser(${groupid})">Add</button>`;
            } 
          }
        }
      }
      onemoreparent.innerHTML = onemorecontent;
      parent.innerHTML = content;
      parent2.innerHTML = anothercontent
    })
    .catch((err) => console.log(err));
}



// add user

function adduser(groupid) {
  let gid = groupid;
  let name = document.getElementById("name").value;

  let obj = {
    name: name,
  };
  axios
    .post(`http://localhost:3000/adduser/${gid}`, obj)
    .then((response) => {
      if (response.status == 201) {
        console.log(response);
        alert("User Added");
        console.log(response);
      } else {
        throw new Error();
      }
    })
    .catch((err) => alert("User Does not exist"));
}

// remove user

function removeuser(groupid, userid) {
  axios
    .post(`http://localhost:3000/removeuser/${groupid}`, { userid: userid })
    .then((response) => {
      if (response.status == 200) {
        console.log(response);
        alert("User Removed");
      } else {
        throw new Error();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// make admin

function makeadmin(groupid, userid) {
  axios
    .post(`http://localhost:3000/makeadmin/${groupid}`, { userid: userid })
    .then((response) => {
      alert("Successful");
    })
    .catch((err) => {
      console.log(err);
    });
}

// remove admin

function removeadmin(groupid, userid) {
  axios
    .post(`http://localhost:3000/removeadmin/${groupid}`, { userid: userid })
    .then((response) => {
      if (response.status == 200) {
        alert("Successful");
      } else {
        throw new Error();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
