import React, { Component } from 'react';
import { Button, Segment } from 'semantic-ui-react'
import Web3 from 'web3'
var web3 = new Web3(Web3.givenProvider);

class TransactionLink extends Component {
  constructor(props) {
    super(props)
    this.state = { clicked: false }
  }
  handleClick() {
    this.setState({clicked: !this.state.clicked})
  }
  render() {
    const { hash, data } = this.props
    const { value, gasPrice, gas, to, from } = data
    if (this.state.clicked === false) {
      return (
        <Segment>
          <a style={{paddingRight: '10px'}}>{hash}</a>
          <Button primary onClick={() => this.handleClick()}>
            View
          </Button>
        </Segment>
      );
    } else {
      return <Segment>
        <div>Hash: <a>{hash}</a></div>
        <div>Value Transfered: {web3.utils.fromWei(value, 'ether')} Ether</div>
        <div>Gas: {gas}</div>
        <div>Gas Price: {gasPrice}</div>
        <div>To: {to}</div>
        <div>From: {from}</div>
        <br/>
        <Button primary onClick={() => this.handleClick()}>
            View
        </Button>
      </Segment>
    }
  }
}

export default TransactionLink;
