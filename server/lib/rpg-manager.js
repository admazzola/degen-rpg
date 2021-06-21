 
    import Web3Helper from './web3-helper.js'
 
    import FileHelper from './file-helper.js'

    import ServerHelper from './server-helper.js'
    import APIHelper from './api-helper.js'

    import web3utils from 'web3-utils'
 
    
   const MAX_APP_COUNT = 25 
 
    export default class RPGManager  {
    
        constructor( mongoInterface, wolfpackInterface  ){
            this.mongoInterface = mongoInterface
            this.wolfpackInterface = wolfpackInterface
           
            this.init ()
        }

        init(){
            setInterval(this.spawnHeroes.bind(this),10*1000)

        }

        async spawnHeroes(){

            let allTokens = [] 

            const serverConfig = ServerHelper.getServerConfig()

            let nfTokens = await APIHelper.findAllERC721ByToken(serverConfig.heroesNFTContract, this.wolfpackInterface )  
           

            for(let record of nfTokens){
                for(let tokenId of record.tokenIds){
                    allTokens.push({accountAddress: record.accountAddress, contractAddress: record.contractAddress, tokenId: tokenId })
                }
            }

            //load all heroes 

            const allHeroes = await  RPGManager.findAllHeroes(this.mongoInterface)

            console.log('allHeroes',allHeroes)

            let allHeroTokenIds = allHeroes.map( x => x.tokenId )
            //if a hero doesnt exist but an nfToken does, spawn the hero . 
            

            console.log('nfTokens',allTokens)

            for(let t of allTokens){

                if( t.tokenId &&  !allHeroTokenIds.includes(t.tokenId)  ){
                    await RPGManager.spawnNewHero( t, this.mongoInterface )
                    console.log('spawned new hero ', t )
                }

            }


        }

        static async findAllHeroes( mongoInterface ){
            return await mongoInterface.findAll('hero', {} )
        }

        static async spawnNewHero(heroData, mongoInterface ){
            return await mongoInterface.insertOne('hero', { 
                ownerAddress: heroData.accountAddress, 
                contractAddress: heroData.contractAddress,
                tokenId: heroData.tokenId
            
            } )
        }
  
        
    }