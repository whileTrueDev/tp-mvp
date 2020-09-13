import logging
import boto3
import json
from botocore.exceptions import ClientError


def upload_file(file_name, bucket, object_name=None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = file_name

    # Upload the file
    s3_client = boto3.client('s3')
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except ClientError as e:
        logging.error(e)
        return False
    return True


def upload_json(bucket_name, json_to_dump, path, stream_id):
    s3 = boto3.resource('s3')
    s3object = s3.Object(bucket_name, '{path}/{stream_id}'.format(path=path, stream_id=stream_id))

    s3object.put(
        Body=(bytes(json.dumps(json_to_dump).encode('UTF-8'))),
        ContentType='application/json'
    )
