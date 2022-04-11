import {quoteHandler} from './quoteHandler'

let quoter = new quoteHandler()

async function func() {
  await quoter.init()

  quoter.addQuote('103', 'hannah', 'elefant')
  quoter.addQuote('103', 'hannah', 'elefand')
  quoter.addQuote('103', 'peter', 'affe')

  quoter.deleteQuote('103', 'hannah', 'elefand')
  //  quoter.deleteQuote('103', 'hannah', 'elefant')
}

func()
