# openapi_client.UserApi

All URIs are relative to *http://localhost:80*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_user**](UserApi.md#create_user) | **POST** /users | Create a new user
[**delete_user**](UserApi.md#delete_user) | **DELETE** /users/{id} | Delete a user
[**get_all_users**](UserApi.md#get_all_users) | **GET** /users | Get all users
[**get_user_by_id**](UserApi.md#get_user_by_id) | **GET** /users/{id} | Get a user by ID
[**update_user**](UserApi.md#update_user) | **PUT** /users/{id} | Update a user


# **create_user**
> UserDto create_user(create_user_dto)

Create a new user

### Example


```python
import openapi_client
from openapi_client.models.create_user_dto import CreateUserDto
from openapi_client.models.user_dto import UserDto
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:80
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost:80"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.UserApi(api_client)
    create_user_dto = openapi_client.CreateUserDto() # CreateUserDto | 

    try:
        # Create a new user
        api_response = api_instance.create_user(create_user_dto)
        print("The response of UserApi->create_user:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling UserApi->create_user: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **create_user_dto** | [**CreateUserDto**](CreateUserDto.md)|  | 

### Return type

[**UserDto**](UserDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The created user |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_user**
> delete_user(id)

Delete a user

### Example


```python
import openapi_client
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:80
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost:80"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.UserApi(api_client)
    id = 56 # int | 

    try:
        # Delete a user
        api_instance.delete_user(id)
    except Exception as e:
        print("Exception when calling UserApi->delete_user: %s\n" % e)
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
**200** | User deleted successfully |  -  |
**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_all_users**
> List[UserDto] get_all_users()

Get all users

### Example


```python
import openapi_client
from openapi_client.models.user_dto import UserDto
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:80
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost:80"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.UserApi(api_client)

    try:
        # Get all users
        api_response = api_instance.get_all_users()
        print("The response of UserApi->get_all_users:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling UserApi->get_all_users: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[UserDto]**](UserDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A list of users |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_user_by_id**
> UserDto get_user_by_id(id)

Get a user by ID

### Example


```python
import openapi_client
from openapi_client.models.user_dto import UserDto
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:80
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost:80"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.UserApi(api_client)
    id = 56 # int | 

    try:
        # Get a user by ID
        api_response = api_instance.get_user_by_id(id)
        print("The response of UserApi->get_user_by_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling UserApi->get_user_by_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**UserDto**](UserDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The user with the given ID |  -  |
**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update_user**
> UserDto update_user(id, user_dto)

Update a user

### Example


```python
import openapi_client
from openapi_client.models.user_dto import UserDto
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:80
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost:80"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.UserApi(api_client)
    id = 56 # int | 
    user_dto = openapi_client.UserDto() # UserDto | 

    try:
        # Update a user
        api_response = api_instance.update_user(id, user_dto)
        print("The response of UserApi->update_user:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling UserApi->update_user: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **user_dto** | [**UserDto**](UserDto.md)|  | 

### Return type

[**UserDto**](UserDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The updated user |  -  |
**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

