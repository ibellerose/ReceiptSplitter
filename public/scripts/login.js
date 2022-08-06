

class Login extends React.Component{
    constructor(props){
        super(props);

        this.state = {};

        //binding method
        this.loginUser = this.loginUser.bind(this);
    }

    
    async loginUser(){

        const username = document.getElementById('username_input').value;
        const password = document.getElementById('password_input').value;

        const result = await fetch('/logUserIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        }).then((res) => res.json());
        if(result.status === 'ok'){
            console.log(result);
            localStorage.setItem('token', result.data);
        } else {
            alert(result.error)
        }

        window.open("/home","_self");

    }

    render(){
        return(
            <div id="outline">
                <div class="line">
                    <label id="username_label">Username</label>
                    <input type="text" id="username_input"></input>
                </div>
                <div class="line">
                    <label id="password_label">Password</label>
                    <input type="password" id="password_input"></input>
                </div>
                <button onClick={() => this.loginUser()}>Login</button>
                {/* <a href="/home">Login</a> */}
                <div id="switch">Don't have an account? <a href="/signup">Sign Up</a></div>
            </div>
        )
    }
}

ReactDOM.render(
    <Login />,
    document.getElementById('login')
);