# AIInterpretationApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**interpretInterpretPost**](#interpretinterpretpost) | **POST** /interpret | Interpret AI Prompt|

# **interpretInterpretPost**
> GenAIResponse interpretInterpretPost(promptRequest)

Processes a natural language prompt to either generate new tasks or answer questions about existing tasks

### Example

```typescript
import {
    AIInterpretationApi,
    Configuration,
    PromptRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AIInterpretationApi(configuration);

let promptRequest: PromptRequest; //

const { status, data } = await apiInstance.interpretInterpretPost(
    promptRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptRequest** | **PromptRequest**|  | |


### Return type

**GenAIResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Prompt successfully interpreted |  -  |
|**400** | Invalid request format or missing required fields |  -  |
|**500** | Internal server error during AI processing |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

