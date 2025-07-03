# AddTaskDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **str** |  | 
**description** | **str** |  | 
**task_status** | [**TaskStatus**](TaskStatus.md) |  | [optional] 
**assignee_id** | **int** |  | [optional] 

## Example

```python
from openapi_client.models.add_task_dto import AddTaskDto

# TODO update the JSON string below
json = "{}"
# create an instance of AddTaskDto from a JSON string
add_task_dto_instance = AddTaskDto.from_json(json)
# print the JSON string representation of the object
print(AddTaskDto.to_json())

# convert the object into a dict
add_task_dto_dict = add_task_dto_instance.to_dict()
# create an instance of AddTaskDto from a dict
add_task_dto_from_dict = AddTaskDto.from_dict(add_task_dto_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


