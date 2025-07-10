# TaskDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | 
**title** | **str** |  | 
**description** | **str** |  | 
**task_status** | [**TaskStatus**](TaskStatus.md) |  | 
**created_at** | **datetime** |  | 
**updated_at** | **datetime** |  | 
**comments** | **List[str]** |  | 
**attachments** | **List[str]** |  | 
**assignee_id** | **int** |  | [optional] 

## Example

```python
from openapi_client.models.task_dto import TaskDto

# TODO update the JSON string below
json = "{}"
# create an instance of TaskDto from a JSON string
task_dto_instance = TaskDto.from_json(json)
# print the JSON string representation of the object
print(TaskDto.to_json())

# convert the object into a dict
task_dto_dict = task_dto_instance.to_dict()
# create an instance of TaskDto from a dict
task_dto_from_dict = TaskDto.from_dict(task_dto_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


