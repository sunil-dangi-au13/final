const mongoose = require('mongoose')

const connectDB = async() =>{
    try{
        const conn = await mongoose.connect('mongodb+srv://dipaligojre:Uninor9890@cluster0.f8xea.mongodb.net/storybooks?retryWrites=true&w=majority', {
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false
            
        })
        console.log('mongoDB connected')
    }
    catch(err){
        console.error(err)
        process.exit(1)
    }

}

module.exports = connectDB