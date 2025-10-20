---
categories: AI
tags:
  - AI
  - MCP
date: 2024-06-20T00:00:00.000Z
title: FunctionCall和MCP
recommend: true
id: mcpfuy4npp7
---

Agent入门第一课：工具-FunctionCall和MCP
Agent是什么？
Agent（智能体）是一种能够感知环境并自主决策的实体，可以是软件程序、硬件设备或虚拟数字存在
比如：
自动化客服机器人智能家具中枢为什么要搞Agent？Agent对于大模型的意义是什么？
Agent是对LLM（大语言模型）能力的泛化。从语言处理向通用人工智能进行转变。

从LLM到Agent，需要什么？

- LLM: 是一个棒小伙，脑袋很聪明，知识渊博，会听会看会说。但他有很多问题，没法成为一个好员工，现在该怎么帮帮他。

1. 他的记忆力很有问题：帮他记

- 他的短期记忆力比鱼还差，记不住超过1句话的内容
  - 上下文：给他一张纸，记下他过去所有的话，和他说下一句之前给他看。
- 他学习很慢，学习一次要好几天
  - RAG：给他一个词典，当他不会的时候查一查告诉他。

2. 他的行动力很有问题：给他工具

- 他没手没脚，什么也做不了
  - FunctionCall：给他一个口令本，只要他按照特定的口令说出特定的话，就会有人来帮忙。
  - MCP：这种人好可怜，需要给这样的人定义一套标准的口令本，大家都用这种口令就可以帮他。

3. 他是新来的，不知道该怎么开展工作：培训他

- Prompt工程：让他干活儿之前，把一个活儿是什么样的？要干什么？用什么工具将清楚。
- ReAct(ReasonAct) + Reflection：思考、行动、观察、反思，一步拆成多步去做

4. 活儿太复杂了，他应付不来：多来几个

- 多Agent协作
  今天我们就从工具开始，来了解下大模型应该如何与世界交互。

工具
FunctionCall
VLLM-DEMO
对于VLLM，大家都比较熟悉了，这是一个成熟的模型推理框架。VLLM也提供了对于FunctionCall的支持，我们来直接看下代码，VLLM如何使用FunctionCall

import json
import requests
import re
from vllm import LLM
from vllm.sampling_params import SamplingParams

# ----------------------

# 模型初始化模块

# ----------------------

# 首先是找一个支持functionCall的模型 Qwen2.5-7B-Instruct 支持functionCall

model_name = "/taiyang-test/Qwen2.5-7B"
sampling_params = SamplingParams(
max_tokens=512,
temperature=0.0
)
llm = LLM(
model=model_name,
dtype="bfloat16",
tensor_parallel_size=2,
max_model_len=4096
)

# ----------------------

# 工具函数模块

# ----------------------

# 工具函数在这里

def get_current_weather(city: str, state: str, unit: str):
"""模拟天气查询工具（实际应用需替换为真实API）"""
return f"{city}市（{state}）当前气温27{unit}，晴间多云"
def get_sku_info(sku: str):
try:
requestUrl = "https://info-support.dun.mi.com/api/v1/search-by-sku?sku=" + sku #产品百科
print(requestUrl)
data = requests.get(requestUrl)
print(data.text)
return(data.text)
except:
return("API调用失败,但无伤大雅")

# 工具定义在这里

tools = [{
"type": "function",
"function": {
"name": "get_current_weather",
"description": "获取指定城市的实时天气信息",
"parameters": {
"type": "object",
"properties": {
"city": {"type": "string", "description": "城市名称"},
"state": {"type": "string", "description": "省份/州缩写（如：GD、TX）"},
"unit": {"type": "string", "enum": ["celsius", "fahrenheit"], "description": "温度单位"}
},
"required": ["city", "state", "unit"]
}
}
},
{
"type": "function",
"function": {
"name": "get_sku_info",
"description": "根据输入的sku,获取具体的商品信息,注意sku是5位数字",
"parameters": {
"type": "object",
"properties": {
"sku": {"type": "string", "description": "sku,5位数字"}
},
"required": ["sku"]
}
}
}
]
tool_functions = {"get_current_weather": get_current_weather, "get_sku_info": get_sku_info}

# ----------------------

# 主交互循环

# ----------------------

def chat_loop(): # 对话上下文
messages = []
print("对话系统已启动，输入内容开始聊天（输入 exit 退出）")

    while True:
        # 获取用户输入
        user_input = input("\n用户：").strip()
        if user_input.lower() in ["exit", "quit"]:
            print("对话已结束")
            break

        # 添加用户消息到对话历史
        messages.append({"role": "user", "content": user_input})

        try:
            # 生成初步回复，这里把工具传给了Qwen
            firstoutputs = llm.chat(messages, sampling_params=sampling_params, tools=tools)
            response = firstoutputs[0].outputs[0].text.strip()
            response = response.replace("<|endoftext|>", "")

            # 处理大模型的返回，可能是工具调用
            processed_response = handle_tool_calls(response, messages)

            # 更新对话历史并输出结果
            messages.append({"role": "assistant", "content": processed_response})
            print(f"\n助手：{processed_response}")
        except Exception as e:
            print(f"生成出错：{str(e)}")
            messages.pop()  # 移除无效的用户输入

# ----------------------

# 交互处理模块

# ----------------------

def handle_tool_calls(output: str, messages: list) -> str:
"""处理工具调用流程"""
'''Qwen输出的functionCall长这样
<tool_call>{"name": "get_sku_info", "arguments": {"sku": "63194"}}</tool_call>''' # 判断LLM是不是想调用工具
if "<tool_call>" not in output: # 非工具调用链路
return output

    # 工具调用链路
    # 提取解析并执行工具调用
    tool_call_match = re.search(r'<tool_call>(.*?)</tool_call>', output, re.DOTALL)
    # 异常流，匹配不到工具
    if not tool_call_match:
        return output

    try:
        tool_data = json.loads(tool_call_match.group(1).strip())
        tool_calls = [tool_data] if isinstance(tool_data, dict) else tool_data
    except json.JSONDecodeError:
        return "工具调用参数解析失败"

    # 执行所有工具调用
    tool_responses = []
    for call in tool_calls:
        if not isinstance(call, dict) or 'name' not in call:
            continue

        func_name = call['name']
        if func_name in tool_functions:
            try:
                print("检测到function call")
                print(output)
                result = tool_functions[func_name](**call.get('arguments', {}))
                print("function 输出")
                tool_responses.append(result)
            except Exception as e:
                tool_responses.append(f"工具执行失败：{str(e)}")

    # 将工具结果加入对话历史
    if tool_responses:
        messages.append({
            "role": "tool",
            "content": "\n".join(tool_responses)
        })
        # 请求模型生成最终回复
        outputs = llm.chat(messages, sampling_params=sampling_params, tools=tools)
        final_output = outputs[0].outputs[0].text.strip()
        return final_output.replace("<|endoftext|>", "")

    return output

if **name** == "**main**":
chat_loop()

- 代码的工作流如下

通过以上代码，我们很容易能得到如下结论：FunctionCall，在技术原理上就是控制大模型进行特定输出。当大模型判断需要使用工具时，从输入的工具规范中，选择一个进行输出。不同的模型的FunctionCall规范是不同的具体可以看下vllm tool call的文档https://docs.vllm.ai/en/stable/features/tool_calling.html
提问：在一个CS结构的对话服务中，S是模型服务提供者、C是模型服务调用者，工具的提供，应该是谁来做？下面我们来通过代码，看下这个问题

CS
Function Calling - Qwen
服务端：
vllm serve /taiyang-test/Qwen2.5-7B --enable-auto-tool-choice --tool-call-parser hermes --dtype=bfloat16 --tensor_parallel_size=2

客户端：
from openai import OpenAI
import requests
import json

# openAi Client 相比于DEMO中的VLLM的调用，这里使用openAI的原生API

client = OpenAI(base_url="http://localhost:8000/v1", api_key="dummy")

# 还是这两个工具

def get_current_weather(city: str, state: str, unit: str):
"""模拟天气查询工具（实际应用需替换为真实API）"""
return f"{city}市（{state}）当前气温27{unit}，晴间多云"
def get_sku_info(sku: str):
try:
requestUrl = "https://info-support.dun.mi.com/api/v1/search-by-sku?sku=" + sku
print(requestUrl)
data = requests.get(requestUrl)
print(data.text)
return(data.text)
except:
return("API调用失败,但无伤大雅")

#客户端的工具定义

tools = [{
"type": "function",
"function": {
"name": "get_current_weather",
"description": "获取指定城市的实时天气信息",
"parameters": {
"type": "object",
"properties": {
"city": {"type": "string", "description": "城市名称"},
"state": {"type": "string", "description": "省份/州缩写（如：GD、TX）"},
"unit": {"type": "string", "enum": ["celsius", "fahrenheit"], "description": "温度单位"}
},
"required": ["city", "state", "unit"]
}
}
},
{
"type": "function",
"function": {
"name": "get_sku_info",
"description": "根据输入的sku,获取具体的商品信息,注意sku是5位数字",
"parameters": {
"type": "object",
"properties": {
"sku": {"type": "string", "description": "sku,5位数字"}
},
"required": ["sku"]
}
}
}
]

tool_functions = {"get_current_weather": get_current_weather, "get_sku_info": get_sku_info}

# ----------------------

# 主交互循环

# ----------------------

def chat_loop():
messages = []
print("对话系统已启动，输入内容开始聊天（输入 exit 退出）")

    while True:
        # 获取用户输入
        user_input = input("\n用户：").strip()
        if user_input.lower() in ["exit", "quit"]:
            print("对话已结束")
            break
        messages.append({"role": "user", "content": user_input})

        try:
            while True:
                # 调用大模型
                response = client.chat.completions.create(
                    model=client.models.list().data[0].id,
                    messages=messages,
                    tools=tools,
                    tool_choice="auto"
                )

                # 解析响应
                message = response.choices[0].message
                messages.append(message)  # 保存助手的消息

                # 检查是否需要工具调用
                if not message.tool_calls:
                    final_response = message.content
                    break

                # 处理所有工具调用
                for tool_call in message.tool_calls:
                    func_name = tool_call.function.name
                    args = json.loads(tool_call.function.arguments)

                    # 执行工具函数
                    result = tool_functions.get(func_name, lambda _: "工具不存在")(**args)

                    # 添加工具调用结果到消息历史
                    messages.append({
                        "role": "tool",
                        "content": str(result),
                        "name": func_name
                    })

            print(f"\n助手：{final_response}")

        except json.JSONDecodeError:
            print("参数解析失败，请检查工具参数格式")
            messages.pop()  # 移除无效的助手消息
        except Exception as e:
            print(f"系统错误：{str(e)}")
            messages.pop()  # 移除无效的助手消息

if **name** == "**main**":
chat_loop()

FunctionCall：LLM服务端提供的是能力，客户端提供工具

这样做有什么好处呢？
工具能力与LLM推理能力解耦：LLM仅提供支持，客户端自己定制工具业务能力。既然工具可以与LLM解耦，那么工具能不能和客户端解耦？

当然可以呀，工具的调用是我们自己写的，在现有的Client中，把工具的提供，工具的调用，统统包装成一个新的服务就可以了

Function解耦

- Function服务
  from flask import Flask, jsonify, request

app = Flask(**name**)

tools_metadata = [
{
"name": "get_current_weather",
"description": "获取指定城市的实时天气信息",
"endpoint": "http://localhost:5000/execute",
"method": "POST",
"schema": {
"parameters": {
"type": "object",
"properties": {
"city": {"type": "string", "description": "城市名称"},
"state": {"type": "string", "description": "省份/州缩写（如：GD、TX）"},
"unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
},
"required": ["city", "state", "unit"]
}
}
},
{
"name": "get_sku_info",
"description": "根据输入的sku获取商品信息",
"endpoint": "http://localhost:5000/execute",
"method": "POST",
"schema": {
"parameters": {
"type": "object",
"properties": {
"sku": {"type": "string", "description": "5位数字SKU"}
},
"required": ["sku"]
}
}
}
]

def get_current_weather(city, state, unit):
return f"{city}市（{state}）当前气温27{unit}，晴间多云"

def get_sku_info(sku):
try:
response = requests.get(f"https://info-support.dun.mi.com/api/v1/search-by-sku?sku={sku}")
return response.text
except Exception:
return "API调用失败"

@app.route('/execute', methods=['POST'])
def execute():
data = request.json
func_name = data["function"]
args = data["arguments"]

    if func_name == "get_current_weather":
        result = get_current_weather(**args)
    elif func_name == "get_sku_info":
        result = get_sku_info(**args)
    else:
        return jsonify({"error": "未知函数"}), 404

    return jsonify({"result": result})

@app.route('/metadata', methods=['GET'])
def get_metadata():
return jsonify({"tools": tools_metadata})

if **name** == '**main**':
app.run(host='0.0.0.0', port=5000)

- Client服务
  from openai import OpenAI
  import requests
  import json

# 配置

METADATA_URL = "http://localhost:5000/metadata"
client = OpenAI(base_url="http://localhost:8000/v1", api_key="dummy")

# 动态初始化工具定义

def init_tools():
try:
metadata = requests.get(METADATA_URL).json()["tools"]
tools = [
{
"type": "function",
"function": {
"name": item["name"],
"description": item["description"],
"parameters": item["schema"]["parameters"]
}
} for item in metadata
]
return tools, metadata
except requests.exceptions.RequestException:
raise RuntimeError("无法加载工具元数据")

# 统一函数调用器

class FunctionDispatcher:
def **init**(self, metadata):
self.metadata = metadata

    def call(self, func_name, arguments):
        tool_config = next((t for t in self.metadata if t["name"] == func_name), None)
        if not tool_config:
            raise ValueError(f"未知工具: {func_name}")

        try:
            response = requests.request(
                method=tool_config["method"],
                url=tool_config["endpoint"],
                json={"function": func_name, "arguments": arguments}
            )
            print('调用functionCall' + json.dumps(response.json()["result"]))
            response.raise_for_status()
            return response.json()["result"]
        except requests.exceptions.RequestException as e:
            print('调用functionCall失败' + {str(e)})
            return f"调用失败: {str(e)}"

# 主循环

def chat_loop():
tools, metadata = init_tools()
dispatcher = FunctionDispatcher(metadata)
messages = []

    while True:
        user_input = input("\n用户：").strip()
        if user_input.lower() in ["exit", "quit"]:
            break
        messages.append({"role": "user", "content": user_input})

        try:
            while True:
                # 调用大模型
                response = client.chat.completions.create(
                    model=client.models.list().data[0].id,
                    messages=messages,
                    tools=tools,
                    tool_choice="auto"
                )
                message = response.choices[0].message
                messages.append(message)

                if not message.tool_calls:
                    print(f"\n助手：{message.content}")
                    break

                # 处理工具调用
                for tool_call in message.tool_calls:
                    func_name = tool_call.function.name
                    print('识别到functionCall' + func_name)
                    args = json.loads(tool_call.function.arguments)
                    result = dispatcher.call(func_name, args)
                    messages.append({
                        "role": "tool",
                        "content": str(result),
                        "name": func_name
                    })

        except Exception as e:
            print(f"错误: {str(e)}")

if **name** == "**main**":
chat_loop()

调用效果：

这种模式下，系统交互图变成了这个样子

DIFY-工具市场化
Function与Client解耦，让我们可以整一些花活儿。
一个很有诱惑力的点子就是，把Function市场化，大家都可以去调用
我们大家都很熟悉的Dify就是这么做的

Agent

1. Mify工具市场

2. 思考决策，执行functionCall

3. 回归结果，执行输出

MCP
工具市场化是一个很诱人的设计，现在还是太麻烦了：每多一个工具，就需要再多调一个API，要我去给这些API写FunctionCall的兼容，准备它的MetaData，难道这不应该是这些API自己提供的嘛？
要人家API自己提供服务给大模型用，首先得告诉人家什么样的接口大模型才能识别，于是就有了MCP

MCP（Model Context Protocol，模型上下文协议）是Anthropic公司（Claude母公司，从openAi跑路的几个哥们开的）推出的开源协议，旨在标准化大型语言模型（LLM）与外部数据源/工具的交互方式

MCP-Server

- 如何将SpringBoot项目改造成一个MCP服务
  官方sdk
  详细过程可以参考这个文档

1. 导入官方sdk依赖
   特别注意，需要jdk 17 SpringBoot 3

mcp-java-官方sdk
<dependency>
<groupId>io.modelcontextprotocol.sdk</groupId>
<artifactId>mcp</artifactId>
<version>0.8.1</version>
</dependency>
<dependency>
<groupId>io.modelcontextprotocol.sdk</groupId>
<artifactId>mcp-spring-webmvc</artifactId>
<version>0.8.1</version>
</dependency>

2.  注入SseServerTransportProvider
    @Configuration
    public class McpServerConfig {

        @Bean
        WebMvcSseServerTransportProvider webMvcSseServerTransportProvider(ObjectMapper mapper) {
            return new WebMvcSseServerTransportProvider(mapper, "/mcp/message");
        }

        @Bean
        RouterFunction<ServerResponse> mcpRouterFunction(WebMvcSseServerTransportProvider transportProvider) {
            return transportProvider.getRouterFunction();
        }

    }

3.  启动服务器
    @Service
    public class MyMcpServer {

        @Autowired
        private WebMvcSseServerTransportProvider provider;

        @PostConstruct
        public void start() {
            // 创建并配置MCP同步服务器
            McpSyncServer syncServer = McpServer.sync(provider)
                    .serverInfo("my-server", "1.0.0") // 设置服务器标识和版本
                    .capabilities(McpSchema.ServerCapabilities.builder()
                            .tools(true)
                            .logging()
                            .build())
                    .build();

            String schema = "{\n" +
                    "            \"type\" : \"object\",\n" +
                    "                \"id\" : \"urn:jsonschema:Weather\",\n" +
                    "                \"properties\" : {\n" +
                    "            \"city\" : {\n" +
                    "                \"type\" : \"string\"\n" +
                    "            }" +
                    "        }\n" +
                    "        }";
            // 添加工具
            McpServerFeatures.SyncToolSpecification toolSpecification = new McpServerFeatures.SyncToolSpecification(
                    new McpSchema.Tool("weather Tool", "获取指定城市的实时天气信息", schema),
                    (exchange, arguments) -> {
                        // 工具的具体实现
                        List<McpSchema.Content> result = new ArrayList<>();
                        result.add(new McpSchema.TextContent("当前气温27度，晴间多云"));
                        return new McpSchema.CallToolResult(result, false);
                    }
            );
            syncServer.addTool(toolSpecification);
            System.out.println("MCP Server started ====================================");
        }

4.  测试
    我们可以使用MCP官方的测试工具

- 需要安装node.js
  npx @modelcontextprotocol/inspector
  这里可以看到，作为服务提供方，我们已经将我们的服务，转成了MCP标准格式

除了Tool之外，MCP对资源的定义还包含Resource和PromptResource与Tool类似，不过在MCP的范式中，Resource应该是静态的，无参数的Prompt：
SpringAI
官方文档

- 引入配置
  <dependency>
  <groupId>org.springframework.ai</groupId>
  <artifactId>spring-ai-starter-mcp-server-webmvc</artifactId>
  <version>1.0.0-M7</version>
  </dependency>

- 系统配置：
  spring:
  ai:
  mcp:
  server:
  enabled: true
  name: ai_mcp_server
  version: 1.0.0
  type: SYNC
  sse-message-endpoint: /mcp/message
  stdio: false

- 定义工具：比原生的简单很多，Spring-AI会帮忙写schema
  import org.springframework.ai.tool.annotation.Tool;
  import org.springframework.ai.tool.annotation.ToolParam;
  import org.springframework.stereotype.Service;

@Service
public class MyMcpService {

    @Tool(name = "weatherToolSpringAi", description = "获取指定城市的实时天气信息")
    public String getWeather(@ToolParam(description = "城市名称") String city) {
        return "城市: " + city + " 当前气温27度，晴间多云";
    }

}

- 注册工具、资源、prompt
  @ComponentScan(basePackages = {"com.xiaomi"})
  @SpringBootApplication
  public class CreateMcpApplication {

      public static void main(String[] args) {
          SpringApplication.run(CreateMcpApplication.class, args);
      }

      @Bean
      public ToolCallbackProvider documentTools(MyMcpService mcpService) {
          return MethodToolCallbackProvider.builder()
                  .toolObjects(mcpService)
                  .build();
      }

      @Bean
      public List<McpServerFeatures.SyncResourceSpecification> myResources() {
          // 1. 定义资源元数据（URI、名称、描述等）
          var systemInfoResource = new McpSchema.Resource(
                  "mcp://system-info", // 资源唯一标识符
                  "System Information",            // 资源名称
                  "Current system environment data", // 资源描述
                  null, null                             // 额外元数据（可选）
          );
          // 2. 定义资源同步逻辑（如何处理请求）
          var resourceSpecification = new McpServerFeatures.SyncResourceSpecification(
                  systemInfoResource,
                  (exchange, request) -> {
                      try {
                          // 3. 生成动态资源内容（例如系统信息）
                          var systemInfo = Map.of(
                                  "osName", "泰阳的系统",
                                  "osVersion", System.getProperty("os.version"),
                                  "javaVersion", System.getProperty("java.version")
                          );
                          // 4. 将数据序列化为JSON
                          String jsonContent = new ObjectMapper().writeValueAsString(systemInfo);
                          // 5. 返回资源内容
                          return new McpSchema.ReadResourceResult(
                                  List.of(new McpSchema.TextResourceContents(
                                          request.uri(),    // 资源URI
                                          "application/json", // MIME类型
                                          jsonContent       // 实际内容
                                  ))
                          );
                      } catch (Exception e) {
                          throw new RuntimeException("Failed to generate system info", e);
                      }
                  }
          );
          return List.of(resourceSpecification);
      }

      @Bean
      public List<McpServerFeatures.SyncPromptSpecification> myPrompts() {
          var prompt = new McpSchema.Prompt("output rule", "当前服务的输出规范",
                  List.of(new McpSchema.PromptArgument("type", "输出规范类型json或者xml", true)));

          var promptSpecification = new McpServerFeatures.SyncPromptSpecification(prompt, (exchange, getPromptRequest) -> {
              String typeArgument = (String) getPromptRequest.arguments().get("type");
              if (typeArgument == null) { typeArgument = "json"; }
              var userMessage = new McpSchema.PromptMessage(
                      McpSchema.Role.USER, new McpSchema.TextContent("作为一个专业的大语言模型工具，你应该按照以下格式进行输出 " + typeArgument));
              return new McpSchema.GetPromptResult("当前服务的输出规范", List.of(userMessage));
          });

          return List.of(promptSpecification);
      }

}

测试：

MCP-Client客户端软件
MCP作为一个标准协议，目前有很多客户端给予了支持

Cherry Studio

- DeepSeekV3成功识别了MCP，并调用了工具

客户端是如何与大模型交互的？我们可以使用 CloudFlare 的大模型代理来看下日志https://dash.cloudflare.com/

{
"model": "deepseek-chat",
"messages": [
{
"role": "user",
"content": "你好，武汉的天气怎么样？"
}
],
"stream": true,
"tools": [
{
"type": "function",
"name": "weather Tool",
"function": {
"name": "fYzKHuoVFjHblSFeCYWlDV",
"description": "获取指定城市的实时天气信息",
"parameters": {
"type": "object",
"properties": {
"city": {
"type": "string"
}
}
}
}
}
]
}

第一段请求：可以看到，CherryStudio是通过function-call的方式，向DeepSeek发起的请求中携带了MCP方法信息。那我们换一个不支持Function-call的模型呢？比如R1。很遗憾，直接挂了。

Cline
换成Cline之后，DeepSeek-R1又支持MCP了这是怎么回事呢？我们还是抓一下请求

可以看到，Cline是将MCP信息通过prompt的方式给到R1的。不经过FunctionCall，可以想到，这种方式理论上可以支持一切LLM。
这边还有一些其他的MCP客户端，我们也可以尝试

MCP和FunctionCall的差异
看到这，相信大家对于MCP大概有了一个初步的认识，让我们来汇总一下

MCP
FunctionCall
解放了模型限制
模型要求
不强依赖模型提供能力
MCP可以由FunctionCall提供能力支持，看客户端实现
必须由LLM提供支持

请求规范
统一的请求规范，Client方无需关心
必须遵循LLM提供的特定规范
解耦了业务能力
能力解耦
能力由Tool方提供，Client方不需要逐个适配，一键安装。
需要Client方遵循服务方API接口规范，手动对接

- 除了我们刚刚演示的MCP Web Server之外，MCP还可以通过一个小node.js程序，挂载在Client上。提供更加简单的接入方式。

相比Function-Call，MCP极大的降低了 Client 端工具调用的难度。方便我们很简单的拓展Agent的能力。
这里给大家举几个例子：（以下功能是在一个小时内集成完成）

通过高德MCP，让大模型学会导航

添加爬虫MCP工具，让大模型看网页

通过MysqlMCP，让大模型自己记录对话

通过FileSystem MCP，让大模型查看本地文件

推荐几个找到更多更好玩MCP的网站
https://mcp.so/
https://modelscope.cn/mcp

MCP-Client开发
SpringAI实现

1.  pom依赖
     <!--MCP Client依赖-->
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-starter-mcp-client</artifactId>
        <version>1.0.0-M7</version>
    </dependency>
    <!--模型对接依赖-->
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
        <version>1.0.0-M6</version>
    </dependency>

2.  引入配置
    server:
    port: 8081
    spring:
    ai:
    openai:
    base-url: https://api.deepseek.com
    api-key: sk-cbbc641be8xxxxxxxxxxxxxx
    chat:
    options:
    model: deepseek-chat
    mcp:
    client:
    enabled: true
    name: ai_mcp_client
    initialized: true
    version: 1.0.0
    type: SYNC
    toolcallback:
    enabled: true
    sse:
    connections:
    server1:
    url: http://localhost:8080

3.  代码实现
    可以看到，SpringAI对MCP的调用过程做了高度封装。多步流程，集成在了一步操作力
    @RestController
    @RequestMapping("/test")
    public class TestController {

        private final ChatClient chatClient;
        public TestController(ChatClient.Builder aiClientBuilder, ToolCallbackProvider mcpTools) {
            this.chatClient = aiClientBuilder
                    .defaultTools(mcpTools)
                    .build() ;
        }

        @GetMapping("/ask")
        public String test(String input) {
            String response = this.chatClient
                    .prompt(input)
                    .call().content();
            return response;
        }

}
