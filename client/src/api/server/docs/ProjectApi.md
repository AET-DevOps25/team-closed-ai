# ProjectApi

All URIs are relative to *http://localhost:80*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addTasksToProject**](#addtaskstoproject) | **POST** /projects/{id}/tasks | Add tasks to a project|
|[**createProject**](#createproject) | **POST** /projects | Create a new project|
|[**deleteProject**](#deleteproject) | **DELETE** /projects/{id} | Delete a project|
|[**getAllProjects**](#getallprojects) | **GET** /projects | Get all projects|
|[**getProjectById**](#getprojectbyid) | **GET** /projects/{id} | Get a project by ID|
|[**updateProject**](#updateproject) | **PUT** /projects/{id} | Update a project|

# **addTasksToProject**
> Array<TaskDto> addTasksToProject(addTaskDto)


### Example

```typescript
import {
    ProjectApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectApi(configuration);

let id: number; // (default to undefined)
let addTaskDto: Array<AddTaskDto>; //

const { status, data } = await apiInstance.addTasksToProject(
    id,
    addTaskDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addTaskDto** | **Array<AddTaskDto>**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**Array<TaskDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The created tasks |  -  |
|**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createProject**
> ProjectDto createProject(createProjectDto)


### Example

```typescript
import {
    ProjectApi,
    Configuration,
    CreateProjectDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectApi(configuration);

let createProjectDto: CreateProjectDto; //

const { status, data } = await apiInstance.createProject(
    createProjectDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createProjectDto** | **CreateProjectDto**|  | |


### Return type

**ProjectDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The created project |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteProject**
> deleteProject()


### Example

```typescript
import {
    ProjectApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteProject(
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
|**200** | Project deleted successfully |  -  |
|**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllProjects**
> Array<ProjectDto> getAllProjects()


### Example

```typescript
import {
    ProjectApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectApi(configuration);

const { status, data } = await apiInstance.getAllProjects();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ProjectDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of projects |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProjectById**
> ProjectDto getProjectById()


### Example

```typescript
import {
    ProjectApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getProjectById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ProjectDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The project with the given ID |  -  |
|**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateProject**
> ProjectDto updateProject(projectDto)


### Example

```typescript
import {
    ProjectApi,
    Configuration,
    ProjectDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectApi(configuration);

let id: number; // (default to undefined)
let projectDto: ProjectDto; //

const { status, data } = await apiInstance.updateProject(
    id,
    projectDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectDto** | **ProjectDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ProjectDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated project |  -  |
|**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

