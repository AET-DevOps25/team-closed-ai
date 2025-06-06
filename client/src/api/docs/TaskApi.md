# TaskApi

All URIs are relative to *http://localhost:8083*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**changeTaskStatus**](#changetaskstatus) | **PATCH** /tasks/{id}/status | Change the status of a task|
|[**deleteTask**](#deletetask) | **DELETE** /tasks/{id} | Delete a task|
|[**getAllTasks**](#getalltasks) | **GET** /tasks | Get all tasks|
|[**getTaskById**](#gettaskbyid) | **GET** /tasks/{id} | Get a task by ID|
|[**getTasksByAssignee**](#gettasksbyassignee) | **GET** /tasks/by-assignee/{id} | Get tasks by assignee|
|[**getTasksByProject**](#gettasksbyproject) | **GET** /tasks/by-project/{id} | Get tasks by project|
|[**updateTask**](#updatetask) | **PUT** /tasks/{id} | Update a task|

# **changeTaskStatus**
> TaskDto changeTaskStatus()


### Example

```typescript
import {
    TaskApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaskApi(configuration);

let id: number; // (default to undefined)
let status: TaskStatus; // (default to undefined)

const { status, data } = await apiInstance.changeTaskStatus(
    id,
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|
| **status** | **TaskStatus** |  | defaults to undefined|


### Return type

**TaskDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated task |  -  |
|**404** | Task not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteTask**
> deleteTask()


### Example

```typescript
import {
    TaskApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaskApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteTask(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Task deleted successfully |  -  |
|**404** | Task not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllTasks**
> Array<TaskDto> getAllTasks()


### Example

```typescript
import {
    TaskApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaskApi(configuration);

const { status, data } = await apiInstance.getAllTasks();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<TaskDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of tasks |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTaskById**
> TaskDto getTaskById()


### Example

```typescript
import {
    TaskApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaskApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getTaskById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**TaskDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The task with the given ID |  -  |
|**404** | Task not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTasksByAssignee**
> Array<TaskDto> getTasksByAssignee()


### Example

```typescript
import {
    TaskApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaskApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getTasksByAssignee(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**Array<TaskDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of tasks assigned to the user |  -  |
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTasksByProject**
> Array<TaskDto> getTasksByProject()


### Example

```typescript
import {
    TaskApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaskApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getTasksByProject(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**Array<TaskDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of tasks for the project |  -  |
|**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateTask**
> TaskDto updateTask(taskDto)


### Example

```typescript
import {
    TaskApi,
    Configuration,
    TaskDto
} from './api';

const configuration = new Configuration();
const apiInstance = new TaskApi(configuration);

let id: number; // (default to undefined)
let taskDto: TaskDto; //

const { status, data } = await apiInstance.updateTask(
    id,
    taskDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **taskDto** | **TaskDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**TaskDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated task |  -  |
|**404** | Task not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

