import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();
const s3 = new AWS.S3();

console.log(process.env.AWS_ACCESS_KEY_ID);
const getParams = {
  Bucket: 'truepoint', // your bucket name,
  Key: 'highlight_json/134859149/2020-09-13/39667416302/39667416302' // path to the object you're looking for
};

s3.getObject(getParams, (err, data) => {
  if (err) {
    console.log(err, err.stack);
  } else {
    const objectData = data.Body.toString('utf-8'); // Use the encoding necessary
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
