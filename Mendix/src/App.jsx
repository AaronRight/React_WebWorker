import React from 'react';
import RangeInput from './components/RangeInput';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      sizeOfArray: 0,
      extraTime: -1,
      messages: [],
      alreadyStarted: false
    };
    this.setSizeOfArray = this.setSizeOfArray.bind(this);
    this.setExtraTime = this.setExtraTime.bind(this);
    this.addMessage = this.addMessage.bind(this);
  }

  setSizeOfArray(event){
    this.setState({ sizeOfArray: event.target.value })
  }

  addMessage(event){
    this.setState(prev => ({messages: [...prev.messages, event.data]}))
  }
  
  setExtraTime(event){
    this.setState({ extraTime: event.target.value })
  }

  componentDidMount = () => {
    this.worker = new Worker('webWorker.js')
    
    this.worker.onmessage = e => {
      this.addMessage(e)

      if(e.data.includes('end')){
        this.setState({alreadyStarted: false})
        if(this.timer) clearInterval(this.timer);
      }
    }
  };

  randomNumber(){
    return Math.floor(Math.random() * 100000)
  }

  process(){
    let arr = Array.from({length: this.state.sizeOfArray}, this.randomNumber);
    this.worker.postMessage(arr)

    if(this.state.extraTime > 0)
      this.timer = setInterval(() => {
        this.worker.postMessage(this.randomNumber())
      }, this.state.extraTime);

    this.setState({alreadyStarted: true})
  }

  render() {
    return (
      <div>
        <div className="panel">
          <div className="column">
            <div className="row">
              <div className="cell">Size of Array</div>
              <RangeInput onChange={this.setSizeOfArray} className="cell" min={0} max={100000} />
            </div>
            <div className="row">
              <div className="cell">Generate and insert extra random value, ms</div>
              <RangeInput onChange={this.setExtraTime} className="cell" min={-1} max={5000} />
            </div>
          </div>
          <button onClick={() => this.process()} disabled={this.state.alreadyStarted}> Process </button>
        </div>
        {
          this.state.messages.map(m => <div key={m}> {m} </div>)
        }
      </div>
    );
  }
}

export default App;
