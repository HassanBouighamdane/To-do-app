import json
import boto3

def lambda_handler(event, context):
    
    client = boto3.client('dynamodb')
    tableName = 'to-do-list'
    response=client.scan(
        TableName=tableName)
    return {
        'statusCode': 200,
        'body': response
    }
