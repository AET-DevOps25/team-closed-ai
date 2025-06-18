# server_api.ProjectApi

All URIs are relative to *http://localhost:80*

Method | HTTP request | Description
------------- | ------------- | -------------
[**add_task_to_project**](ProjectApi.md#add_task_to_project) | **POST** /projects/{id}/tasks | Add a task to a project
[**create_project**](ProjectApi.md#create_project) | **POST** /projects | Create a new project
[**delete_project**](ProjectApi.md#delete_project) | **DELETE** /projects/{id} | Delete a project
[**get_all_projects**](ProjectApi.md#get_all_projects) | **GET** /projects | Get all projects
[**get_project_by_id**](ProjectApi.md#get_project_by_id) | **GET** /projects/{id} | Get a project by ID
[**update_project**](ProjectApi.md#update_project) | **PUT** /projects/{id} | Update a project


# **add_task_to_project**
> TaskDto add_task_to_project(id, add_task_dto)

Add a task to a project

### Example


```python
import server_api
from server_api.models.add_task_dto import AddTaskDto
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
    api_instance = server_api.ProjectApi(api_client)
    id = 56 # int | 
    add_task_dto = server_api.AddTaskDto() # AddTaskDto | 

    try:
        # Add a task to a project
        api_response = api_instance.add_task_to_project(id, add_task_dto)
        print("The response of ProjectApi->add_task_to_project:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ProjectApi->add_task_to_project: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **add_task_dto** | [**AddTaskDto**](AddTaskDto.md)|  | 

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
**200** | The created task |  -  |
**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **create_project**
> ProjectDto create_project(create_project_dto)

Create a new project

### Example


```python
import server_api
from server_api.models.create_project_dto import CreateProjectDto
from server_api.models.project_dto import ProjectDto
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
    api_instance = server_api.ProjectApi(api_client)
    create_project_dto = server_api.CreateProjectDto() # CreateProjectDto | 

    try:
        # Create a new project
        api_response = api_instance.create_project(create_project_dto)
        print("The response of ProjectApi->create_project:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ProjectApi->create_project: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **create_project_dto** | [**CreateProjectDto**](CreateProjectDto.md)|  | 

### Return type

[**ProjectDto**](ProjectDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The created project |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_project**
> delete_project(id)

Delete a project

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
    api_instance = server_api.ProjectApi(api_client)
    id = 56 # int | 

    try:
        # Delete a project
        api_instance.delete_project(id)
    except Exception as e:
        print("Exception when calling ProjectApi->delete_project: %s\n" % e)
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
**200** | Project deleted successfully |  -  |
**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_all_projects**
> List[ProjectDto] get_all_projects()

Get all projects

### Example


```python
import server_api
from server_api.models.project_dto import ProjectDto
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
    api_instance = server_api.ProjectApi(api_client)

    try:
        # Get all projects
        api_response = api_instance.get_all_projects()
        print("The response of ProjectApi->get_all_projects:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ProjectApi->get_all_projects: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[ProjectDto]**](ProjectDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A list of projects |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_project_by_id**
> ProjectDto get_project_by_id(id)

Get a project by ID

### Example


```python
import server_api
from server_api.models.project_dto import ProjectDto
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
    api_instance = server_api.ProjectApi(api_client)
    id = 56 # int | 

    try:
        # Get a project by ID
        api_response = api_instance.get_project_by_id(id)
        print("The response of ProjectApi->get_project_by_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ProjectApi->get_project_by_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**ProjectDto**](ProjectDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The project with the given ID |  -  |
**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update_project**
> ProjectDto update_project(id, project_dto)

Update a project

### Example


```python
import server_api
from server_api.models.project_dto import ProjectDto
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
    api_instance = server_api.ProjectApi(api_client)
    id = 56 # int | 
    project_dto = server_api.ProjectDto() # ProjectDto | 

    try:
        # Update a project
        api_response = api_instance.update_project(id, project_dto)
        print("The response of ProjectApi->update_project:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ProjectApi->update_project: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **project_dto** | [**ProjectDto**](ProjectDto.md)|  | 

### Return type

[**ProjectDto**](ProjectDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The updated project |  -  |
**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

