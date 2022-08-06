
class NewReceipt extends React.Component{
    constructor(props){
        super(props);

        //binding method
        this.addEvent = this.addEvent.bind(this);
    }

    async addEvent(){
        const name = document.getElementById('name_input').value;
        const tip = document.getElementById('tip_input').value;


        const result = await fetch('/addEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                date: Date.now,
                friends: ["dbellero12345"],
                itemsList: [{name: "fish", price: 20}, {name: "crab", price: 10}],
                tip,
                tax: 20,
                total: 50,
                action: "NEW",
                token: localStorage.getItem('token')
            })
        }).then((res) => res.json());

        console.log(result);

        window.open("/home","_self");

    }

    componentDidMount() {
        
    }

    render(){
        return(
            <div>
                <h1>New Receipt</h1>
                {/* <div id="newReceiptButtonGrid">
                    <input type="file" name="receipt"></input>
                    <button class="receiptStyleButton">Add Friend</button>
                    <button class="receiptStyleButton">Add Tip</button>
                    <button class="receiptStyleButton">Done</button>
                </div> */}

                {/* <form id="newReceiptButtonGrid" action="/upload" method="POST" encType="multipart/form-data"> */}
                <div id="newReceiptButtonGrid">
                    <input type="file" name="receipt"></input>
                    <button className="receiptStyleButton">Add Friend</button>
                    <label className="receiptStyleButton">Name: </label>
                    <input className="receiptStyleButton" type="text" id="name_input"></input>
                    <label className="receiptStyleButton">Tip: </label>
                    <input className="receiptStyleButton" type="text" id="tip_input"></input>
                    <button onClick={() => this.addEvent()} className="receiptStyleButton" type="submit">Done</button>
                </div>
                {/* </form> */}
                <div id="friendList">
                    
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <NewReceipt />,
    document.getElementById('newReceipt')
);