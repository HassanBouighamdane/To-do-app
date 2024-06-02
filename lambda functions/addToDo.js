import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "to-do-list";
export const handler = async (event, context) => {
  let body;
  let statusCode = 201;
  const headers = {
    "Content-Type": "application/json",
  };
   try {
        let requestJSON = JSON.parse(event.body);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              todoID: requestJSON.todoID,
              toDoTask: requestJSON.toDoTask,
              isComplete: false
            },
          })
        );
         body = { message: "Task added successfully" };
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
    
  }
   return {
    statusCode,
    body,
    headers,
  };
}
