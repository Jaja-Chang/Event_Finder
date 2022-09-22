require('dotenv').config();
const AWS = require('aws-sdk');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    (async () => {
        try {
            const bucketLen = (await s3.listObjects({ Bucket: bucketName }).promise()).Contents.length;
            let count = "";
            if (bucketLen === 0) {
                const objectParams = {Bucket: bucketName, Key: s3Key, Body: '0'};
                await s3.putObject(objectParams).promise();
                count = objectParams.Body;
            } else {
                count = (await s3.getObject({ Bucket: bucketName, Key: s3Key }).promise()).Body;
                count = (parseInt(count) + 1).toString();
                await s3.putObject({ Bucket: bucketName, Key: s3Key, Body: count }).promise();
            }
            res.json({"view_count": count});
            
        } catch (err) {
            console.log(err, err.stack);
        }
    })();
})

const bucketName = "10567186-view-counter-bucket";
const s3 = new AWS.S3({ apiVersion: "2006-03-01", region: "ap-southeast-2" });
const key = 'view-counter';
const s3Key = `10567186-${key}`;

(async () => {
    try {
        await s3.createBucket({ Bucket: bucketName }).promise();
        console.log(`Created bucket: ${bucketName}`);
    } catch (err) {
        if (err.statusCode !== 409) {
            console.log(`Error createing bucket: ${err}`);
        }
    }
})();


module.exports = router;