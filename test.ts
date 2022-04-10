import {quoteHandler} from './quoteHandler'

let quoter = new quoteHandler()

async function func() {
  await quoter.init()

  quoter.addQuote('103', 'hannah', 'elefant')
}

func()
