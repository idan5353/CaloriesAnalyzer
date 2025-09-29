import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ 
  region: process.env.AWS_REGION || "us-west-2" 
});

export async function analyzeCalories(imageBuffer, mimeType = "image/jpeg") {
  try {
    // Convert image to base64
    const base64Image = imageBuffer.toString("base64");

    const input = {
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType,
                data: base64Image
              }
            },
            {
              type: "text",
              text: "Analyze this food image. List the food items you can identify and provide an estimate of the total calories. Explain your reasoning briefly."
            }
          ]
        }
      ],
      max_tokens: 1024,
      anthropic_version: "bedrock-2023-05-31"
    };

    // Use Claude 3 Haiku - faster and cheaper
    const cmd = new InvokeModelCommand({
      modelId: "anthropic.claude-3-haiku-20240307-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(input)
    });

    const response = await client.send(cmd);
    const body = new TextDecoder().decode(response.body);
    const result = JSON.parse(body);
    
    return result.content[0].text;
    
  } catch (error) {
    console.error('Bedrock API Error:', error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}
