var things = require('./quoteHandler.ts')

things.addQuote('103','andreas','hallo ich bin ein baum')

var tmp = things.getAuthorQuotes('102','jonas')
console.log(tmp)
