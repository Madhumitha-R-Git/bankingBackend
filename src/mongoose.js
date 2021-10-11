var mongoose = require('mongoose');
const { PassThrough } = require('stream');
mongoose.connect("mongodb+srv://Madhumitha:madhu@cluster0.0knrm.mongodb.net/Demo?retryWrites=true&w=majority");
 var t = mongoose.connection
t.on(('open'),()=>
{
   console.log("Hi makale")
})

 //console.log("Hi makale")
const schema = new mongoose.Schema(
   {
      name:
      {
         type : String

      },
      mail:
      {
         type : String

      },
      phone:
      {
          type : String
      },
      pass:
      {
          type: String
      },
      pin:
      {
         type: String
      },
      date:
      {
          type:Date,
          default:Date.now()
      },
      balance:
      {
          type: String,
          default:"1000"
      },
   }
)
module.exports = mongoose.model('Bank_reg_details',schema)

