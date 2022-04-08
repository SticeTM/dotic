import {quoteHandler} from './quoteHandler.ts'


let quoter = new quoteHandler()
quoter.addQuote('103','andreas','hallo ich bin ein baum')

var tmp = quoter.getAuthorQuotes('102','christian')
console.log(tmp)
