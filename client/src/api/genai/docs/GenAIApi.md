# GenAIApi

All URIs are relative to *http://localhost:80*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**healthHealthGet**](#healthhealthget) | **GET** /genai/health | Health|
|[**interpretInterpretPost**](#interpretinterpretpost) | **POST** /genai/interpret | Interpret|

# **healthHealthGet**
> any healthHealthGet()


### Example

```typescript
import {
    GenAIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GenAIApi(configuration);

const { status, data } = await apiInstance.healthHealthGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **interpretInterpretPost**
> GenAIResponse interpretInterpretPost(promptRequest)


### Example

```typescript
import {
    GenAIApi,
    Configuration,
    PromptRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new GenAIApi(configuration);

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
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

