"use strict";
exports.__esModule = true;
var AWS = require("aws-sdk");
var dotenv = require("dotenv");
dotenv.config();
var s3 = new AWS.S3();
s3.config.update({
    accessKeyId: 'AKIAYMQWU4UCTYMO2SMR',
    secretAccessKey: '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',
    region: 'ap-northeast-2'
});
console.log(process.env.AWS_ACCESS_KEY_ID);
var getParams = {
    Bucket: 'truepoint',
    Key: 'highlight_json/134859149/2020-09-13/39667416302/39667416302' // path to the object you're looking for
};
s3.getObject(getParams, function (err, data) {
    if (err) {
        console.log(err, err.stack);
    }
    else {
        var objectData = data.Body.toString('utf-8'); // Use the encoding necessary
        console.log(objectData);
    }
    console.log('JOB DONE');
});
// s3.listBuckets((err, data) => {
//   if (err) {
//     console.log('Error', err);
//   } else {
//     console.log('Success', data.Buckets);
//   }
// });
