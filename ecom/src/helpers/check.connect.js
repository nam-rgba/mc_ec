const mongoose = require('mongoose');
const _SECOND = 5000;
const os = require('os');
const process = require('process');

// count the number of connections
const countConnect = ()=>{
    const numConnections = mongoose.connections.length;
    console.log(`Number of connections: ${numConnections}`);
}

// checking overload
const checkOverload = ()=>{
    setInterval(()=>{
        const numConnections = mongoose.connections.length;
        const numCpus = os.cpus().length;

        const maxConnections = numCpus * 2;
        if(numConnections > maxConnections){
            console.log(`Number of connections: ${numConnections}`);
            console.log(`Number of CPUs: ${numCpus}`);
            console.log(`Number of connections is more than twice the number of CPUs`);
        }
    }, _SECOND);
}

module.exports = { countConnect, checkOverload };