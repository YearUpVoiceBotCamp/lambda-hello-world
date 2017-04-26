# Coca Cola Echo

## Lambda Setup

Navigate to the Lambda service through the AWS portal.  We are going to configure our function and test event here and then upload our code later.  Start by clicking "Create a Lambda Function".  Under blueprints, select "Blank Function".  The Blueprints give you starter templates for different projects.  We will be constructing our Alexa skill independent of these templates.

## Configure Triggers

This is the part of the configuration process where we define the trigger for our Lambda function.  You are able to change this later, after the function is created, but we will go ahead and do it now.  Select "Alexa Skills Kit" as your trigger for your function.  As a reminder, these are the other triggers available through AWS:

	- API Gateway
	- AWS IOT
	- Alexa Skills Kit
	- Alexa Smart Home
	- CloudFront
	- CloudWatch Events - Schedule
	- CloudWatch Logs
	- CodeCommit
	- Cognito Sync Trigger
	- Dynamo DB
	- Kinesis
	- S3
	- SNS

Some of these services as triggers will require that you define the exact service as the trigger (ex: API Gateway, SNS, S3...).  For the Alexa Skills Kit, we will actually use the functions ARN (Amazon Resource Name) to connect the specific skill with our code inside of the Alexa developer portal.


## Configure Function

Here is where we will finish configuring the settings for your function.  These can be changed after the function is created, but we will go ahead and establish a basic configuration now.  Go ahead and fill out "Name" and "Description" and set the runtime to "Node.js 6.10".  We will leave the function code and environment variables blank for now.  Later, we will use Serverless to upload our code and define our variables.

	- Lambda function handler:  We will leave this as it is.  The handler just defines the module.export value in your function. 

	- Role: Defines the permissions of your function. Note that new roles may not be available for a few minutes after creation.
		1. Select "Create a Custom Role".  This will take you to the IAM service portal.  
		2. We will name our role "lambda_basic_execution"
		3. For now, we won't edit the policy document.  This policy document allows logging of the lambda function, which is something the function must have.
		4. Click "Allow"

	- Tags: Allow you to group and filter your functions. We won't use these right now.  

	- Advanced Settings: We will set Memory to 128MB and our Timeout to 3 seconds.  When we begin testing our function, you can use CloudWatch 	 to determine if we need to adjust either of these values.  we will leave the rest of the settings as is and click "Next".

Review your configurations and if it looks good, select "Create Function".


##Configure Test Event

Once we go back into our function, click on "Configure Test Event" under "Actions".  This is where we can create test cases and execute them on our function.  Since a test acts as a trigger, we will go ahead and start with the "Alexa Start Session" sample event template.  Inside of the test dialog, AWS will show you what our event code looks like.  You can make changes here and see how your function responds to different conditions.  

For the Start Session, we will need to replace all of the "[unique-value-here]" placeholders with your application ID found on the Alexa skills portal.  This is generally a good place to perform your tests because you will receive actual execution results and log outputs with error messaging.  You can also test your function using the Alexa Skills Portal, however, you lose this logging capability.

One strategy is to use the Alexa Developer Portal to form the test event body and then use this request body inside of the Lambda test event to get actual feedback on your function.



