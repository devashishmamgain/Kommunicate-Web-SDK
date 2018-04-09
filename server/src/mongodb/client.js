var  config = require("../../conf/config.js");
const mongoClient = require("mongodb").MongoClient;
const mongoURL = config.getProperties().mongoDbUrl;
const logger = require("../utils/logger");

const DEFAULT_SCHEMA ="kommunicate";


/**
 * this method insert a record in mongo db and return a promise.
 * @param {string} collectionName
 * @param {object} document 
 */
exports.insertOne =(collectionName, document)=>{
    //console.log("db",db);
    logger.info("inserting new record in collection", collectionName); 
    return new Promise((resolve,reject)=>{
        mongoClient.connect(mongoURL,(err,client)=>{
            if(err){
                logger.info("error while connecting to db: "+mongoURL,err);
                return reject(err);
            }else{
                var db = client.db(DEFAULT_SCHEMA);
                db.collection(collectionName).insertOne(document,(result)=>{
                    logger.info(" record created successfully ");
                    return resolve(result);
                });
            }
    
        });
        
    });
		
}
/**
 * perform a free text search on faq collection.
 * display the result in sorted by matching score. priority is given to the title.
 * @param {Object }options
 * @param {string }options.appId
 * @param {String} options.text
 * @param {String} options.collectionName
 * 
 */
exports.searchFAQ=(options)=>{
    logger.info("searching faq in mongo db");
    return new Promise((resolve,reject)=>{
        mongoClient.connect(mongoURL,(err,client)=>{
            if(err){
                logger.info("error while connecting to db: "+mongoURL,err);
                return reject(err);
            }else{
                var db = client.db(DEFAULT_SCHEMA);
                db.collection(options.collectionName).aggregate([{$match:{$text: { $search: options.text },applicationId:options.appId,status:"published",type:"faq"}},
                    { $sort: { score: { $meta: "textScore" } } },
                    {$project:{name:1,content:1,id:1,_id:0}}
                ],function(err,result){
                    if (err)return reject(err);
                    logger.info(" got data from db ");
                    return resolve(result?result.toArray():[]);
                });
            }
    
        });
        
    });

}

/**
 * excute the given query on the given collection. if no query is passed it will return all documents in the given collection;
 * @param {object} options
 * @param {string} options.collectionName
 * @param {object} options.query
 * @param {object} options.projection
 * @param {object} options.options
 */
 exports.find= (options)=>{
    logger.info("fetching records from collection "+options.collectionName);

    return new Promise((resolve,reject)=>{
        mongoClient.connect(mongoURL,function(err,client){
            if(err){
                logger.error("error while connecting to mongo db",err);
                return reject(err);
            }else{
                var db = client.db(DEFAULT_SCHEMA);
                var stream = db.collection(options.collectionName).find(options.query,options.projection,options.options).stream();
                var counter =0, result=[];
                stream.on("data", function(item){
                    //console.log("proccessing document..", item);
                        result[counter]=item;
                        counter++;
                });
                stream.on("end", function() {
                    console.log("got data from db");
                    return resolve(result);
                });
            }
        });	

     })
      
    }

    /**
     * this method updates a document selected by selector.
     * @param {object} options
     * @param {string} options.collectionName, selector, update, options
     * @param {Object} options.criteria  criteria to update a object  
     * @param {Object} options.update   values to be updated
     * @param {Object} options.options  options
     */
   exports.updateOne = (options)=>{
        return new Promise((resolve,reject)=>{
            if (!options.collectionName) {
                return reject(new Error("collection name can't be null"));
              } else {
                mongoClient.connect(mongoURL, function(err, client) {
                  if (err) {
                    logger.info("error while connecting to db: " + mongoURL, err);
                    return reject(err);
                  } else {
                    var db = client.db(DEFAULT_SCHEMA);
                    db.collection(options.collectionName).updateOne(options.criteria, { $set: options.update }, options.options,(err,updateResult)=>{
                        return err? reject(err):resolve(updateResult.result);
                    });
                  }
                });
              }

        });
       
    }
      /**
     * this method updates a document selected by selector.
     * @param {object} options
     * @param {string} options.collectionName, selector, update, options
     * @param {Object} options.criteria  criteria to update a object 
     */ 

    exports.deleteOne=(options)=>{
        return new Promise((resolve,reject)=>{
            if (!options.collectionName) {
                return reject(new Error("collection name can't be null"));
              } else {
                mongoClient.connect(mongoURL, function(err, client) {
                  if (err) {
                    logger.info("error while connecting to db: " + mongoURL, err);
                    return reject(err);
                  } else {
                    var db = client.db(DEFAULT_SCHEMA);
                    db.collection(options.collectionName).deleteOne(options.criteria,(err,deleteResult)=>{
                        return err? reject(err):resolve(deleteResult);
                    });
                  }
                });
              }

        });

    }

  var   test = {
		"TraceId" : "fuvgaeurkvh",
		"Status" : "done",
		"HotelBookingStatus" : "ihfabvl",
		"InvoiceNumber" : "kjcifw;",
		"ConfirmationNo" : "ihcfbwl",
		"BookingRefNo" : "q;orcj",
		"BookingId" : "",
		"IsPriceChanged" : "",
		"IsCancellationPolicyChanged" : ""
	}


    /*updateOne({collectionName:'hotelBooking',criteria:{SessionId:"b9d72a40-e1ac-11e7-ae9c-91126d8be9b7"},update:{"HotelBookResponse":HotelBookResponse}})
    .then(result=>{
        console.log("success",result);
    }).catch(err=>{
        console.log("error",err);
    })*/


    /*find({collectionName:'hotelBooking'}).then(result=>{

        console.log(result);
    })*/