

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
        console.log(result);

    }

    render(){
        return(
            <form id="outline">
                <div class="line">
                    <label id="username_label">Username</label>
                    <input type="text" id="username_input"></input>
                </div>
                <div class="line">
                    <label id="password_label">Password</label>
                    <input type="password" id="password_input"></input>
                </div>
                <button onClick={() => this.loginUser()}>Login</button>
                <div id="switch">Don't have an account? <a href="/signup">Sign Up</a></div>
            </form>
        )
    }
}

ReactDOM.render(
    <Login />,
    document.getElementById('login')
);