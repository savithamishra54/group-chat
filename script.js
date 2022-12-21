// signup

function signup(event){
    event.preventDefault()
    let name = document.getElementById('name').value
    let email = document.getElementById('email').value
    let number = document.getElementById('number').value
    let password = document.getElementById('password').value

    let obj = {
        name:name,
        email:email,
        number:number,
        password:password
    }
    axios.post('http://localhost:3000/signup',obj)
    .then(result=>{
        if (result.status == 201) {
            alert("Successfully Signed up")
        }else {
            throw new Error("Failed to Signup");
        }
    })
    .catch(err=>{
        console.log(err);
    })
}

// login
function login(event){
    event.preventDefault()
    let email = document.getElementById('logemail').value
    let password = document.getElementById('logpassword').value

    let details = {
        email:email,
        password:password
    }
    localStorage.setItem('details',JSON.stringify(details))
}