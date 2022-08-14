
class Home extends React.Component{
    constructor(props){
        super(props);

        this.state = {firstname: '', lastname: '', events:[]};

        //binding method
        this.userInfo = this.userInfo.bind(this);
    }

    async userInfo(){

        const result = await fetch('/userHomeInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: localStorage.getItem('token')
            })
        }).then((res) => res.json());
        console.log(localStorage.getItem('token'));

        console.log(result);

        this.setState({firstname: result.data.firstname, lastname: result.data.lastname});

    }

    async userEventInfo(){
        const result = await fetch('/eventInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: localStorage.getItem('token')
            })
        }).then((res) => res.json());

        console.log(result);

        var rows = [];

        for(let i = 0; i < result.data.length; i++){
            rows.push(
                <div onClick={() => this.itemizedReceipt(result.data[i].id)} key={i} className="single_event">
                    <div>{result.data[i].name}</div>
                    <div>{result.data[i].date}</div>
                    <div className="event_action">{result.data[i].action}</div>
                </div>
            );
        }

        this.setState({events : rows});

    }

    itemizedReceipt (eventId){
        window.open("/itemizedReceipt?q=" + eventId,"_self");
    }

    async logoutUser (){
        localStorage.removeItem('token');
        window.open("/login","_self");
    }

    newReceiptPage (){
        window.open("/newReceipt","_self");
    }

    addFriendsPage (){
        window.open("/addFriend","_self");
    }

    componentDidMount() {
        this.userInfo();
        this.userEventInfo();
    }

    render(){

        return(
            <div>
                <div id="profile_header">
                    {this.state.firstname} {this.state.lastname}
                    <button onClick={() => this.logoutUser()} id="logout_button">logout</button>
                </div>
                <div id="event_group">
                    {this.state.events}
                </div>
                <nav id="options_footer">
                    <button onClick={() => this.newReceiptPage()} className="add_buttons">Add New Receipt</button>
                    <button onClick={() => this.addFriendsPage()} className="add_buttons">Add Friend</button>
                </nav>
            </div>
        )
    }
}

ReactDOM.render(
    <Home />,
    document.getElementById('home')
);