import asyncio
import boto3
import json
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client
from urllib.parse import urlencode

class BedrockMCPClient:
    def __init__(self, mcp_url, bedrock_region='us-east-1'):
        self.mcp_url = mcp_url
        self.bedrock = boto3.client('bedrock-runtime', region_name=bedrock_region)
        
    async def call_mcp_tool(self, tool_name, arguments=None):
        """Call MCP tool and return result"""
        async with streamablehttp_client(self.mcp_url) as (read, write, _):
            async with ClientSession(read, write) as session:
                await session.initialize()
                result = await session.call_tool(tool_name, arguments or {})
                return result.content
    
    def call_bedrock(self, prompt, model_id='anthropic.claude-3-sonnet-20240229-v1:0'):
        """Call Bedrock with prompt"""
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "messages": [{"role": "user", "content": prompt}]
        })
        
        response = self.bedrock.invoke_model(
            body=body,
            modelId=model_id,
            accept='application/json',
            contentType='application/json'
        )
        
        return json.loads(response.get('body').read())['content'][0]['text']

async def main():
    # MCP server URL
    base_url = "https://server.smithery.ai/@WTTeneger/food-tracker-mcp/mcp"
    params = {"api_key": "3c3****...****c357"}
    url = f"{base_url}?{urlencode(params)}"
    
    client = BedrockMCPClient(url)
    
    # Example: Get food data via MCP and analyze with Bedrock
    try:
        # Call MCP tool to get food data
        food_data = await client.call_mcp_tool("get_foods")
        
        # Use Bedrock to analyze the data
        prompt = f"Analyze this food data and provide health insights: {food_data}"
        analysis = client.call_bedrock(prompt)
        
        print("Food Data:", food_data)
        print("\nBedrock Analysis:", analysis)
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())