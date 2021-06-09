require('dotenv').config();

const useQuery = require('./model/useQuery');


const twitchCreatorList = new Promise((resolve, reject) => {
  const listQuery = `
  select streamId, creatorid
  from Streams
  where platform = 'afreeca' 
  AND endDate > DATE_SUB(NOW(), INTERVAL 3 MONTH);
  `;
  useQuery('tp', listQuery, [])
    .then((row) => {
      resolve(row.result.map((x) => x.streamId));
    });
});

const maxViewerList = (creatorString) => new Promise((resolve, reject)=> {
  const query = `
  select broadId, MAX(CAST(REPLACE(viewCount,',','') AS UNSIGNED)) as viewer
  from AfreecaBroadDetail abd 
  where createdAt > DATE_SUB(NOW(), INTERVAL 4 MONTH) 
  AND broadId IN ${creatorString}
  GROUP BY broadId
`;
  useQuery('tp', query, [])
    .then((row) => {
      resolve(row.result.map((x) => x.streamId));
    });
})


twitchCreatorList
  .then((result)=>{
    let creatorListString = result.reduce((arr, x) => arr + `'${x}',`, '(');
    creatorListString  = creatorListString.substring(0, creatorListString.length-1) + ')';
    return creatorListString;
  })

