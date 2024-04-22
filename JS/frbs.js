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

function submitForm(e){
    e.preventDefault();

    var name = getElementVal('regName');
    var mail = getElementVal('regMail');
    var pwd = getElementVal('regPwd');
    var newpwd = getElementVal('conPwd');

    saveMsgs(name,mail,pwd);

    //alert
    document.querySelector('.alert').style.visibility='visible';
    setTimeout(()=>{
        document.querySelector('.alert').style.visibility='hidden';
    }, 3000);

    //rset form
    document.getElementById("regForm").reset();

    console.log(name,mail,pwd,newpwd);
}

document.getElementById("loginForm").addEventListener("submit",submitForm);

function checkForm(e){
    e.preventDefault();

    var name = getElementVal('regName');
    var pwd = getElementVal('regPwd');
    
}

const saveMsgs = (name, mail, pwd)=>{
    var newRegForm = regFormDB.push();

    newRegForm.set({
        name: name,
        mail: mail,
        pwd: pwd
    });
}

const getElementVal = (id) =>{
    return document.getElementById(id).value;
}