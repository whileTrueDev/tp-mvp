import logging
import boto3
import json
from botocore.exceptions import ClientError


class S3Connector:

    def __init__(self, bucket_name, stream_id):
        self.s3 = boto3.resource('s3')
        self.bucket_name = bucket_name
        self.stream_id = stream_id

    # def upload_file(self, bucket, object_name=None):
    #     """Upload a file to an S3 bucket

    #     :param file_name: File to upload
    #     :param bucket: Bucket to upload to
    #     :param object_name: S3 object name. If not specified then file_name is used
    #     :return: True if file was uploaded, else False
    #     """

    #     # If S3 object_name was not specified, use file_name
    #     if object_name is None:
    #         object_name = file_name

    #     # Upload the file
    #     s3_client = boto3.client('s3')
    #     try:
    #         response = s3_client.upload_file(file_name, bucket, object_name)
    #     except ClientError as e:
    #         logging.error(e)
    #         return False
    #     return True

    def upload_json(self, json_to_dump, path, stream_id):
        s3object = self.s3.Object(self.bucket_name, '{path}/{stream_id}'.format(path=path, stream_id=self.stream_id))

        s3object.put(
            Body=(bytes(json.dumps(json_to_dump).encode('UTF-8'))),
            ContentType='application/json'
        )

    def upload_srt(self, path, json_to_save, file_name):
        s3object = self.s3.Object(self.bucket_name, '{path}/{stream_id}'.format(path=path, stream_id=self.stream_id))
        s3object.put(Key='{file_name}.srt'.format(file_name=file_name), Body=json_to_save)
