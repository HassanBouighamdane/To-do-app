import json
import boto3

def lambda_handler(event, context):
    client=boto3.client('dynamodb')
    tableName='to-do-list'
    body = json.loads(event['body'])
    todoID = body['todoID']
    response=client.get_item(
        TableName= tableName,
        Key={
            'todoID': {
                'S': todoID
        }}
        )
    
    return {
        'statusCode': 200,
        'body': response
    }
