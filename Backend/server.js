import dns from 'dns'
dns.setDefaultResultOrder('ipv4first');   // fixes IPv6 issue
dns.setServers(['8.8.8.8','1.1.1.1']); 



import dotenv from 'dotenv'
import app from './src/app.js'
import connectToDB from './src/config/db.js'

dotenv.config()

const PORT = process.env.PORT || 3000 ;

const startServer = async () => {

    try {
        
        await connectToDB() ;
        
        app.listen(PORT , ()=>{
            console.log(`Server listening on port ${PORT}`)
        })

    } catch (error) {
        
        console.log("Failed to start server : " , error.message) ;
        process.exit(1)

    }

}

startServer()
