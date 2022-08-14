

class ItemizedReceipt extends React.Component{
    constructor(props){
        super(props);

        this.state = {eventId: '', event: [], yourOverallTotal: 0,
                    yourTax: 0, yourTip: 0, yourItems: 0, yourItemTotal: 0,
                    itemsCheckBoxJSX: [],
                    itemsNameJSX: [],
                    itemsPriceJSX: [],
                    checkBoxValues: []
    };

        //binding method
        this.eventInfo = this.eventInfo.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
    }

    handleCheck(cbNum) {

        this.state.checkBoxValues[cbNum] = !this.state.checkBoxValues[cbNum];

        if(this.state.checkBoxValues[cbNum]){
            this.setState({yourItemTotal: this.state.yourItemTotal + this.state.event.itemsList[cbNum].price,
                        yourItems: this.state.yourItems + 1}, () =>{
                            let thisTip = 0;
                            let thisTax = 0;
                    
                            thisTip = (this.state.yourItemTotal / (this.state.event.total - this.state.event.tax)) * this.state.event.tip;
                            thisTax = (this.state.yourItemTotal / (this.state.event.total - this.state.event.tax)) * this.state.event.tax;
                    
                            this.setState({yourTip: parseFloat(thisTip.toFixed(2)),
                                    yourTax: parseFloat(thisTax.toFixed(2))}, () => {
                                        this.setState({yourOverallTotal: parseFloat((this.state.yourItemTotal + this.state.yourTip + this.state.yourTax).toFixed(2))});
                                    });
                        });
        }else {
            this.setState({yourItemTotal: this.state.yourItemTotal - this.state.event.itemsList[cbNum].price,
                        yourItems: this.state.yourItems - 1}, () =>{
                            let thisTip = 0;
                            let thisTax = 0;
                    
                            thisTip = (this.state.yourItemTotal / (this.state.event.total - this.state.event.tax)) * this.state.event.tip;
                            thisTax = (this.state.yourItemTotal / (this.state.event.total - this.state.event.tax)) * this.state.event.tax;
                    
                            this.setState({yourTip: parseFloat(thisTip.toFixed(2)),
                                        yourTax: parseFloat(thisTax.toFixed(2))}, () => {
                                            this.setState({yourOverallTotal: parseFloat((this.state.yourItemTotal + this.state.yourTip + this.state.yourTax).toFixed(2))});
                                        });
                        });
        }

        // this.state.yourOverallTotal = this.state.yourItemTotal + this.state.yourTip + this.state.yourTax;
        // this.setState({yourOverallTotal: (this.state.yourItemTotal + this.state.yourTip + this.state.yourTax).toFixed(2)});

    }

    async eventInfo(id){
        const result = await fetch('/singleEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: localStorage.getItem('token'),
                eventId: id
            })
        }).then((res) => res.json());

        this.setState({event: result.data});

        //create JSX code from items
        const items = this.state.event.itemsList;

        let createItemsCheckBoxJSX = [];
        let createItemsNameJSX = [];
        let createItemsPriceJSX = [];
        let createCBvalues = [];

        for(let i = 0; i < items.length; i++){
            createItemsCheckBoxJSX.push(
                <div key={"divBox"+i}>
                    <input key={"box"+i} type="checkbox" onChange={() => this.handleCheck(i)}></input>
                </div>
            );
            createItemsNameJSX.push(
                <div key={"name"+i} >{items[i].name}</div>
            );
            createItemsPriceJSX.push(
                <div key={"price"+i}>{items[i].price}</div>
            );
            createCBvalues.push(false);
        }

        this.setState({itemsCheckBoxJSX: createItemsCheckBoxJSX,
                    itemsNameJSX: createItemsNameJSX,
                    itemsPriceJSX: createItemsPriceJSX,
                    checkBoxValues: createCBvalues});

    }

    componentDidMount() {
        const queryParams = new URLSearchParams(window.location.search);
        const id = queryParams.get("q");

        this.setState({eventId: id});
        console.log(this.state.eventId);

        this.eventInfo(id);
    }

    render(){

        return(
            <div>
                <h1>{this.state.event.name}</h1>
                <h2>{this.state.event.date}</h2>
                <div id="items">
                    <div id="checkBox_items">
                        {this.state.itemsCheckBoxJSX}
                    </div>
                    <div id="name_items">
                        {this.state.itemsNameJSX}
                    </div>
                    <div id="price_items">
                        {this.state.itemsPriceJSX}
                    </div>
                </div>
                <div id="single_event_footer">
                    <div id="your_total">
                        Total: {this.state.yourOverallTotal}
                    </div>
                    <div id="tax_tip">
                        Items Cost: {this.state.yourItemTotal}<br></br>
                        Tax: {this.state.yourTax}<br></br>
                        Tip: {this.state.yourTip}<br></br>
                        Items: {this.state.yourItems}
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <ItemizedReceipt />,
    document.getElementById('itemizedReceipt')
);