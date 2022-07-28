

class Signup extends React.Component{
    constructor(props){
        super(props);

        this.state = {};

        //binding method
        this.registerUser = this.registerUser.bind(this);
    }

    // registerUser(() => {
    //     aysnc function sendData() {
            
    //     }
    // });

    async registerUser(){

        const username = document.getElementById('username_input').value;
        const password = document.getElementById('password_input').value;
        const email = document.getElementById('email_input').value;
        const firstname = document.getElementById('firstName_input').value;
        const lastname = document.getElementById('lastName_input').value;

        const result = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                email,
                firstname,
                lastname
            })
        }).then((res) => res.json());
        console.log(result);

    }

    render(){
        return(
            <form id="outline">
                <div class="line">
                    <label id="firstName_label">First Name</label>
                    <input type="text" id="firstName_input"></input>
                </div>
                <div class="line">
                    <label id="lastName_label">Last Name</label>
                    <input type="text" id="lastName_input"></input>
                </div>
                <div class="line">
                    <label id="email_label">Email</label>
                    <input type="email" id="email_input"></input>
                </div>
                <div class="line">
                    <label id="username_label">Username</label>
                    <input type="text" id="username_input"></input>
                </div>
                <div class="line">
                    <label id="password_label">Password</label>
                    <input type="password" id="password_input"></input>
                </div>
                {/* <div class="line">
                    <label id="rePassword_label">Retype Password</label>
                    <input type="text" id="rePassword_label"></input>
                </div> */}
                <button onClick={() => this.registerUser()} >Register</button>
                {/* <button type="submit">Register</button> */}
                <div id="switch">Already have an account? <a href="/login">login</a></div>
            </form>

            
        )
        
    }
}

ReactDOM.render(
    <Signup />,
    document.getElementById('signup')
);