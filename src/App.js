import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import { Container, Header, Segment, Dimmer, Loader, Image } from 'semantic-ui-react'
import TransactionLink from './TransactionLink'

var web3 = new Web3('https://ropsten.infura.io/TOKEN');
class App extends Component {
  constructor() {
    super()
    this.getInitialBlockNumber()
    this.state = {
      blockData: [],
      valueTransactions: {}
    }
    this.renderBlock = this.renderBlock.bind(this)
    this.renderBlocks = this.renderBlocks.bind(this)
    this.renderTransactionLink = this.renderTransactionLink.bind(this)
  }

  getInitialBlockNumber() {
    web3.eth.getBlockNumber((error, result) => {
      if (error) {
        console.log('error', error)
      }
      this.setState({block: result})
      this.getNewBlocks(result)
    })
  }

  getNewBlocks(blockNumber) {
    let blockData = []
    let data_counter = 0
    for (let i=0; i < 10; i++) {
      web3.eth.getBlock(blockNumber - i)
      .then(result => {
        blockData[i] = result
        data_counter++
        const allBlocksFound = data_counter === 10
        if (allBlocksFound) {
          this.setState({blockData}, this.filterValueTransactions)
        }
      })
      .catch(err => console.log('error', err))
    }
  }

  filterValueTransactions() {
    const blocks = this.state.blockData
    let valueTransactions = {}
    let tx_counter = 0
    const total_txs = blocks.reduce((total, block) => total + block.transactions.length, 0)
    blocks.forEach((block) => {
      block.transactions.forEach(transaction => {
        web3.eth.getTransaction(transaction)
        .then(txData => {
          tx_counter++
          if (txData.value != '0') {
            valueTransactions[transaction] = txData
          }
          const filteringComplete = total_txs === tx_counter
          if (filteringComplete) {
            this.setState({valueTransactions})
          }
        })
      })
    })
  }

  renderBlocks() {
    if(this.state.blockData.length > 0) {
      return this.state.blockData.map(this.renderBlock)
    } else {
      this.renderSpinner()
    }
  }

  renderSpinner() {
    return  <Segment>
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
      <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
    </Segment>
  }

  renderBlock(block, index){
    const valueTransactions = this.state.valueTransactions
    const valueTransactionsLength = Object.keys(valueTransactions).length
    let blockContent = valueTransactionsLength > 0 ? block.transactions.filter(transaction => transaction in valueTransactions).map(this.renderTransactionLink) : this.renderSpinner()
    return <Container key={index} text>
      <Segment padded>
        <Header as='h2'>Block #{block.number}</Header>
        <Container>
          Transactions
          <br/>
          {blockContent}
          <br/>
        </Container>
      </Segment>
      <br/>
    </Container>
  }

  renderTransactionLink(hash, index){
    return <TransactionLink key={index} hash={hash} data={this.state.valueTransactions[hash]}/>
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Jeff's Block List</h1>
        </header>
        <p className="App-intro">
          Ethereum's Lastest 10 Blocks
        </p>
        {this.renderBlocks()}
      </div>
    );
  }
}

export default App;
