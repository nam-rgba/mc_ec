const Redis = require('redis')

class PubSubService{
    constructor(){
        this.subscrib = Redis.createClient()
        this.publish = Redis.createClient()
    }

    // publish = async (channel, message) =>{
    //     await this.publish
    // }

    publish(channel, message){
        return new Promise((reject, resolve)=>{
            this.publish(channel, message, (err, reply)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(reply)
                }
            });
            
        })
    }
}