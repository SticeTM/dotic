import {quoteHandler} from './quoteHandler'

let quoter = new quoteHandler()

async function func() {
  await quoter.init()

  await quoter.addQuote('103', 'hannah', 'elefant')
  await quoter.deleteQuote('103', 'hannah', 'elefant')

  console.log("ended")
}

func()
