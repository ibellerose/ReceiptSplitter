
class AddFriend extends React.Component{
    constructor(props){
        super(props);

        this.state = {usernameDropDownJSX: []};

        //binding method
        this.handleSearch = this.handleSearch.bind(this);
        this.handleAddingFriend = this.handleAddingFriend.bind(this);
    }

    async handleAddingFriend(newFriend) {
        const result = await fetch('/addToFriendList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: localStorage.getItem('token'),
                name: newFriend
            })
        }).then((res) => res.json());

        window.open("/home","_self");
    }

    handleSearch = async (event) => {

        const result = await fetch('/findFriends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: localStorage.getItem('token'),
                name: event.target.value
            })
        }).then((res) => res.json());

        console.log(result);

        const optionList = result.data;

        let createDropDownJSX = [];

        for(let i = 0; i < optionList.length; i++){
            createDropDownJSX.push(
                <div onClick={() => this.handleAddingFriend(optionList[i])} key={"username" + i} className="dropDownOption">
                    {optionList[i]}
                </div>
            );
        }

        this.setState({usernameDropDownJSX: createDropDownJSX});
    }

    render(){

        return(
            <div id="addFriendPage">
                <input onChange={this.handleSearch} id="search_bar" type="text"></input>
                <div className="dropDown">
                    {this.state.usernameDropDownJSX}
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <AddFriend />,
    document.getElementById('addFriend')
);