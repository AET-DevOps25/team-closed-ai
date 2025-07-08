# DefaultApi

All URIs are relative to _http://localhost:80_

| Method                                                | HTTP request        | Description |
| ----------------------------------------------------- | ------------------- | ----------- |
| [**healthHealthzGet**](#healthhealthzget)             | **GET** /healthz    | Health      |
| [**interpretInterpretPost**](#interpretinterpretpost) | **POST** /interpret | Interpret   |

# **healthHealthzGet**

> any healthHealthzGet()

### Example

```typescript
import { DefaultApi, Configuration } from "./api";

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.healthHealthzGet();
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

| Status code | Description         | Response headers |
| ----------- | ------------------- | ---------------- |
| **200**     | Successful Response | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **interpretInterpretPost**

> GenAIResponse interpretInterpretPost(promptRequest)

### Example

```typescript
import { DefaultApi, Configuration, PromptRequest } from "./api";

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let promptRequest: PromptRequest; //

const { status, data } =
  await apiInstance.interpretInterpretPost(promptRequest);
```

### Parameters

| Name              | Type              | Description | Notes |
| ----------------- | ----------------- | ----------- | ----- |
| **promptRequest** | **PromptRequest** |             |       |

### Return type

**GenAIResponse**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details

| Status code | Description         | Response headers |
| ----------- | ------------------- | ---------------- |
| **200**     | Successful Response | -                |
| **422**     | Validation Error    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
