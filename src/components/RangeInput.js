import PropTypes from 'prop-types';
import React from 'react';

class RangeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.min };
    this.onInput = this.onInput.bind(this);
    this.onManualInput = this.onManualInput.bind(this);
  }

  onInput(event) {
    this.setState({ value: event.target.value })
  }

  onManualInput(event) {
    let regExp = /-{0,1}[0-9]+/
    let candidate = event.target.value.match(regExp)
    if(candidate){
      let newValue = Number(candidate[0])
      if (newValue < this.props.min) newValue = this.props.min;
      if (newValue > this.props.max) newValue = this.props.max;
      this.setState({ value: newValue })
    }
    else this.setState({ value: this.props.min })
  }

  render() {
    return (
      <table className={'range-input ' + this.props.className}>
        <tbody>
          <tr>
            <td> <span>{this.props.min}</span> </td>
            <td> <input type="text" value={this.state.value} onInput={this.onManualInput} onChange={this.props.onChange} /></td>
            <td> <span>{this.props.max}</span> </td>
          </tr>
          <tr>
            <td colSpan="3">
              <input onInput={this.onInput} value={this.state.value} onChange={this.props.onChange} type="range" min={this.props.min} max={this.props.max} />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

RangeInput.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  onChange: PropTypes.func,
};

export default RangeInput;
