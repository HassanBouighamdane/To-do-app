import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "to-do-list";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    let requestJSON = JSON.parse(event.body);
    await dynamo.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { todoID: requestJSON.todoID },
        UpdateExpression: "set isComplete = :isComplete",
        ExpressionAttributeValues: {
          ":isComplete": requestJSON.isComplete,
        },
        ReturnValues: "UPDATED_NEW"
      })
    );

    body = { message: "Task updated successfully" };
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
