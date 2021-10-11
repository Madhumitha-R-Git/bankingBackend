var mongoose = require('mongoose');
const { PassThrough } = require('stream');
mongoose.connect("mongodb+srv://Madhumitha:madhu@cluster0.0knrm.mongodb.net/Demo?retryWrites=true&w=majority");
 var t = mongoose.connection
t.on(('open'),()=>
{
   console.log("Hi makale(2)")
})
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
      balance:
      {
          type: String,
          default:"1000"
      },
      activity:
      {
          type:[{
          }]

      }

   }
)
module.exports = mongoose.model('activity_details',schema)

