# server_api.TaskApi

All URIs are relative to *http://localhost:80*

Method | HTTP request | Description
------------- | ------------- | -------------
[**change_task_status**](TaskApi.md#change_task_status) | **PATCH** /tasks/{id}/status | Change the status of a task
[**delete_task**](TaskApi.md#delete_task) | **DELETE** /tasks/{id} | Delete a task
[**get_all_tasks**](TaskApi.md#get_all_tasks) | **GET** /tasks | Get all tasks
[**get_task_by_id**](TaskApi.md#get_task_by_id) | **GET** /tasks/{id} | Get a task by ID
[**get_tasks_by_assignee**](TaskApi.md#get_tasks_by_assignee) | **GET** /tasks/by-assignee/{id} | Get tasks by assignee
[**get_tasks_by_project**](TaskApi.md#get_tasks_by_project) | **GET** /tasks/by-project/{id} | Get tasks by project
[**update_task**](TaskApi.md#update_task) | **PUT** /tasks/{id} | Update a task


# **change_task_status**
> TaskDto change_task_status(id, status)

Change the status of a task

### Example


```python
import server_api
from server_api.models.task_dto import TaskDto
from server_api.models.task_status import TaskStatus
from server_api.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:80
# See configuration.py for a list of all supported configuration parameters.
configuration = server_api.Configuration(
    host = "http://localhost:80"
)


# Enter a context with an instance of the API client
with server_api.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = server_api.TaskApi(api_client)
    id = 56 # int | 
    status = server_api.TaskStatus() # TaskStatus | 

    try:
        # Change the status of a task
        api_response = api_instance.change_task_status(id, status)
        print("The response of TaskApi->change_task_status:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TaskApi->change_task_status: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **status** | [**TaskStatus**](.md)|  | 

### Return type

[**TaskDto**](TaskDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The updated task |  -  |
**404** | Task not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_task**
> delete_task(id)

Delete a task

### Example


```python
import server_api
from server_api.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:80
# See configuration.py for a list of all supported configuration parameters.
configuration = server_api.Configuration(
    host = "http://localhost:80"
)


# Enter a context with an instance of the API client
with server_api.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = server_api.TaskApi(api_client)
    id = 56 # int | 

    try:
        # Delete a task
        api_instance.delete_task(id)
    except Exception as e:
        print("Exception when calling TaskApi->delete_task: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

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
**200** | Task deleted successfully |  -  |
**404** | Task not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_all_tasks**
> List[TaskDto] get_all_tasks()

Get all tasks

### Example


```python
import server_api
from server_api.models.task_dto import TaskDto
from server_api.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:80
# See configuration.py for a list of all supported configuration parameters.
configuration = server_api.Configuration(
    host = "http://localhost:80"
)


# Enter a context with an instance of the API client
with server_api.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = server_api.TaskApi(api_client)

    try:
        # Get all tasks
        api_response = api_instance.get_all_tasks()
        print("The response of TaskApi->get_all_tasks:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TaskApi->get_all_tasks: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[TaskDto]**](TaskDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A list of tasks |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_task_by_id**
> TaskDto get_task_by_id(id)

Get a task by ID

### Example


```python
import server_api
from server_api.models.task_dto import TaskDto
from server_api.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:80
# See configuration.py for a list of all supported configuration parameters.
configuration = server_api.Configuration(
    host = "http://localhost:80"
)


# Enter a context with an instance of the API client
with server_api.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = server_api.TaskApi(api_client)
    id = 56 # int | 

    try:
        # Get a task by ID
        api_response = api_instance.get_task_by_id(id)
        print("The response of TaskApi->get_task_by_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TaskApi->get_task_by_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**TaskDto**](TaskDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The task with the given ID |  -  |
**404** | Task not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_tasks_by_assignee**
> List[TaskDto] get_tasks_by_assignee(id)

Get tasks by assignee

### Example


```python
import server_api
from server_api.models.task_dto import TaskDto
from server_api.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:80
# See configuration.py for a list of all supported configuration parameters.
configuration = server_api.Configuration(
    host = "http://localhost:80"
)


# Enter a context with an instance of the API client
with server_api.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = server_api.TaskApi(api_client)
    id = 56 # int | 

    try:
        # Get tasks by assignee
        api_response = api_instance.get_tasks_by_assignee(id)
        print("The response of TaskApi->get_tasks_by_assignee:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TaskApi->get_tasks_by_assignee: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**List[TaskDto]**](TaskDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A list of tasks assigned to the user |  -  |
**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_tasks_by_project**
> List[TaskDto] get_tasks_by_project(id)

Get tasks by project

### Example


```python
import server_api
from server_api.models.task_dto import TaskDto
from server_api.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:80
# See configuration.py for a list of all supported configuration parameters.
configuration = server_api.Configuration(
    host = "http://localhost:80"
)


# Enter a context with an instance of the API client
with server_api.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = server_api.TaskApi(api_client)
    id = 56 # int | 

    try:
        # Get tasks by project
        api_response = api_instance.get_tasks_by_project(id)
        print("The response of TaskApi->get_tasks_by_project:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TaskApi->get_tasks_by_project: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**List[TaskDto]**](TaskDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A list of tasks for the project |  -  |
**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update_task**
> TaskDto update_task(id, task_dto)

Update a task

### Example


```python
import server_api
from server_api.models.task_dto import TaskDto
from server_api.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:80
# See configuration.py for a list of all supported configuration parameters.
configuration = server_api.Configuration(
    host = "http://localhost:80"
)


# Enter a context with an instance of the API client
with server_api.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = server_api.TaskApi(api_client)
    id = 56 # int | 
    task_dto = server_api.TaskDto() # TaskDto | 

    try:
        # Update a task
        api_response = api_instance.update_task(id, task_dto)
        print("The response of TaskApi->update_task:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TaskApi->update_task: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **task_dto** | [**TaskDto**](TaskDto.md)|  | 

### Return type

[**TaskDto**](TaskDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The updated task |  -  |
**404** | Task not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

