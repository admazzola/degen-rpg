 
 

    import FileHelper from './file-helper.js'


   
    const envmode = process.env.NODE_ENV

    const ghostConfigFile = FileHelper.readJSONFile('./server/dataghostconfig.json')
    const ghostConfig = ghostConfigFile[envmode]
  
    const serverConfigFile = FileHelper.readJSONFile('./server/serverconfig.json')
    const serverConfig = serverConfigFile[envmode]



    export default class ServerHelper  {
     
        static getServerConfig(){   
            return serverConfig
        }
        
        static getDataghostConfig(){   
            return ghostConfig
        }

    }