del lambda.zip;
cd lambda;
npm install;
cd ..;
Compress-Archive -Path lambda -DestinationPath lambda.zip;
aws lambda update-function-code --function-name hello_world --zip-file fileb://lambda.zip;