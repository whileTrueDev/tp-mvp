import logging
import boto3
import json
from botocore.exceptions import ClientError


class S3Connector:
    def __init__(self, bucket_name, stream_id):
        self.s3 = boto3.resource('s3')
        self.bucket_name = bucket_name
        self.stream_id = stream_id

    def upload_json(self, json_to_dump, path):
        s3object = self.s3.Object(
            self.bucket_name,
            path
        )
        s3object.put(
            Body=(bytes(json.dumps(json_to_dump).encode('UTF-8'))),
            ContentType='application/json'
        )

    def upload_srt(self, year, month, day, creator_id, json_to_save, file_name):
        s3object = self.s3.Object(
            self.bucket_name,
            'srt_files/{creator_id}/{year}/{month}/{day}/{stream_id}/{file_name}.srt'.format(
                year=year, month=month, day=day, creator_id=creator_id, stream_id=self.stream_id, file_name=file_name),
        )
        s3object.put(
            Body=json_to_save
        )
