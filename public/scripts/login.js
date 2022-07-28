

class Login extends React.Component{
    constructor(props){
        super(props);

        this.state = {};
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
                    <input type="text" id="password_input"></input>
                </div>
                <button>Login</button>
                <div id="switch">Don't have an account? <a href="/signup">Sign Up</a></div>
            </form>
        )
    }
}

ReactDOM.render(
    <Login />,
    document.getElementById('login')
);