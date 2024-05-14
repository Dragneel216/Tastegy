const firebaseConfig = {
    apiKey: "AIzaSyCjAgEWBrRJyEGvTXI2WgqT7okBJPWvRjk",
    authDomain: "tastegy.firebaseapp.com",
    databaseURL: "https://tastegy-default-rtdb.firebaseio.com",
    projectId: "tastegy",
    storageBucket: "tastegy.appspot.com",
    messagingSenderId: "959823785585",
    appId: "1:959823785585:web:9d0b627f937e919d5975d0",
    measurementId: "G-H4PN7WQ0HL"
  };

//initialize firebase
firebase.initializeApp(firebaseConfig);

//reference db
var regFormDB = firebase.database().ref('Form');

document.getElementById("regForm").addEventListener("submit",submitForm);

async function submitForm(e){
    e.preventDefault();

    var exist = 0;

    var name = getElementVal('regName');
    var mail = getElementVal('regMail');
    var pwd = getElementVal('regPwd');
    var newpwd = getElementVal('conPwd');

    // Query the database to check if the provided username exists
    var emailQuery = regFormDB.orderByChild('mail').equalTo(mail).once('value');
    var nameQuery = regFormDB.orderByChild('name').equalTo(name).once('value');

    try{
        const results = await Promise.all([emailQuery, nameQuery])
            var emailSnapshot = results[0];
            var nameSnapshot = results[1];

            if (emailSnapshot.exists() || nameSnapshot.exists()) {
                exist = 1;
                alert("Username/Email already exists!")
            }

        if(exist == 0){
            if(pwd!=newpwd){
                alert("Passwords don't Match!")
            }
            else{
                saveMsgs(name,mail,pwd);

                //alert
                alert("Account Creation Successful!");

                showhide();
                //reset form
                document.getElementById("regForm").reset();
            }
    }    }
    catch(error){
        alert("ERROR!!");
        console.error(error);
    }

    console.log(name,mail,pwd,newpwd);
}

//login=============================================================================================================================
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Query the database to check if the provided username exists
    var emailQuery = regFormDB.orderByChild('mail').equalTo(username).once('value');
    var nameQuery = regFormDB.orderByChild('name').equalTo(username).once('value');

    Promise.all([emailQuery, nameQuery])
      .then(function(results) {
        var emailSnapshot = results[0];
        var nameSnapshot = results[1];
        if (emailSnapshot.exists() || nameSnapshot.exists()) {
          emailSnapshot.forEach(function(childSnapshot) {
            var userData = childSnapshot.val();
            // Compare the password
            if (userData.pwd === password) {
              // Password matches, user is authenticated
              // Redirect the user to another website
              window.location.href = "recipeSearchPage.html"; // Change the URL to your desired website
            } else {
              // Password doesn't match
              alert("Incorrect password!");
            }
          });
          nameSnapshot.forEach(function(childSnapshot) {
            var userData = childSnapshot.val();
            // Compare the password
            if (userData.pwd === password) {
              // Password matches, user is authenticated
              // Redirect the user to another website
                document.getElementById("loginForm").reset();
                window.location.href = "recipeSearchPage.html"; // Change the URL to your desired website
            } else {
              // Password doesn't match
              alert("Incorrect password!");
            }
          });
        } else {
          // Username doesn't exist
          alert("User not found!");
        }
      })
      .catch(function(error) {
        console.error("Error querying database: ", error);
      });
});
//==========================================================================================================================
/*var database = firebase.database();
    
var ref = database.ref();
ref.on('value', gotData, errData);

function gotData(data) {
    var seeds = data.val();
    console.log(seeds);
}

function errData(err) {
    console.log('Error!');
}

document.getElementById("loginForm").addEventListener("submit",submitForm);

function checkForm(e){
    e.preventDefault();

    var name = getElementVal('username');
    var pwd = getElementVal('password');
    
}
*/


const getElementVal = (id) =>{
  return document.getElementById(id).value;
}

const saveMsgs = (name, mail, pwd)=>{
    var newRegForm = regFormDB.push();

    newRegForm.set({
        name: name,
        mail: mail,
        pwd: pwd
    });
}



setTimeout(() => {
    const box = document.getElementById('loading');
    loading.style.display = 'none';
    //new.style.display = 'none';
}, 1000);
//document.getElementById("button").addEventListener("click", redirect);
function showhide(){
    var x = document.getElementById('old');
    var y = document.getElementById('new');
    var dispx = window.getComputedStyle(x).display;
    var dispy = window.getComputedStyle(y).display;
    if(x.style.display == 'block'){
        x.style.display = 'none';           //why me gay
        y.style.display = 'block';          //very gay
    }
    else{
        y.style.display = 'none';
        x.style.display = 'block';
    }
}
function show(main_area) {
    document.getElementById('mainmain').innerHTML = document.getElementById(main_area).innerHTML;
}

validity=document.getElementById("regPwd");

validity.addEventListener("focus",function(){
  document.getElementById("strength").style.display="block";
  document.getElementById("new").style.height="680px";
  calculateStrength();
});

validity.addEventListener("blur",function(){
  document.getElementById("strength").style.display="none";
  document.getElementById("new").style.height="620px";
});

validity.addEventListener("input", calculateStrength)

function calculateStrength(){
  let value = validity.value;
  let point=0;

  let arrayTest = [/\d/, /[a-z]/, /[A-Z]/, /[!@#$%^&*_=+-]/]; 
  arrayTest.forEach((item) => { 
    if (item.test(value)) { 
      point += 1; 
    } 
    });  
  if (point<=1 || value.length<6){
    document.getElementById("weak").style.display="inline-block";
    document.getElementById("mid").style.display="none";
    document.getElementById("stronk").style.display="none";
  }
  else if (point==2 || point==3){
    document.getElementById("weak").style.display="none";
    document.getElementById("mid").style.display="inline-block";
    document.getElementById("stronk").style.display="none";
  }
  else if (point==4 ){
    document.getElementById("weak").style.display="none";
    document.getElementById("mid").style.display="none";
    document.getElementById("stronk").style.display="inline-block";
  }
}

document.addEventListener("DOMContentLoaded", function() {
  
  match=document.getElementById("conPwd");

  match.addEventListener("focus",function(){
    if(document.getElementById("conPwd").value.length>0 && document.getElementById("conPwd").value!=document.getElementById("regPwd").value){
      document.getElementById("passMatch").style.display="block";
      document.getElementById("new").style.height="680px";
    }
  });

  match.addEventListener("blur",function(){
    document.getElementById("passMatch").style.display="none";
    document.getElementById("new").style.height="620px";
  });
  
  match.addEventListener("input", function() {
    if (match.value !== regPwd.value) {
      passMatch.style.display = "block";
      document.getElementById("new").style.height="680px";
    } 
    else {
      passMatch.style.display = "none";
      document.getElementById("new").style.height="620px";
    }
  });
});

$(".toggle-password").click(function() {

  $(this).toggleClass("fa-eye fa-eye-slash");
  var input = $($(this).attr("toggle"));
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
});